import {FC} from "react";
import {formatInteger} from "../../../util/format/number";
import {Heading} from "../typography/Heading";
import {Panel} from "./Panel";
import s from "./Panel.module.scss";

interface NumberPanelProps {
  title: string;
  number: number;
  format?(n: number): string;
}

export const NumberPanel: FC<NumberPanelProps> = ({title, number, format = formatInteger, children}) => {
  return (
    <Panel contentClassName={s.number}>
      <div className={s.numberLeft}>
        <Heading type="h1" className={s.numberAmount}>
          {format(number)}
        </Heading>
        <Heading type="h3" className={s.numberTitle}>
          {title}
        </Heading>
      </div>
      {children && <div className={s.numberRight}>{children}</div>}
    </Panel>
  );
};
