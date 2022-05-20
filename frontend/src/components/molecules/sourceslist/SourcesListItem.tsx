import {FC} from "react";
import {RestProjectSource, RestProjectSourceType} from "../../../types/project";
import {SourcesListItemGit} from "./SourcesListItemGit";
import {SourcesListItemJira} from "./SourcesListItemJira";

interface SourcesListItemProps {
  source: RestProjectSource;
  projectId: number;
}

export const SourcesListItem: FC<SourcesListItemProps> = ({source, projectId}) => {
  switch (source.type) {
    case RestProjectSourceType.JIRA:
      return <SourcesListItemJira source={source} projectId={projectId} />;
    case RestProjectSourceType.GIT:
      return <SourcesListItemGit source={source} projectId={projectId} />;
  }
};
