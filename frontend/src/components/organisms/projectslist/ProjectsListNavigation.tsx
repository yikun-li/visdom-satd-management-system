import {FC} from "react";
import {ReactComponent as CogIcon} from "../../../assets/icons/fa/cog-solid.svg";
import {ReactComponent as StreamIcon} from "../../../assets/icons/fa/stream-solid.svg";
import {ReactComponent as GlassesIcon} from "../../../assets/icons/fa/glasses-solid.svg";
import {NavBar} from "../../molecules/navigation/NavBar";
import {NavBarItem} from "../../molecules/navigation/NavBarItem";

export enum ProjectsListNavigationItems {
  PROJECTS = "projects",
  CLASSIFIER = "classifier",
  SETTINGS = "settings"
}

export const ProjectsListNavigation: FC = () => {
  return (
    <NavBar>
      <NavBarItem id={ProjectsListNavigationItems.PROJECTS} icon={StreamIcon}>
        Projects
      </NavBarItem>
      <NavBarItem id={ProjectsListNavigationItems.CLASSIFIER} icon={GlassesIcon}>
        Classifier
      </NavBarItem>
      <NavBarItem id={ProjectsListNavigationItems.SETTINGS} icon={CogIcon}>
        Settings
      </NavBarItem>
    </NavBar>
  );
};
