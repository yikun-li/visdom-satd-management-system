import {Context, createContext, FC} from "react";
import {NavbarObject} from "../../../hooks/useNavbar";
import {ButtonList} from "../../atoms/buttonlist/ButtonList";
import s from "./NavBar.module.scss";

export type NavBarContext<T = unknown> = Context<NavbarObject<T>>;
export const NavBarContext: Context<NavbarObject<unknown>> = createContext({} as NavbarObject<unknown>);

interface NavBarProps {}

export const NavBar: FC<NavBarProps> = ({children}) => {
  return (
    <nav className={s.navbar}>
      <div className={s.header}>
        <h1>SATD Analyser</h1>
      </div>
      <ButtonList>{children}</ButtonList>
    </nav>
  );
};
