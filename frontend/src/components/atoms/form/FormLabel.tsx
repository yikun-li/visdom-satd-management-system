import {FC} from "react";
import s from "./FormLabel.module.scss";

export const FormLabel: FC = ({children}) => {
  return <label className={s.label}>{children}</label>;
};
