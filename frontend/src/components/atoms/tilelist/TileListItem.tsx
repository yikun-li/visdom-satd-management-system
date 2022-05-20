import c from "classnames";
import Link from "next/link";
import {FC} from "react";
import s from "./TileList.module.scss";

interface TileListItemProps {
  to?: string;
  className?: string;
}

export const TileListItem: FC<TileListItemProps> = ({to, children, className}) => {
  return (
    <li className={c(s.item, !to && s.noLink, className)}>
      {to ? (
        <Link href={to}>
          <a className={s.link}>{children}</a>
        </Link>
      ) : (
        children
      )}
    </li>
  );
};
