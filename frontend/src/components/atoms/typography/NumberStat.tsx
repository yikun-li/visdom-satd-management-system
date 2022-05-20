import {IconFC} from "*.svg";
import c from "classnames";
import {FC} from "react";
import s from "./NumberStat.module.scss";

interface NumberStatProps {
  icon?: IconFC;
  amount: number;
  className?: string;
}

export const NumberStat: FC<NumberStatProps> = ({icon: Icon, amount, className}) => {
  return (
    <div className={c(s.container, className)}>
      {Icon && <Icon className={s.icon} />} <span className={s.amount}>{amount}</span>
    </div>
  );
};
