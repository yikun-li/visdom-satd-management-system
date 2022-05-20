import {useInput} from "formorama";
import {FC} from "react";
import {Dropdown, DropdownProps} from "../../../atoms/form/Dropdown";
import {TextInputProps} from "../../../atoms/form/TextInput";
import {ManagedProps} from "./types";

export const ManagedDropdown: FC<ManagedProps<DropdownProps>> = ({name, ...props}) => {
  const {value, handleChange, handleFocus, handleBlur} = useInput<string | null>(name, null);

  return (
    <Dropdown
      {...props}
      value={props.options.find((option) => option.value === value) || null}
      onChange={(option) => handleChange(option && option.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};
