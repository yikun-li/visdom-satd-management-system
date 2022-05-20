import {useInput} from "formorama";
import {FC} from "react";
import {TextInput, TextInputProps} from "../../../atoms/form/TextInput";
import {ManagedProps} from "./types";

export const ManagedTextInput: FC<ManagedProps<TextInputProps>> = ({name, ...props}) => {
  const {value, handleChange, handleFocus, handleBlur} = useInput(name, "");

  return <TextInput value={value} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} {...props} />;
};
