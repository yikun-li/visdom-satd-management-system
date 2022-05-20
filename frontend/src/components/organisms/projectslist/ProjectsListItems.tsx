import {FC} from "react";
import {RestProject} from "../../../types/project";
import {TileList} from "../../atoms/tilelist/TileList";
import {ProjectsListItem} from "../../molecules/projectslist/ProjectsListItem";

interface ProjectsListItemsProps {
  projects: RestProject[];
}

export const ProjectsListItems: FC<ProjectsListItemsProps> = ({projects}) => {
  return (
    <TileList>
      {projects.map((project) => (
        <ProjectsListItem project={project} key={project.id} />
      ))}
    </TileList>
  );
};
