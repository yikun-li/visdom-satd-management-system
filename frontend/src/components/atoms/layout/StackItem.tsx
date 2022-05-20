import c from "classnames";
import {FC} from "react";
import s from "./Stack.module.scss";

interface StackItemProps {
  flex?: boolean;
  tag?: "div" | "span";
}

export const StackItem: FC<StackItemProps> = ({children, flex, tag: Tag = "div"}) => {
  return <Tag className={c(s.item, flex && s.flex)}>{children}</Tag>;
};
