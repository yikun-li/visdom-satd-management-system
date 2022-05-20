import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {RestJiraProjectStatistics} from "../../../../types/jira";
import {RadialPercentageChart} from "../../../atoms/graphs/RadialPercentageChart";
import {NumberPanel} from "../../../atoms/panel/NumberPanel";

interface JiraProjectNumbersProps {
  total: number;
  open: number;
  debt: number;
  openDebt: number;
}

export const JiraProjectNumbers: FC<JiraProjectNumbersProps> = ({total, open, openDebt, debt}) => {
  return (
    <>
      <Row>
        <Col md={6} xs={12}>
          <NumberPanel title="Issues" number={total} />
        </Col>
        <Col md={6} xs={12}>
          <NumberPanel title="Open issues" number={open}>
            {total > 0 && (
              <div style={{width: 58, height: 58}}>
                <RadialPercentageChart percentage={(open / total) * 100} />
              </div>
            )}
          </NumberPanel>
        </Col>
      </Row>
      <Row>
        <Col md={6} xs={12}>
          <NumberPanel title="SATD issues" number={debt}>
            {total > 0 && (
              <div style={{width: 58, height: 58}}>
                <RadialPercentageChart percentage={(debt / total) * 100} />
              </div>
            )}
          </NumberPanel>
        </Col>
        <Col md={6} xs={12}>
          <NumberPanel title="Open SATD issues" number={openDebt}>
            {open > 0 && (
              <div style={{width: 58, height: 58}}>
                <RadialPercentageChart percentage={(openDebt / open) * 100} />
              </div>
            )}
          </NumberPanel>
        </Col>
      </Row>
    </>
  );
};
