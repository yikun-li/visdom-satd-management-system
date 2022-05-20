import {Form, useForm, useInputValue} from "formorama";
import {FC} from "react";
import {postGitRepositorySnap} from "../../../../backend/remote/requests/postGitRepositorySnap";
import {CloseModalFn} from "../../../../hooks/useModal";
import {useStartJob} from "../../../../hooks/useStartJob";
import {RestGitBranch, RestGitRepository} from "../../../../types/git";
import {RestJobState} from "../../../../types/job";
import {Button} from "../../../atoms/buttons/Button";
import {Stack} from "../../../atoms/layout/Stack";
import {Heading} from "../../../atoms/typography/Heading";
import {Paragraph} from "../../../atoms/typography/Paragraph";
import {ManagedRadioListInput} from "../../../molecules/form/managed/ManagedRadioListInput";
import {RadioListItem} from "../../../molecules/form/radio/RadioListItem";

export interface ScanRepositoryModalArgs {
  repository: RestGitRepository;
  branch: RestGitBranch;
}

interface ScanRepositoryModalProps extends ScanRepositoryModalArgs {
  onClose: CloseModalFn;
}

interface ScanRepositoryFormValues {
  scanType: null | "full" | "dates" | "last-snapshot";
}

export const ScanRepositoryModal: FC<ScanRepositoryModalProps> = ({onClose, repository, branch}) => {
  const [job, startJob] = useStartJob(postGitRepositorySnap, null);
  const form = useForm<ScanRepositoryFormValues>();
  const [scanType] = useInputValue(["scanType"], form) as [ScanRepositoryFormValues["scanType"]];

  const handleSubmit = async (values: ScanRepositoryFormValues) => {
    await startJob(repository.id, {
      branch: branch.name,
      from: null,
      to: null,
      createKeySnapshotEvery: 100,
      createSnapshotEvery: 1
    });
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Stack spacing="l">
        <Heading>Scan branch</Heading>

        <ManagedRadioListInput name="scanType">
          <RadioListItem value="full">Full scan</RadioListItem>
          <RadioListItem value="dates">Scan between dates</RadioListItem>
          <RadioListItem value="last-snapshot">Scan from latest scanned commit</RadioListItem>
        </ManagedRadioListInput>

        {scanType === "dates" && (
          <>
            <Paragraph>Date picker</Paragraph>
          </>
        )}

        <Button type="color" tint="blue" submit loading={job?.state === RestJobState.RUNNING}>
          Start scanning
        </Button>
      </Stack>
    </Form>
  );
};
