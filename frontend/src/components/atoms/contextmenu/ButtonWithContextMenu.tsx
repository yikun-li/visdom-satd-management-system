import {FC, useRef, useState} from "react";
import {useOutsideClick} from "../../../hooks/useOutsideClick";
import {ContextMenu} from "./ContextMenu";
import s from "./ContextMenu.module.scss";
import {ContextMenuButton} from "./ContextMenuButton";

interface ButtonWithContextMenuProps {}

export const ButtonWithContextMenu: FC<ButtonWithContextMenuProps> = ({children}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useOutsideClick(containerRef.current, () => setOpen(false));

  return (
    <div ref={containerRef} className={s.buttonContainer}>
      <ContextMenuButton onClick={() => setOpen(true)} />
      <ContextMenu open={open} onClose={() => setOpen(false)}>
        {children}
      </ContextMenu>
    </div>
  );
};
