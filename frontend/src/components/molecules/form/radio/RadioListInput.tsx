import {Children, Context, createContext, FC} from "react";
import {Stack} from "../../../atoms/layout/Stack";
import {StackItem} from "../../../atoms/layout/StackItem";

export interface RadioListInputContextValue {
  value: string | null;
  onChange?(value: string): void;
  onFocus?(): void;
  onBlur?(): void;
}

export const RadioListInputContext: Context<RadioListInputContextValue> = createContext(
  {} as RadioListInputContextValue
);

export interface RadioListInputProps extends RadioListInputContextValue {}

export const RadioListInput: FC<RadioListInputProps> = ({value, onChange, onBlur, onFocus, children}) => {
  const contextValue: RadioListInputContextValue = {value, onChange, onBlur, onFocus};

  return (
    <RadioListInputContext.Provider value={contextValue}>
      <Stack spacing="l" horizontal>
        {Children.map(children, (child) => (
          <StackItem>{child}</StackItem>
        ))}
      </Stack>
    </RadioListInputContext.Provider>
  );
};
