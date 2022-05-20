import {FC} from "react";
import {ClassNameProp} from "../../../types/props";
import c from "classnames";
import s from "./Tooltip.module.scss";

interface TooltipProps extends ClassNameProp {}

export const Tooltip: FC<TooltipProps> = ({children, className}) => {
  return <div className={c(s.container, className)}>{children}</div>;
};
