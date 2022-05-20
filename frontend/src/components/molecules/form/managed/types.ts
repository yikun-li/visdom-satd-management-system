import {TextInputProps} from "../../../atoms/form/TextInput";

export type ManagedProps<T> = Omit<T, "value" | "onFocus" | "onBlur" | "onChange"> & {name: string};
