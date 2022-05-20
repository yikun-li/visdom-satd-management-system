import {FC, PropsWithChildren, ReactNode} from "react";
import s from "./Table.module.scss";

export interface TableColumnProps<Item, Key extends keyof Item | null = null> {
  render?(data: Key extends keyof Item ? Item[Key] : Item): ReactNode;
  dataKey?: Key;
  width?: string | number;
  align?: "left" | "right" | "center";
}

export function TableColumn<Item, Key extends keyof Item | null = null>({
  children,
  render,
  dataKey,
  width,
  align
}: PropsWithChildren<TableColumnProps<Item, Key>>): ReturnType<FC> {
  return (
    <th style={{width}} className={s[`align-${align}`]}>
      {children}
    </th>
  );
}
