import c from "classnames";
import {FC} from "react";
import {Spinner} from "../../atoms/activity/Spinner";
import {Paragraph} from "../../atoms/typography/Paragraph";
import s from "./JobsRunningIndicator.module.scss";

interface JobsRunningIndicatorProps {
  activeAmount: number;

  onClick(): void;
}

export const JobsRunningIndicator: FC<JobsRunningIndicatorProps> = ({activeAmount, onClick}) => {
  return (
    <div className={c(s.container, activeAmount === 0 && s.empty)} onClick={onClick}>
      <Spinner />
      <Paragraph className={s.text}>
        {activeAmount} {activeAmount === 1 ? "job" : "jobs"} running
      </Paragraph>
    </div>
  );
};
