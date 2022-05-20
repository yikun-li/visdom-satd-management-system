import c from "classnames";
import {FC} from "react";
import {ClassNameProp} from "../../../types/props";
import s from "./Code.module.scss";

interface CodeProps extends ClassNameProp {}

export const Code: FC<CodeProps> = ({className, children}) => {
  return <code className={c(s.container, className)}>{children}</code>;
};
