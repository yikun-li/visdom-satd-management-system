import {FC} from "react";
import {RestGitCommentStatistics} from "../../../types/git";
import {Label} from "../../atoms/typography/Label";

interface FileCommentsStatisticsProps {
  statistics: RestGitCommentStatistics;
}

export const FileCommentsStatistics: FC<FileCommentsStatisticsProps> = ({statistics}) => {
  return statistics.total.amount === 0 ? (
    <Label color="blue">No comments</Label>
  ) : (
    <strong>{statistics.total.amount}</strong>
  );
};
