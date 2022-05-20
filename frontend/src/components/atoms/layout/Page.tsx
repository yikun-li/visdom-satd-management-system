import {FC} from "react";
import s from "./Page.module.scss";

export const Page: FC = ({children}) => {
  return <div className={s.page}>{children}</div>;
};
