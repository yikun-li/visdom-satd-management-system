import {FC, useContext} from "react";
import {RadioInput} from "../../../atoms/form/RadioInput";
import {Stack} from "../../../atoms/layout/Stack";
import {RadioListInputContext} from "./RadioListInput";
import s from "./RadioListInput.module.scss";

interface RadioListItemProps {
  value: string;
}

export const RadioListItem: FC<RadioListItemProps> = ({value, children}) => {
  const {value: selectedValue, onChange, onFocus, onBlur} = useContext(RadioListInputContext);

  return (
    <Stack spacing="s" horizontal tag="label" itemTag="span" className={s.item}>
      <RadioInput
        value={value}
        checked={selectedValue === value}
        onCheck={(checked) => checked && onChange && onChange(value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {children}
    </Stack>
  );
};
