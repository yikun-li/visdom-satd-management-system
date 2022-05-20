import {FC} from "react";
import {ReactComponent as CogIcon} from "../../../assets/icons/fa/cog-solid.svg";
import {ReactComponent as StreamIcon} from "../../../assets/icons/fa/stream-solid.svg";
import {ReactComponent as FolderIcon} from "../../../assets/icons/fa/folder-open-solid.svg";
import {NavBar} from "../../molecules/navigation/NavBar";
import {NavBarItem} from "../../molecules/navigation/NavBarItem";

export enum ProjectNavigationItems {
  DASHBOARD = "dashboard",
  SOURCES = "sources",
  SETTINGS = "settings"
}

export const ProjectNavigation: FC = () => {
  return (
    <NavBar>
      <NavBarItem id={ProjectNavigationItems.DASHBOARD} icon={StreamIcon}>
        Dashboard
      </NavBarItem>
      <NavBarItem id={ProjectNavigationItems.SOURCES} icon={FolderIcon}>
        Sources
      </NavBarItem>
      <NavBarItem id={ProjectNavigationItems.SETTINGS} icon={CogIcon}>
        Settings
      </NavBarItem>
    </NavBar>
  );
};
