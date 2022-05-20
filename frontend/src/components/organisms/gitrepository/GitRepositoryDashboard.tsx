import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {RestGitBranch, RestGitCommit, RestGitRepository, RestGitSnapshot} from "../../../types/git";
import {CommentTypePieChartPanel} from "./panels/CommentTypePieChartPanel";
import {DebtOverTimeChartPanel} from "./panels/DebtOverTimeChartPanel";
import {DebtTypePieChartPanel} from "./panels/DebtTypePieChartPanel";
import {GitRepositoryInfoPanel} from "./panels/GitRepositoryInfoPanel";
import {GitRepositoryNumbers} from "./panels/GitRepositoryNumbers";

interface GitRepositoryDashboardProps {
  repository: RestGitRepository;
  branch: RestGitBranch;
  latestCommit: RestGitCommit | null;
  latestSnapshot: RestGitSnapshot | null;
}

export const GitRepositoryDashboard: FC<GitRepositoryDashboardProps> = ({
  repository,
  branch,
  latestCommit,
  latestSnapshot
}) => {
  return (
    <>
      <Row>
        <Col xl={6} lg={12}>
          <GitRepositoryInfoPanel repository={repository} latestCommit={latestCommit} />
        </Col>
        <Col xl={6} lg={12}>
          <GitRepositoryNumbers
            commits={branch.totalCommits ?? 0}
            scannedCommits={branch.totalSnapped ?? 0}
            comments={latestSnapshot?.statistics?.total.amount ?? null}
            debt={latestSnapshot?.statistics?.total.debt ?? null}
          />
        </Col>
      </Row>
      {latestSnapshot?.statistics && (
        <Row>
          <Col xl={3} lg={6} md={12}>
            <DebtTypePieChartPanel statistics={latestSnapshot.statistics} />
          </Col>
          <Col xl={3} lg={6} md={12}>
            <CommentTypePieChartPanel statistics={latestSnapshot.statistics} />
          </Col>
          <Col xl={6} lg={12} md={12}>
            <DebtOverTimeChartPanel repositoryId={repository.id} branch={branch.name} />
          </Col>
        </Row>
      )}
    </>
  );
};
