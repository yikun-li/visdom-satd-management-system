import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {useServerResponse} from "../../../hooks/useServerResponse";
import {RestDebtStatistics} from "../../../types/debt";
import {RestJiraProject, RestJiraProjectStatistics} from "../../../types/jira";
import {RestServerResponse} from "../../../types/response";
import {JiraPieCharts} from "./panels/JiraPieCharts";
import {JiraProjectInfoPanel} from "./panels/JiraProjectInfoPanel";
import {JiraProjectNumbers} from "./panels/JiraProjectNumbers";

function openStatistics(statistics: RestJiraProjectStatistics): RestDebtStatistics {
  return Object.entries(statistics.perStatus)
    .filter(([status]) => !/(closed|resolved)/i.test(status))
    .map(([, statistics]) => statistics)
    .reduce((prev, curr) => ({...prev, debt: prev.debt + curr.debt, amount: prev.amount + curr.amount}), {
      perType: {},
      debt: 0,
      amount: 0
    });
}

interface JiraProjectDashboardProps {
  jiraProject: RestJiraProject;
  statisticsResponse: RestServerResponse<RestJiraProjectStatistics>;
}

export const JiraProjectDashboard: FC<JiraProjectDashboardProps> = ({jiraProject, statisticsResponse}) => {
  const statistics = useServerResponse(statisticsResponse);

  return (
    <>
      <Row>
        <Col xl={6} lg={12}>
          <JiraProjectInfoPanel jiraProject={jiraProject} />
        </Col>
        <Col xl={6} lg={12}>
          {!statistics.loading && statistics.success && (
            <JiraProjectNumbers
              total={statistics.body.inSummary.amount}
              debt={statistics.body.inSummary.debt}
              open={openStatistics(statistics.body).amount}
              openDebt={openStatistics(statistics.body).debt}
            />
          )}
        </Col>
      </Row>
      <JiraPieCharts
        statistics={!statistics.loading && statistics.success ? statistics.body : null}
        loading={statistics.loading}
      />
    </>
  );
};
