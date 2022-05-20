import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {DebtType} from "../../../../types/debt";
import {RestJiraProjectStatistics} from "../../../../types/jira";
import {DebtTypeDescr} from "../../../../util/descriptions";
import {DebtTypePieGraph} from "../../../atoms/graphs/DebtTypePieGraph";
import {Panel} from "../../../atoms/panel/Panel";

interface JiraPieChartsProps {
  statistics: RestJiraProjectStatistics | null;
  loading: boolean;
}

export const JiraPieCharts: FC<JiraPieChartsProps> = ({statistics, loading}) => {
  return (
    <Row>
      <Col xl={3} lg={6} md={12}>
        <Panel title="SATD in issue summary" loading={loading}>
          <DebtTypePieGraph
            data={
              statistics
                ? Object.entries(statistics.inSummary.perType).map(([type, amount]) => ({
                    type,
                    amount
                  }))
                : []
            }
            nameKey="type"
            dataKey="amount"
            formatName={(name) => DebtTypeDescr[name as DebtType].name}
          />
        </Panel>
      </Col>
      <Col xl={3} lg={6} md={12}>
        <Panel title="SATD in issue description" loading={loading}>
          <DebtTypePieGraph
            data={
              statistics
                ? Object.entries(statistics.inDescription.perType).map(([type, amount]) => ({
                    type,
                    amount
                  }))
                : []
            }
            nameKey="type"
            dataKey="amount"
            formatName={(name) => DebtTypeDescr[name as DebtType].name}
          />
        </Panel>
      </Col>
      <Col xl={3} lg={6} md={12}>
        <Panel title="SATD per issue type" loading={loading}>
          <DebtTypePieGraph
            data={
              statistics
                ? Object.entries(statistics.perIssueType).map(([type, {debt: amount}]) => ({
                    type,
                    amount
                  }))
                : []
            }
            nameKey="type"
            dataKey="amount"
            formatName={(name) => name}
          />
        </Panel>
      </Col>
      <Col xl={3} lg={6} md={12}>
        <Panel title="SATD per issue status" loading={loading}>
          <DebtTypePieGraph
            data={
              statistics
                ? Object.entries(statistics.perStatus).map(([status, {debt: amount}]) => ({
                    status,
                    amount
                  }))
                : []
            }
            nameKey="status"
            dataKey="amount"
            formatName={(name) => name}
          />
        </Panel>
      </Col>
    </Row>
  );
};
