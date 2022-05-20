import {Meta} from "@storybook/react";
import React from "react";
import {Button} from "./Button";

export default {
  component: Button,
  title: "Atoms/RoundButton"
} as Meta;

const Template = (args: any) => <Button {...args} />;
export const Normal = Template.bind({});
