import {FC} from "react";
import {ReactComponent as FileIcon} from "../../../assets/icons/fa/file-regular.svg";
import {ReactComponent as FolderIcon} from "../../../assets/icons/fa/folder-solid.svg";
import s from "./FilenameColumn.module.scss";

interface FilenameColumnProps {
  directory?: boolean;
}

export const FilenameColumn: FC<FilenameColumnProps> = ({children, directory}) => {
  const Icon = directory ? FolderIcon : FileIcon;
  return (
    <span className={s.container}>
      <Icon className={s.icon} />
      {children}
    </span>
  );
};
