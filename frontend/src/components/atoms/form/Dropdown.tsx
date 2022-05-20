import {FC} from "react";
import Select from "react-select";
import {StylesConfig} from "react-select/src/styles";
import s from "./Dropdown.module.scss";

export type DropdownOption = {label: string; value: string};

export interface DropdownProps {
  options: DropdownOption[];
  value: DropdownOption | null;
  loading?: boolean;
  onChange(value: DropdownOption | null): void;
  onMenuOpen?(): void;
  onFocus?(): void;
  onBlur?(): void;
}

const customStyles: StylesConfig<DropdownOption, false> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#202020",
    borderColor: "#2A2A2A"
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#202020",
    borderColor: "#2A2A2A"
  }),
  option: (base, props) => ({
    ...base,
    backgroundColor: props.isFocused ? "rgb(1, 106, 249)" : "#202020"
  }),
  singleValue: (base) => ({...base, color: "#ffffff"})
};

export const Dropdown: FC<DropdownProps> = ({options, value, onChange, onMenuOpen, loading, onFocus, onBlur}) => {
  return (
    <div className={s.container}>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        classNamePrefix={s.dropdown}
        className={s.dropdown}
        onMenuOpen={onMenuOpen}
        isLoading={loading}
        onFocus={onFocus}
        onBlur={onBlur}
        styles={customStyles}
      />
    </div>
  );
};
