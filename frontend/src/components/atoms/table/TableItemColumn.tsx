import {FC, PropsWithChildren} from "react";
import s from "./Table.module.scss";

interface TableItemColumnProps {
  width?: string | number;
  align?: "left" | "right" | "center";
}

export function TableItemColumn({children, align}: PropsWithChildren<TableItemColumnProps>): ReturnType<FC> {
  return <td className={s[`align-${align}`]}>{children}</td>;
}
