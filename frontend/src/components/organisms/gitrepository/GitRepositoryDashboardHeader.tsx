import {FC} from "react";
import {postGitRepositoryFetch} from "../../../backend/remote/requests/postGitRepositoryFetch";
import {postGitRepositoryScan} from "../../../backend/remote/requests/postGitRepositoryScan";
import {useStartJob} from "../../../hooks/useStartJob";
import {RestGitBranch} from "../../../types/git";
import {RestJobState} from "../../../types/job";
import {Button} from "../../atoms/buttons/Button";
import {ButtonWithContextMenu} from "../../atoms/contextmenu/ButtonWithContextMenu";
import {ContextMenuItem} from "../../atoms/contextmenu/ContextMenuItem";
import {Stack} from "../../atoms/layout/Stack";
import {PageHeader} from "../../molecules/header/PageHeader";

interface GitRepositoryDashboardHeaderProps {
  projectId: number;
  repositoryId: number;
  branch: RestGitBranch | null;

  onOpenScan(): void;

  onReload(): void;
}

export const GitRepositoryDashboardHeader: FC<GitRepositoryDashboardHeaderProps> = ({
  projectId,
  repositoryId,
  branch,
  onOpenScan,
  onReload
}) => {
  const [fetchJob, fetchRepository] = useStartJob(postGitRepositoryFetch, null, {onDone: onReload});
  const [scanJob, scanBranch] = useStartJob(postGitRepositoryScan, null, {onDone: onReload});

  return (
    <PageHeader title="Repository Dashboard">
      <ButtonWithContextMenu>
        <ContextMenuItem onClick={() => fetchRepository(repositoryId)}>Fetch Repository</ContextMenuItem>
        {branch && (
          <>
            <ContextMenuItem onClick={onOpenScan}>Index Commits</ContextMenuItem>
            <ContextMenuItem onClick={() => scanBranch(repositoryId, branch.name)}>Scan Comments</ContextMenuItem>
          </>
        )}
      </ButtonWithContextMenu>
    </PageHeader>
  );
};
