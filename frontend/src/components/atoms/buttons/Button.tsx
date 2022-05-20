import c from "classnames";
import dynamic from "next/dynamic";
import {FC, MouseEventHandler} from "react";
import {PrimaryColor} from "../../../styles/types";
import {ClassNameProp} from "../../../types/props";
import {Sentry} from "../activity/Sentry";
import s from "./Button.module.scss";

interface ButtonProps extends ClassNameProp {
  tag?: "a" | "button";
  submit?: boolean;
  type?: "icon" | "light" | "color";
  tint?: PrimaryColor | "light" | "dark";
  stopPropagation?: boolean;
  loading?: boolean;

  onClick?(): void;
}

export const Button: FC<ButtonProps> = ({
  tag: Tag = "button",
  type,
  children,
  onClick,
  submit,
  className,
  stopPropagation,
  tint,
  loading
}) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> & MouseEventHandler<HTMLButtonElement> = (event) => {
    if (stopPropagation) event.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <Tag
      className={c(
        s.base,
        type === "icon" && s.typeIcon,
        type === "light" && s.typeLight,
        type === "color" && s.typeColor,
        tint && s[`tint-${tint}`],
        loading && s.loading,
        className
      )}
      onClick={stopPropagation ? handleClick : onClick}
      type={submit ? "submit" : "button"}
    >
      {children}
      {loading !== undefined && (
        <div className={s.loadingContainer}>
          <Sentry size={24} />
        </div>
      )}
    </Tag>
  );
};
