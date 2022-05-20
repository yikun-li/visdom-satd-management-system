import {Form, useForm, useSubmitting} from "formorama";
import {FC} from "react";
import {postProject} from "../../../backend/remote/requests";
import {RequestService} from "../../../backend/services/request";
import {CloseModalFn} from "../../../hooks/useModal";
import {useService} from "../../../hooks/useService";
import {RestProject} from "../../../types/project";
import {Button} from "../../atoms/buttons/Button";
import {FormItem} from "../../molecules/form/FormItem";
import {ManagedTextInput} from "../../molecules/form/managed/ManagedTextInput";
import {Stack} from "../../atoms/layout/Stack";
import {Heading} from "../../atoms/typography/Heading";

export interface CreateProjectModalArgs {}

interface CreateProjectModalProps extends CreateProjectModalArgs {
  onClose: CloseModalFn<[RestProject]>;
}

interface CreateProjectForm {
  name: string;
}

function validate({name}: CreateProjectForm): any {
  const errors: any = {};
  if (!name || name.length < 1) errors.name = "Please enter a name";
  return errors;
}

export const CreateProjectModal: FC<CreateProjectModalProps> = ({onClose}) => {
  const requester = useService(RequestService);
  const form = useForm<CreateProjectForm>({validate});
  const submitting = useSubmitting(form);

  const handleSubmit = async (values: CreateProjectForm) => {
    try {
      const response = await requester.executeAndThrow(postProject(values));
      onClose(response.body);
    } catch (e) {}
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Stack spacing="l">
        <Heading>Create project</Heading>
        <FormItem label="Project name" input={<ManagedTextInput name="name" placeholder="A name for the project" />} />
        <Button loading={submitting} type="color" tint="blue" submit>
          Create project
        </Button>
      </Stack>
    </Form>
  );
};
