import {FC} from "react";
import s from "./TileList.module.scss";
import {TileListItem} from "./TileListItem";

export const TileListLoadingItem: FC = () => {
  return <TileListItem className={s.loading} />;
};
