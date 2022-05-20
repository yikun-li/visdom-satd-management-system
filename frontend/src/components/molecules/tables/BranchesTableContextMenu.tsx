import {FC} from "react";
import {RestGitBranch} from "../../../types/git";
import {ButtonWithContextMenu} from "../../atoms/contextmenu/ButtonWithContextMenu";
import {ContextMenuItem} from "../../atoms/contextmenu/ContextMenuItem";

interface BranchesTableContextMenuProps {
  branch: RestGitBranch;

  onSelect(): void;

  onStartTracking(): void;

  onScanCommits(): void;
}

export const BranchesTableContextMenu: FC<BranchesTableContextMenuProps> = ({
  branch,
  onSelect,
  onStartTracking,
  onScanCommits
}) => {
  return (
    <ButtonWithContextMenu>
      <ContextMenuItem onClick={onSelect}>Select Branch</ContextMenuItem>
      {branch.id === null && <ContextMenuItem onClick={onStartTracking}>Start Tracking</ContextMenuItem>}
      {branch.id !== null && (branch.totalSnapped ?? 0) < (branch.totalCommits ?? 0) && (
        <ContextMenuItem onClick={onScanCommits}>Scan Commits</ContextMenuItem>
      )}
    </ButtonWithContextMenu>
  );
};
