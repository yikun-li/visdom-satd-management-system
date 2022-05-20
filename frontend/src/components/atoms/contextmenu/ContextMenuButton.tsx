import {FC} from "react";
import {ReactComponent as DotsIcon} from "../../../assets/icons/fa/ellipsis-v-solid.svg";
import {Button} from "../buttons/Button";

interface ContextMenuButtonProps {
  onClick(): void;
}

export const ContextMenuButton: FC<ContextMenuButtonProps> = ({onClick}) => {
  return (
    <Button type="icon" stopPropagation onClick={onClick}>
      <DotsIcon />
    </Button>
  );
};
