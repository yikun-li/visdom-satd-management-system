import {FC, useMemo, useState} from "react";
import {getGitRepositoryStatistics} from "../../../../backend/remote/requests";
import {useRequestResource} from "../../../../hooks/useRequestResource";
import {LineChart} from "../../../atoms/graphs/LineChart";
import {Panel} from "../../../atoms/panel/Panel";

interface DebtOverTimeChartPanelProps {
  repositoryId: number;
  branch: string;
}

export interface OverTimeSettings {
  from: Date;
  to: Date;
  interval: number;
}

const MAX_POINTS = 15;

const to = new Date();
const from = new Date();
from.setFullYear(to.getFullYear() - 10);
const interval = Math.round((to.getTime() - from.getTime()) / (MAX_POINTS * 1000));

export const DebtOverTimeChartPanel: FC<DebtOverTimeChartPanelProps> = ({repositoryId, branch}) => {
  const [settings, setSettings] = useState<OverTimeSettings>({to, from, interval});
  const vars = useMemo(
    () => [settings.from.toISOString(), settings.to.toISOString(), settings.interval] as const,
    [settings]
  );
  const statistics = useRequestResource(getGitRepositoryStatistics, [repositoryId, branch, ...vars]);

  return (
    <Panel title="Debt over time" loading={statistics.loading}>
      {!statistics.loading && statistics.success && (
        <LineChart
          data={statistics.body.data
            .sort((a, b) => new Date(a.commit.date).getTime() - new Date(b.commit.date).getTime())
            .map(({commit, statistics}) => ({
              date: new Date(commit.date).getTime(),
              value: statistics.total.debt
            }))}
        />
      )}
    </Panel>
  );
};
