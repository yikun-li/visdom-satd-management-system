import {FC} from "react";
import {CircularProgressbarWithChildren} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {CircularProgressbarWrapperProps} from "react-circular-progressbar/dist/types";
import s from "./RadialPercentageChart.module.scss";

interface RadialPercentageChartProps {
  percentage: number;
}

export const RadialPercentageChart: FC<RadialPercentageChartProps> = ({percentage}) => {
  return (
    <CircularProgressbarWithChildren
      value={Math.trunc(percentage)}
      strokeWidth={16}
      classes={s as CircularProgressbarWrapperProps["classes"]}
    >
      <span className={s.percentage}>{Math.trunc(percentage)}%</span>
    </CircularProgressbarWithChildren>
  );
};
