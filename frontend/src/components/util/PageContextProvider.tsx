import {FC} from "react";
import {NavbarObject} from "../../hooks/useNavbar";
import {NavBarContext} from "../molecules/navigation/NavBar";

interface PageContextProviderProps {
  nav: NavbarObject<unknown>;
}

export const PageContextProvider: FC<PageContextProviderProps> = ({children, nav}) => {
  return <NavBarContext.Provider value={nav}>{children}</NavBarContext.Provider>;
};
