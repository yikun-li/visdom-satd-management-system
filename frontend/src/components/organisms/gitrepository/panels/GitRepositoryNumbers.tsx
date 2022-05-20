import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {RadialPercentageChart} from "../../../atoms/graphs/RadialPercentageChart";
import {NumberPanel} from "../../../atoms/panel/NumberPanel";

interface GitRepositoryNumbersProps {
  commits: number;
  scannedCommits: number;
  comments: number | null;
  debt: number | null;
}

export const GitRepositoryNumbers: FC<GitRepositoryNumbersProps> = ({comments, commits, debt, scannedCommits}) => {
  return (
    <>
      <Row>
        <Col md={6} xs={12}>
          <NumberPanel title="Commits" number={commits} />
        </Col>
        <Col md={6} xs={12}>
          <NumberPanel title="Indexed commits" number={scannedCommits}>
            {commits > 0 && (
              <div style={{width: 58, height: 58}}>
                <RadialPercentageChart percentage={(scannedCommits / commits) * 100} />
              </div>
            )}
          </NumberPanel>
        </Col>
      </Row>
      {comments !== null && debt !== null && (
        <Row>
          <Col md={6} xs={12}>
            <NumberPanel title="Comments" number={comments} />
          </Col>
          <Col md={6} xs={12}>
            <NumberPanel title="SATD-comments" number={debt}>
              {comments > 0 && (
                <div style={{width: 58, height: 58}}>
                  <RadialPercentageChart percentage={(debt / comments) * 100} />
                </div>
              )}
            </NumberPanel>
          </Col>
        </Row>
      )}
    </>
  );
};
