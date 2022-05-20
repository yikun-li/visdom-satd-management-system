import c from "classnames";
import {FC} from "react";
import {PrimaryColor} from "../../../styles/types";
import {ClassNameProp} from "../../../types/props";
import s from "./Label.module.scss";

interface LabelProps extends ClassNameProp {
  fill?: boolean;
  color: PrimaryColor;
}

export const Label: FC<LabelProps> = ({children, fill, className, color}) => {
  return <span className={c(s.container, fill ? s.fill : s.border, s[color], className)}>{children}</span>;
};
