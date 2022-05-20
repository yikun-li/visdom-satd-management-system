import {FC} from "react";
import {CommentType, RestGitCommentStatistics} from "../../../../types/git";
import {CommentTypeDescr} from "../../../../util/descriptions";
import {DebtTypePieGraph} from "../../../atoms/graphs/DebtTypePieGraph";
import {Panel} from "../../../atoms/panel/Panel";

interface CommentTypePieChartPanelProps {
  statistics: RestGitCommentStatistics;
}

export const CommentTypePieChartPanel: FC<CommentTypePieChartPanelProps> = ({statistics}) => {
  return (
    <Panel title="SATD per comment type">
      <DebtTypePieGraph
        data={Object.entries(statistics.perType).map(([type, data]) => ({
          type,
          debt: data.debt,
          total: data.amount
        }))}
        dataKey="debt"
        nameKey="type"
        formatName={(name) => `${CommentTypeDescr[name as CommentType].name} comment`}
      />
    </Panel>
  );
};
