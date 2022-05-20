import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {postGitRepositoryBranches} from "../../../backend/remote/requests";
import {useStartJob} from "../../../hooks/useStartJob";
import {RestGitRepository} from "../../../types/git";
import {RestJobState} from "../../../types/job";
import {GitRepositoryInfoPanel} from "./panels/GitRepositoryInfoPanel";
import {UntrackedMessage} from "../../molecules/messages/UntrackedMessage";

interface GitRepositoryUntrackedDashboardProps {
  repository: RestGitRepository;
  branch: string;

  onReload(): void;
}

export const GitRepositoryUntrackedDashboard: FC<GitRepositoryUntrackedDashboardProps> = ({
  repository,
  branch,
  onReload
}) => {
  const [job, startJob] = useStartJob(postGitRepositoryBranches, (body) => body.storeJob, {
    onDone: onReload
  });

  return (
    <Row>
      <Col xl={6} lg={12} push={{xl: 6}}>
        <UntrackedMessage
          branch={branch}
          onClickTrack={() => startJob(repository.id, branch)}
          loading={job?.state === RestJobState.RUNNING}
        />
      </Col>
      <Col xl={6} lg={12} pull={{xl: 6}}>
        <GitRepositoryInfoPanel repository={repository} latestCommit={null} />
      </Col>
    </Row>
  );
};
