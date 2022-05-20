import {FC} from "react";
import {ReactComponent as JiraIcon} from "../../../assets/icons/fa/jira-brands.svg";
import {RestProjectJiraSource} from "../../../types/project";
import {SourcesListItemBase} from "./SourcesListItemBase";

interface SourcesListItemJiraProps {
  source: RestProjectJiraSource;
  projectId: number;
}

export const SourcesListItemJira: FC<SourcesListItemJiraProps> = ({source, projectId}) => {
  return (
    <SourcesListItemBase
      title={source.jira.name}
      icon={JiraIcon}
      to={`/projects/${projectId}/jira/${source.jira.id}`}
    />
  );
};
