import {FC} from "react";
import {ReactComponent as BoxIcon} from "../../../assets/icons/fa/box-solid.svg";
import {ReactComponent as BranchIcon} from "../../../assets/icons/fa/code-branch-solid.svg";
import {ReactComponent as FolderIcon} from "../../../assets/icons/fa/folder-open-solid.svg";
import {ReactComponent as StreamIcon} from "../../../assets/icons/fa/stream-solid.svg";
import {ReactComponent as CogIcon} from "../../../assets/icons/fa/cog-solid.svg";
import {ReactComponent as FireIcon} from "../../../assets/icons/fa/fire-solid.svg";
import {NavBar} from "../../molecules/navigation/NavBar";
import {NavBarItem} from "../../molecules/navigation/NavBarItem";

export enum GitRepositoryNavigationItems {
  DASHBOARD = "dashboard",
  BRANCHES = "branches",
  COMMITS = "commits",
  FILES = "files",
  HEATMAP = "heatmap",
  SETTINGS = "settings"
}

interface GitRepositoryNavigationProps {}

export const GitRepositoryNavigation: FC<GitRepositoryNavigationProps> = () => {
  return (
    <NavBar>
      <NavBarItem id={GitRepositoryNavigationItems.DASHBOARD} icon={StreamIcon}>
        Dashboard
      </NavBarItem>
      <NavBarItem id={GitRepositoryNavigationItems.BRANCHES} icon={BranchIcon}>
        Branches
      </NavBarItem>
      <NavBarItem id={GitRepositoryNavigationItems.COMMITS} icon={BoxIcon}>
        Commits
      </NavBarItem>
      <NavBarItem id={GitRepositoryNavigationItems.FILES} icon={FolderIcon}>
        Files
      </NavBarItem>
      <NavBarItem id={GitRepositoryNavigationItems.HEATMAP} icon={FireIcon}>
        Heatmap
      </NavBarItem>
      <NavBarItem id={GitRepositoryNavigationItems.SETTINGS} icon={CogIcon}>
        Settings
      </NavBarItem>
    </NavBar>
  );
};
