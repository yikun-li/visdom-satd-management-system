import c from "classnames";
import {FC, MouseEventHandler} from "react";
import s from "./ContextMenu.module.scss";

interface ContextMenuProps {
  open?: boolean;

  onClose(): void;
}

export const ContextMenu: FC<ContextMenuProps> = ({open, children, onClose}) => {
  const handleClick: MouseEventHandler = (event) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <div className={c(s.container, open && s.open)} onClick={handleClick}>
      <ul className={s.list}>{children}</ul>
    </div>
  );
};
