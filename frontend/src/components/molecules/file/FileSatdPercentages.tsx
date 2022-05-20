import {FC} from "react";
import {RestGitCommentStatistics} from "../../../types/git";
import {PercentageBar} from "../../atoms/graphs/PercentageBar";
import {Label} from "../../atoms/typography/Label";

interface FileSatdPercentagesProps {
  statistics: RestGitCommentStatistics;
}

export const FileSatdPercentages: FC<FileSatdPercentagesProps> = ({statistics}) => {
  const debts = Object.entries(statistics.total.perType).filter(([type]) => type !== "NOT_DEBT");

  return statistics.total.amount > 0 ? (
    statistics.total.debt === 0 ? (
      <Label color="green">No SATD</Label>
    ) : (
      <PercentageBar
        percentages={debts.map(([, value]) => (value / statistics.total.debt) * 100)}
        labels={debts.map(([key]) => key)}
      />
    )
  ) : null;
};
