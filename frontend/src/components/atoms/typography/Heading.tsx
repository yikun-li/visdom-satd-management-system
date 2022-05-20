import c from "classnames";
import {FC} from "react";
import s from "./Heading.module.scss";

interface HeadingProps {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export const Heading: FC<HeadingProps> = ({type: H = "h1", className, children}) => {
  return <H className={c(s.header, s[`header-${H}`], className)}>{children}</H>;
};
