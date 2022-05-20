import {FC} from "react";
import {NavBar} from "../../molecules/navigation/NavBar";
import {NavBarItem} from "../../molecules/navigation/NavBarItem";

export enum JiraProjectNavigationItems {
  DASHBOARD = "dashboard",
  ISSUES = "issues"
}

export const JiraProjectNavigation: FC = () => {
  return (
    <NavBar>
      <NavBarItem id={JiraProjectNavigationItems.DASHBOARD}>Dashboard</NavBarItem>
      <NavBarItem id={JiraProjectNavigationItems.ISSUES}>Issues</NavBarItem>
    </NavBar>
  );
};
