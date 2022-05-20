import {useInputValue, useSubmitting} from "formorama";
import {FC} from "react";
import {Button} from "../../../../atoms/buttons/Button";
import {Stack} from "../../../../atoms/layout/Stack";
import {FormItem} from "../../../../molecules/form/FormItem";
import {ManagedRadioListInput} from "../../../../molecules/form/managed/ManagedRadioListInput";
import {ManagedTextInput} from "../../../../molecules/form/managed/ManagedTextInput";
import {RadioListItem} from "../../../../molecules/form/radio/RadioListItem";

interface AddJiraSourceDetailsProps {}

export const AddJiraSourceDetails: FC<AddJiraSourceDetailsProps> = () => {
  const [auth] = useInputValue(["auth"]);
  const submitting = useSubmitting();

  return (
    <Stack spacing="l">
      <FormItem label="Source name" input={<ManagedTextInput name="name" placeholder="A name for the source" />} />
      <FormItem
        label="Jira Service URL"
        input={<ManagedTextInput name="url" placeholder="E.g. https://issues.apache.org/jira/" />}
      />
      <ManagedRadioListInput name="auth">
        <RadioListItem value="no">Anonymous</RadioListItem>
        <RadioListItem value="userpass">Username/Password</RadioListItem>
      </ManagedRadioListInput>

      {auth === "userpass" && (
        <Stack spacing="l">
          <FormItem
            label="Jira Username"
            input={<ManagedTextInput name="username" placeholder="Your username for the Jira Service" />}
          />
          <FormItem
            label="Jira Password"
            input={
              <ManagedTextInput name="password" type="password" placeholder="Your password for the Jira Service" />
            }
          />
        </Stack>
      )}

      <Stack spacing="m" horizontal end>
        <Button type="color" tint="blue" submit loading={submitting}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
};
