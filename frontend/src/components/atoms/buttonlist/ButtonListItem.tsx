import {IconFC} from "*.svg";
import c from "classnames";
import Link from "next/link";
import {FC} from "react";
import {UrlObject} from "url";
import s from "./ButtonList.module.scss";

interface ButtonListItemProps {
  active?: boolean;
  url?: {href: UrlObject | string; as: UrlObject | string};
  icon?: IconFC;

  onClick?(): void;
}

export const ButtonListItem: FC<ButtonListItemProps> = ({active, url, onClick, children, icon: Icon}) => {
  const content = (
    <>
      {Icon && <Icon className={s.icon} />}
      <span className={s.label}>{children}</span>
    </>
  );

  return (
    <li className={c(s.item, active && s.active)}>
      {url && (
        <Link {...url} shallow>
          <a className={s.button}>{content}</a>
        </Link>
      )}
      {onClick && (
        <button className={s.button} onClick={onClick}>
          {content}
        </button>
      )}
    </li>
  );
};
