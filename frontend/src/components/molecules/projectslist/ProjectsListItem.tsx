import {FC} from "react";
import {ReactComponent as GitIcon} from "../../../assets/icons/fa/git-brands.svg";
import {ReactComponent as JiraIcon} from "../../../assets/icons/fa/jira-brands.svg";
import {RestProject} from "../../../types/project";
import {BottomRight} from "../../atoms/layout/BottomRight";
import {TileItemContent} from "../../atoms/tilelist/TileItemContent";
import {TileListItem} from "../../atoms/tilelist/TileListItem";
import {NumberStat} from "../../atoms/typography/NumberStat";
import {Paragraph} from "../../atoms/typography/Paragraph";
import s from "./ProjectsListItem.module.scss";

interface ProjectsListItemProps {
  project: RestProject;
}

export const ProjectsListItem: FC<ProjectsListItemProps> = ({project}) => {
  return (
    <TileListItem to={`/projects/${project.id}`}>
      <TileItemContent title={project.name}>
        <Paragraph secondary>Created on: {new Date(project.created).toDateString()}</Paragraph>
        <Paragraph secondary>Last updated: {new Date(project.lastUpdated).toDateString()}</Paragraph>
        <BottomRight>
          {project.git ? <NumberStat icon={GitIcon} amount={project.git} className={s.stat} /> : null}
          {project.jira ? <NumberStat icon={JiraIcon} amount={project.jira} className={s.stat} /> : null}
        </BottomRight>
      </TileItemContent>
    </TileListItem>
  );
};
