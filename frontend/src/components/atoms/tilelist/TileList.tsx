import c from "classnames";
import {FC} from "react";
import s from "./TileList.module.scss";

interface TileListProps {
  className?: string;
}

export const TileList: FC<TileListProps> = ({children, className}) => {
  return <ul className={c(s.list, className)}>{children}</ul>;
};
