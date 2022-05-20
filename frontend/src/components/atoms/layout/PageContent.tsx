import {FC} from "react";
import s from "./PageContent.module.scss";

export const PageContent: FC = ({children}) => {
  return <div className={s.content}>{children}</div>;
};
