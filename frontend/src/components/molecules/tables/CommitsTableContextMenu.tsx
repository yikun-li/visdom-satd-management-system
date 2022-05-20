import {FC} from "react";
import {RestGitCommit} from "../../../types/git";
import {ButtonWithContextMenu} from "../../atoms/contextmenu/ButtonWithContextMenu";
import {ContextMenuItem} from "../../atoms/contextmenu/ContextMenuItem";

interface CommitsTableContextMenuProps {
  commit: RestGitCommit;

  onOpen(): void;

  onIndex(): void;
}

export const CommitsTableContextMenu: FC<CommitsTableContextMenuProps> = ({commit, onOpen, onIndex}) => {
  return (
    <ButtonWithContextMenu>
      <ContextMenuItem onClick={onOpen}>Open Commit</ContextMenuItem>
      {!commit.snapped && <ContextMenuItem onClick={onIndex}>Index Files</ContextMenuItem>}
    </ButtonWithContextMenu>
  );
};
