declare module "*.svg" {
  import {FC} from "react";

  interface SvgProps {
    fill?: string;
    className?: string;
  }

  export type IconFC = FC<SvgProps>;
  export const ReactComponent: IconComponent;
  const src: string;
  export default src;
}

declare module "react-syntax-highlighter" {
  import {ReactElement} from "react";

  export interface CreateElementArgs {
    node: any;
    stylesheet: any;
    useInlineStyles: boolean;
    key: string;
  }

  export function createElement(args: CreateElementArgs): ReactElement;
}
