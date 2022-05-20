import c from "classnames";
import {Children, FC, isValidElement, PropsWithChildren} from "react";
import {ClassNameProp} from "../../../types/props";
import s from "./Table.module.scss";
import {TableColumn, TableColumnProps} from "./TableColumn";
import {TableItemColumn} from "./TableItemColumn";

interface TableRowProps<Item> extends ClassNameProp {
  item: Item;

  onClick?(): void;
}

export function TableRow<Item>({
  item,
  children,
  onClick,
  className
}: PropsWithChildren<TableRowProps<Item>>): ReturnType<FC> {
  return (
    <tr className={c(onClick && s.clickableRow, className)} onClick={onClick}>
      {Children.map(children, (child) => {
        if (!isValidElement(child) || child.type !== TableColumn) return null;
        const {render, dataKey, ...props}: TableColumnProps<Item, keyof Item> = child.props;
        const value = dataKey ? item[dataKey] : item;
        return <TableItemColumn {...props}>{render ? render(value as any) : value}</TableItemColumn>;
      })}
    </tr>
  );
}
