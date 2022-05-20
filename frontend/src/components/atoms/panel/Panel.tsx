import c from "classnames";
import dynamic from "next/dynamic";
import {FC} from "react";
import {PrimaryColor} from "../../../styles/types";
import {ClassNameProp} from "../../../types/props";
import {Sentry} from "../activity/Sentry";
import {Heading} from "../typography/Heading";
import s from "./Panel.module.scss";

interface PanelProps extends ClassNameProp {
  title?: string;
  contentClassName?: string;
  fill?: PrimaryColor;
  loading?: boolean;
  fullHeight?: boolean;
}

export const Panel: FC<PanelProps> = ({children, title, className, contentClassName, fill, loading, fullHeight}) => {
  return (
    <div
      className={c(s.container, fill && s[`fill-${fill}`], loading && s.loading, fullHeight && s.fullHeight, className)}
    >
      <div className={c(s.content, contentClassName)}>
        {title && (
          <Heading className={s.title} type="h3">
            {title}
          </Heading>
        )}
        {children}
      </div>
      {loading !== undefined && (
        <div className={s.loadingContainer}>
          <Sentry />
        </div>
      )}
    </div>
  );
};
