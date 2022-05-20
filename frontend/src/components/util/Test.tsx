import {FC, useState} from "react";
import {Panel} from "../atoms/panel/Panel";
import {Heading} from "../atoms/typography/Heading";
import {RadioListInput} from "../molecules/form/radio/RadioListInput";
import {RadioListItem} from "../molecules/form/radio/RadioListItem";

interface TestProps {}

export const Test: FC<TestProps> = () => {
  const [value, setValue] = useState("a");

  return (
    <Panel>
      <Heading>Hello</Heading>
      <RadioListInput value={value} onChange={setValue}>
        <RadioListItem value="a">First</RadioListItem>
        <RadioListItem value="b">Second</RadioListItem>
      </RadioListInput>
    </Panel>
  );
};
