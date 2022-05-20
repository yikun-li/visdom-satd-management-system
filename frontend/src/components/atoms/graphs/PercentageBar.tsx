import {FC} from "react";
import s from "./PercentageBar.module.scss";

interface PercentageBarProps {
  percentages: number[];
  labels: string[];
}

const colors = ["#35BD3D", "#2835FF", "#F9BF21", "#F65354"];

export const PercentageBar: FC<PercentageBarProps> = ({percentages}) => {
  return (
    <div className={s.bar}>
      {percentages.map((value, index) => (
        <div
          key={index}
          style={{width: `${value}%`, backgroundColor: colors[index % colors.length]}}
          className={s.value}
        />
      ))}
    </div>
  );
};
