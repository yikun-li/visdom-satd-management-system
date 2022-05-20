import {useSubmitting} from "formorama";
import {FC} from "react";
import {RestJiraProject} from "../../../../../types/jira";
import {Button} from "../../../../atoms/buttons/Button";
import {Stack} from "../../../../atoms/layout/Stack";
import {FormItem} from "../../../../molecules/form/FormItem";
import {ManagedDropdown} from "../../../../molecules/form/managed/ManagedDropdown";

interface AddJiraSourceProjectsProps {
  projects: RestJiraProject[];
}

export const AddJiraSourceProjects: FC<AddJiraSourceProjectsProps> = ({projects}) => {
  const submitting = useSubmitting();

  return (
    <Stack spacing="l">
      <FormItem
        label="Jira Project"
        input={
          <ManagedDropdown
            name="key"
            options={projects.map((project) => ({
              value: project.key,
              label: `${project.projectName} (${project.key})`
            }))}
          />
        }
      />
      <Stack spacing="m" horizontal end>
        <Button type="color" tint="blue" submit loading={submitting}>
          Add Jira Project
        </Button>
      </Stack>
    </Stack>
  );
};
