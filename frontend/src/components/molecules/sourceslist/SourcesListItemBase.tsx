import {IconFC} from "*.svg";
import {FC} from "react";
import {TileItemContent} from "../../atoms/tilelist/TileItemContent";
import {TileListItem} from "../../atoms/tilelist/TileListItem";

interface SourcesListItemBaseProps {
  icon: IconFC;
  to: string;
  title: string;
}

export const SourcesListItemBase: FC<SourcesListItemBaseProps> = ({icon, to, title}) => {
  return (
    <TileListItem to={to}>
      <TileItemContent title={title} icon={icon} />
    </TileListItem>
  );
};
