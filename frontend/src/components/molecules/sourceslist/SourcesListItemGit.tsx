import {FC} from "react";
import {ReactComponent as GitIcon} from "../../../assets/icons/fa/git-brands.svg";
import {RestProjectGitSource} from "../../../types/project";
import {SourcesListItemBase} from "./SourcesListItemBase";

interface SourcesListItemGitProps {
  source: RestProjectGitSource;
  projectId: number;
}

export const SourcesListItemGit: FC<SourcesListItemGitProps> = ({source, projectId}) => {
  return (
    <SourcesListItemBase title={source.git.name} icon={GitIcon} to={`/projects/${projectId}/git/${source.git.id}`} />
  );
};
