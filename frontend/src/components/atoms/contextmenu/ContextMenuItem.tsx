import {FC} from "react";
import s from "./ContextMenu.module.scss";

interface ContextMenuItemProps {
  onClick(): void;
}

export const ContextMenuItem: FC<ContextMenuItemProps> = ({children, onClick}) => {
  return (
    <li className={s.item} onClick={onClick}>
      {children}
    </li>
  );
};
