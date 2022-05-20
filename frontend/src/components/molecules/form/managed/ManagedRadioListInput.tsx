import {useInput} from "formorama";
import {FC} from "react";
import {DropdownProps} from "../../../atoms/form/Dropdown";
import {RadioListInput, RadioListInputProps} from "../radio/RadioListInput";
import {ManagedProps} from "./types";

interface ManagedRadioListInputProps {}

export const ManagedRadioListInput: FC<ManagedProps<RadioListInputProps>> = ({name, children}) => {
  const {value, handleChange, handleFocus, handleBlur} = useInput(name, null);

  return (
    <RadioListInput value={value} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}>
      {children}
    </RadioListInput>
  );
};
