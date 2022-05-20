import React, {FC} from "react";
import s from "./RadioInput.module.scss";
import c from "classnames";
import {ReactComponent as CheckIcon} from "../../../assets/icons/fa/check-solid.svg";

interface RadioInputProps
  extends Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "type" | "onChange"
  > {
  onCheck?(checked: boolean): void;
}

export const RadioInput: FC<RadioInputProps> = ({checked, className, onCheck, ...props}) => {
  return (
    <div className={c(s.container, checked && s.checked, className)} onClick={() => onCheck && onCheck(true)}>
      <input
        {...props}
        className={s.input}
        type="radio"
        checked={checked}
        onChange={(event) => onCheck && onCheck(event.target.checked)}
      />
      <CheckIcon className={s.check} />
    </div>
  );
};
