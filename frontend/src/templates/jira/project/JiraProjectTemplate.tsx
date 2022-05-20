import {FC} from "react";
import {Page} from "../../../components/atoms/layout/Page";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {JiraIssuesList} from "../../../components/organisms/issueslist/JiraIssuesList";
import {JiraProjectDashboard} from "../../../components/organisms/jiraproject/JiraProjectDashboard";
import {JiraProjectDashboardHeader} from "../../../components/organisms/jiraproject/JiraProjectDashboardHeader";
import {
  JiraProjectNavigation,
  JiraProjectNavigationItems
} from "../../../components/organisms/jiraproject/JiraProjectNavigation";
import {RestDebtStatistics} from "../../../types/debt";
import {RestJiraIssue, RestJiraProject, RestJiraProjectStatistics} from "../../../types/jira";
import {RestPage} from "../../../types/paging";
import {RestServerResponse} from "../../../types/response";

interface JiraProjectTemplateProps {
  jiraProject: RestJiraProject;
  statisticsResponse: RestServerResponse<RestJiraProjectStatistics>;
  issuesResponse: RestServerResponse<RestPage<RestJiraIssue>>;

  onReload(): void;
}

export const JiraProjectTemplate: FC<JiraProjectTemplateProps> = ({
  issuesResponse,
  jiraProject,
  statisticsResponse,
  onReload
}) => {
  return (
    <Page>
      <JiraProjectNavigation />
      <NavBarContent id={JiraProjectNavigationItems.DASHBOARD}>
        <JiraProjectDashboardHeader jiraProject={jiraProject} onReload={onReload} />
        <JiraProjectDashboard jiraProject={jiraProject} statisticsResponse={statisticsResponse} />
      </NavBarContent>

      <NavBarContent id={JiraProjectNavigationItems.ISSUES}>
        <PageHeader title="Issues" />
        <JiraIssuesList issuesResponse={issuesResponse} />
      </NavBarContent>
    </Page>
  );
};
