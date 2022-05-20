import {FC} from "react";
import {ReactComponent as FireIcon} from "../../../assets/icons/fa/fire-solid.svg";
import {ReactComponent as FolderIcon} from "../../../assets/icons/fa/folder-open-solid.svg";
import {ReactComponent as StreamIcon} from "../../../assets/icons/fa/stream-solid.svg";
import {NavBar} from "../../molecules/navigation/NavBar";
import {NavBarItem} from "../../molecules/navigation/NavBarItem";

export enum GitCommitNavigationItems {
  OVERVIEW = "overview",
  FILES = "files",
  HEATMAP = "heatmap"
}

interface GitCommitNavigationProps {}

export const GitCommitNavigation: FC<GitCommitNavigationProps> = () => {
  return (
    <NavBar>
      <NavBarItem id={GitCommitNavigationItems.OVERVIEW} icon={StreamIcon}>
        Overview
      </NavBarItem>
      <NavBarItem id={GitCommitNavigationItems.FILES} icon={FolderIcon}>
        Files
      </NavBarItem>
      <NavBarItem id={GitCommitNavigationItems.HEATMAP} icon={FireIcon}>
        Heatmap
      </NavBarItem>
    </NavBar>
  );
};
