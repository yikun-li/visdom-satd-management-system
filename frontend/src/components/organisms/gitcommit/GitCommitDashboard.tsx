import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {RestGitCommit} from "../../../types/git";
import {GitCommitInfoPanel} from "./panels/GitCommitInfoPanel";

interface GitCommitDashboardProps {
  commit: RestGitCommit;
}

export const GitCommitDashboard: FC<GitCommitDashboardProps> = ({commit}) => {
  return (
    <>
      <Row>
        <Col xl={6} lg={12}>
          <GitCommitInfoPanel commit={commit} />
        </Col>
      </Row>
    </>
  );
};
