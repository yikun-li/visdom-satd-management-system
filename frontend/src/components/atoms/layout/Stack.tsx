import c from "classnames";
import {Children, FC, ReactElement} from "react";
import {ClassNameProp} from "../../../types/props";
import s from "./Stack.module.scss";
import {StackItem} from "./StackItem";

type Spacing = "l" | "m" | "s";

interface StackProps extends ClassNameProp {
  spacing: Spacing;
  horizontal?: boolean;
  center?: boolean;
  end?: boolean;
  tag?: "div" | "label";
  itemTag?: "div" | "span";
}

export const Stack: FC<StackProps> = ({
  children,
  horizontal,
  spacing,
  center,
  end,
  tag: Tag = "div",
  itemTag,
  className
}) => {
  return (
    <Tag
      className={c(
        s.stack,
        horizontal && s.horizontal,
        s[`spacing-${spacing}`],
        center && s.center,
        end && s.end,
        className
      )}
    >
      {Children.map(
        children,
        (child) =>
          child && ((child as ReactElement).type === StackItem ? child : <StackItem tag={itemTag}>{child}</StackItem>)
      )}
    </Tag>
  );
};
