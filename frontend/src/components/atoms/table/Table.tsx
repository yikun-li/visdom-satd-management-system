import c from "classnames";
import {Children, FC, PropsWithChildren} from "react";
import {ClassNameProp} from "../../../types/props";
import {Sentry} from "../activity/Sentry";
import s from "./Table.module.scss";
import {TableLoading} from "./TableLoading";
import {TableRow} from "./TableRow";

interface TableProps<Item> extends ClassNameProp {
  data: Item[];
  loading?: boolean;
  headRowClass?: string;

  keyExtractor(item: Item): any;

  onRowClick?(item: Item): void;

  rowClass?(item: Item): string;
}

export function Table<Item>({
  children,
  data,
  keyExtractor,
  loading,
  onRowClick,
  headRowClass,
  rowClass,
  className
}: PropsWithChildren<TableProps<Item>>): ReturnType<FC> {
  return (
    <table className={c(s.table, data.length === 0 && s.empty, loading && s.loading, className)}>
      <thead>
        <tr className={c(headRowClass)}>{children}</tr>
      </thead>
      <tbody>
        {loading && data.length === 0 && <TableLoading colSpan={Children.count(children)} />}
        {loading !== undefined && data.length > 0 && (
          <tr className={s.hidden}>
            <td>
              <div className={s.loadingOverlay}>
                <Sentry />
              </div>
            </td>
          </tr>
        )}
        {data.map((item) => (
          <TableRow
            className={c(rowClass && rowClass(item))}
            item={item}
            key={keyExtractor(item)}
            onClick={onRowClick && (() => onRowClick(item))}
          >
            {children}
          </TableRow>
        ))}
      </tbody>
    </table>
  );
}
