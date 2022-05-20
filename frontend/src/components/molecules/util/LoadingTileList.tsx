import {FC} from "react";
import {TileList} from "../../atoms/tilelist/TileList";
import {TileListLoadingItem} from "../../atoms/tilelist/TileListLoadingItem";
import s from "./LoadingTileList.module.scss";

export const LoadingTileList: FC = () => {
  return (
    <TileList className={s.list}>
      {Array(30)
        .fill(null)
        .map((_, i) => (
          <TileListLoadingItem key={i} />
        ))}
    </TileList>
  );
};
