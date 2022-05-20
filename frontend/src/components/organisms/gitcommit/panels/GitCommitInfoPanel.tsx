import {FC} from "react";
import {RestGitCommit} from "../../../../types/git";
import {Panel} from "../../../atoms/panel/Panel";

interface GitCommitInfoPanelProps {
  commit: RestGitCommit;
}

export const GitCommitInfoPanel: FC<GitCommitInfoPanelProps> = () => {
  return <Panel></Panel>;
};
