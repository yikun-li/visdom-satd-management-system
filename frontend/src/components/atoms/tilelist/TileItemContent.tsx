import {IconFC} from "*.svg";
import {FC} from "react";
import {Heading} from "../typography/Heading";
import s from "./TileList.module.scss";

interface TileItemContentProps {
  title: string;
  icon?: IconFC;
}

export const TileItemContent: FC<TileItemContentProps> = ({title, icon: Icon, children}) => {
  return (
    <>
      <div className={s.content}>
        <Heading type="h2" className={s.title}>
          {title}
        </Heading>
        {children}
      </div>
      {Icon && <Icon className={s.bigIcon} />}
    </>
  );
};
