import {Form, useForm, useInputValue, useSubmitting} from "formorama";
import {FC, useEffect} from "react";
import {postGitRepository} from "../../../../backend/remote/requests";
import {JobService} from "../../../../backend/services/job";
import {RequestService} from "../../../../backend/services/request";
import {useService} from "../../../../hooks/useService";
import {RestGitRepository} from "../../../../types/git";
import {Button} from "../../../atoms/buttons/Button";
import {FormItem} from "../../../molecules/form/FormItem";
import {ManagedRadioListInput} from "../../../molecules/form/managed/ManagedRadioListInput";
import {ManagedTextInput} from "../../../molecules/form/managed/ManagedTextInput";
import {Stack} from "../../../atoms/layout/Stack";
import {RadioListItem} from "../../../molecules/form/radio/RadioListItem";

interface GitSourceForm {
  name: string;
  url: string;
  auth: "no" | "userpass" | "publickey";
}

interface AddGitSourceFormProps {
  projectId: number;

  onSuccess(repository: RestGitRepository): void;
}

export const AddGitSourceForm: FC<AddGitSourceFormProps> = ({projectId, onSuccess}) => {
  const requester = useService(RequestService);
  const jobService = useService(JobService);
  const form = useForm<GitSourceForm>();
  const submitting = useSubmitting(form);
  const [auth] = useInputValue(["auth"], form);

  const handleSubmit = async (values: GitSourceForm) => {
    const response = await requester.executeAndThrow(postGitRepository({...values, projectId}));
    jobService.addJob(response.body.cloneJob).catch(() => void 0);
    onSuccess(response.body.repository);
  };

  useEffect(() => {
    form.change("auth", "no");
  }, [form]);

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Stack spacing="l">
        <FormItem label="Source name" input={<ManagedTextInput name="name" placeholder="A name for the source" />} />
        <FormItem
          label="Git repository URL"
          input={<ManagedTextInput name="url" placeholder="E.g. https://github.com/microsoft/vscode.git" />}
        />
        <ManagedRadioListInput name="auth">
          <RadioListItem value="no">No auth</RadioListItem>
          <RadioListItem value="userpass">Username/Password</RadioListItem>
          <RadioListItem value="publickey">Public key</RadioListItem>
        </ManagedRadioListInput>

        {auth === "userpass" && (
          <Stack spacing="l">
            <FormItem
              label="Username"
              input={<ManagedTextInput name="user" placeholder="E.g. https://github.com/microsoft/vscode.git" />}
            />
            <FormItem
              label="Password"
              input={<ManagedTextInput name="pass" placeholder="E.g. https://github.com/microsoft/vscode.git" />}
            />
          </Stack>
        )}

        <Stack spacing="m" horizontal end>
          <Button type="color" tint="blue" submit loading={submitting}>
            Add Git Repository
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
};
