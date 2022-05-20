import {FC} from "react";
import s from "./ButtonList.module.scss";

interface ButtonListProps {}

export const ButtonList: FC<ButtonListProps> = ({children}) => {
  return <ul className={s.list}>{children}</ul>;
};
