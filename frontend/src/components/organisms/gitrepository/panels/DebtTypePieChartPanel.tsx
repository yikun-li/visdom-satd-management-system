import {FC} from "react";
import {DebtType} from "../../../../types/debt";
import {RestGitCommentStatistics} from "../../../../types/git";
import {DebtTypeDescr} from "../../../../util/descriptions";
import {DebtTypePieGraph} from "../../../atoms/graphs/DebtTypePieGraph";
import {Panel} from "../../../atoms/panel/Panel";

interface DebtTypePieChartPanelProps {
  statistics: RestGitCommentStatistics;
}

export const DebtTypePieChartPanel: FC<DebtTypePieChartPanelProps> = ({statistics}) => {
  return (
    <Panel title="SATD types">
      <DebtTypePieGraph
        data={Object.entries(statistics.total.perType)
          .filter(([type]) => type !== DebtType.NOT_DEBT && type !== DebtType.NOT_ANALYSED)
          .map(([type, data]) => ({
            type: type as DebtType,
            value: data
          }))}
        dataKey="value"
        nameKey="type"
        formatName={(name) => DebtTypeDescr[name as DebtType].name}
      />
    </Panel>
  );
};
