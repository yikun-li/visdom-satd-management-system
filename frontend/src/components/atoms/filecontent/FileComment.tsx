import c from "classnames";
import {FC, ReactElement} from "react";
import {DebtType} from "../../../types/debt";
import {RestGitFileComment} from "../../../types/git";
import s from "./FileComment.module.scss";

export interface FileCommentProps {
  comment: RestGitFileComment;

  // Used by the render function
  startLine: number;
  numLines: number;

  // Added by the render function
  elements?: ReactElement[];

  onClick(): void;
}

export const FileComment: FC<FileCommentProps> = ({elements, comment, onClick}) => {
  return (
    <span
      className={c(s.container, {
        [s.notAnalysed]: comment.debtType === DebtType.NOT_ANALYSED,
        [s.notDebt]: comment.debtType === DebtType.NOT_DEBT,
        [s.debt]: comment.debtType !== DebtType.NOT_ANALYSED && comment.debtType !== DebtType.NOT_DEBT
      })}
      onClick={onClick}
    >
      {elements}
      <span className={s.typeLabel}>{comment.debtType}</span>
    </span>
  );
};
