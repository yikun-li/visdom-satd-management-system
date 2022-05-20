import {FC} from "react";
import {Sentry} from "../activity/Sentry";
import s from "./Table.module.scss";

interface TableLoadingProps {
  colSpan: number;
}

export const TableLoading: FC<TableLoadingProps> = ({colSpan}) => {
  return (
    <tr>
      <td colSpan={colSpan} className={s.loadingRow}>
        <div className={s.spinnerContainer}>
          <Sentry />
        </div>
      </td>
    </tr>
  );
};
