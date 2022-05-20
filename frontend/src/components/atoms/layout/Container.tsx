import c from "classnames";
import {FC} from "react";
import s from "./Container.module.scss";

interface ContainerProps {
  className?: string;
}

export const Container: FC<ContainerProps> = ({children, className}) => {
  return <div className={c(s.container, className)}>{children}</div>;
};
