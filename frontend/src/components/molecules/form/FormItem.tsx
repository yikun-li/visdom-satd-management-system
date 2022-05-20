import {FC, ReactNode} from "react";
import s from "./FormItem.module.scss";
import {FormLabel} from "../../atoms/form/FormLabel";

interface FormItemProps {
  label?: string;
  input: ReactNode;
}

export const FormItem: FC<FormItemProps> = ({input, label}) => {
  return (
    <div className={s.container}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className={s.input}>{input}</div>
    </div>
  );
};
