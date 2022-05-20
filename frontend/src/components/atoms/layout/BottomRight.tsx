import c from "classnames";
import {FC} from "react";
import {ClassNameProp} from "../../../types/props";
import s from "./BottomRight.module.scss";

export const BottomRight: FC<ClassNameProp> = ({className, children}) => {
  return <div className={c(s.container, className)}>{children}</div>;
};
