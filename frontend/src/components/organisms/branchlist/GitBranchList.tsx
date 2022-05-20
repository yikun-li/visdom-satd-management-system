import {useRouter} from "next/router";
import {FC} from "react";
import {postGitRepositoryBranches} from "../../../backend/remote/requests";
import {usePage} from "../../../hooks/usePage";
import {useServerResponse} from "../../../hooks/useServerResponse";
import {useStartJob} from "../../../hooks/useStartJob";
import {RestGitBranch, RestGitRepository} from "../../../types/git";
import {RestJobState} from "../../../types/job";
import {RestServerResponse} from "../../../types/response";
import {Heading} from "../../atoms/typography/Heading";
import {BranchesTable} from "../../molecules/tables/BranchesTable";

interface GitBranchListProps {
  serverResponse: RestServerResponse<RestGitBranch[]>;
  defaultBranch: string;
  currentBranch: string;
  repository: RestGitRepository;

  onOpenScan(branch: RestGitBranch): void;

  onReload(): void;
}

export const GitBranchList: FC<GitBranchListProps> = ({
  serverResponse,
  repository,
  defaultBranch,
  currentBranch,
  onOpenScan,
  onReload
}) => {
  const router = useRouter();
  const {to, query} = usePage();
  const response = useServerResponse(serverResponse);
  const [trackBranchJob, startTrackBranchJob] = useStartJob(postGitRepositoryBranches, (body) => body.storeJob, {
    onDone: () => {
      response.reload().catch(() => void 0);
      onReload();
    }
  });

  const handleClick = (branch: RestGitBranch) => {
    router.push(...to({...query.search, branch: branch.name})).catch(() => void 0);
  };

  return response.loading || response.success ? (
    <BranchesTable
      branches={response.loading ? null : response.body}
      onClick={handleClick}
      defaultBranch={defaultBranch}
      currentBranch={currentBranch}
      loading={response.loading || trackBranchJob?.state === RestJobState.RUNNING}
      onScan={onOpenScan}
      onTrackBranch={(branch) => startTrackBranchJob(repository.id, branch.name)}
    />
  ) : (
    <Heading>Failed</Heading>
  );
};
