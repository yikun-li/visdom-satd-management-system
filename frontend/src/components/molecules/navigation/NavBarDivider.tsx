import {FC} from "react";
import s from "./NavBar.module.scss";

export const NavBarDivider: FC = () => {
  return <li className={s.divider} />;
};
