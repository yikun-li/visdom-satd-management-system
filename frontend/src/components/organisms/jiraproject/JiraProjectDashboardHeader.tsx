import {FC} from "react";
import {postGitRepositoryScan, postJiraProjectScan} from "../../../backend/remote/requests";
import {useStartJob} from "../../../hooks/useStartJob";
import {RestJiraProject} from "../../../types/jira";
import {ButtonWithContextMenu} from "../../atoms/contextmenu/ButtonWithContextMenu";
import {ContextMenuItem} from "../../atoms/contextmenu/ContextMenuItem";
import {PageHeader} from "../../molecules/header/PageHeader";

interface JiraProjectDashboardHeaderProps {
  jiraProject: RestJiraProject;

  onReload(): void;
}

export const JiraProjectDashboardHeader: FC<JiraProjectDashboardHeaderProps> = ({onReload, jiraProject}) => {
  const [scanJob, scanProject] = useStartJob(postJiraProjectScan, null, {onDone: onReload});

  return (
    <PageHeader title="Jira Project Dashboard">
      <ButtonWithContextMenu>
        <ContextMenuItem onClick={() => scanProject(jiraProject.id)}>Scan For Issues</ContextMenuItem>
      </ButtonWithContextMenu>
    </PageHeader>
  );
};
