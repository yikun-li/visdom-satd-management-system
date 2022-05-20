import c from "classnames";
import {FC} from "react";
import s from "./TextInput.module.scss";

export interface TextInputProps {
  value: string;
  placeholder?: string;
  type?: string;

  onChange(value: string): void;
  onFocus?(): void;
  onBlur?(): void;
}

export const TextInput: FC<TextInputProps> = ({value, placeholder, onChange, onBlur, onFocus, type = "text"}) => {
  return (
    <input
      className={c(s.base)}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};
