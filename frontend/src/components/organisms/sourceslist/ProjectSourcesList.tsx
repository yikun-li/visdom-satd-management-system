import {FC} from "react";
import {RestProjectSource, RestProjectSourceType} from "../../../types/project";
import {TileList} from "../../atoms/tilelist/TileList";
import {SourcesListItem} from "../../molecules/sourceslist/SourcesListItem";

interface ProjectSourcesListProps {
  sources: RestProjectSource[];
  projectId: number;
}

function getSourceKey(source: RestProjectSource): string {
  return `${source.type}-${source.type === RestProjectSourceType.GIT ? source.git.id : source.jira.id}`;
}

export const ProjectSourcesList: FC<ProjectSourcesListProps> = ({sources, projectId}) => {
  return (
    <TileList>
      {sources.map((source) => (
        <SourcesListItem source={source} key={getSourceKey(source)} projectId={projectId} />
      ))}
    </TileList>
  );
};
