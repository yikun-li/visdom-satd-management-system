import {FC, useContext} from "react";
import {PageContent} from "../../atoms/layout/PageContent";
import {NavBarContext} from "./NavBar";

interface NavBarContentProps {
  id: string;
}

export const NavBarContent: FC<NavBarContentProps> = ({id, children}) => {
  const {active} = useContext(NavBarContext);
  return active === id ? <PageContent>{children}</PageContent> : null;
};
