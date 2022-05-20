import c from "classnames";
import {FC} from "react";
import s from "./Paragraph.module.scss";

interface ParagraphProps {
  className?: string;
  secondary?: boolean;
}

export const Paragraph: FC<ParagraphProps> = ({children, className, secondary}) => {
  return <p className={c(s.paragraph, secondary && s.secondary, className)}>{children}</p>;
};
