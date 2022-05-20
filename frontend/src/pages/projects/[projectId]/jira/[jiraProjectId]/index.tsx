import {FC} from "react";
import {ServerSideProps} from "../../../../../backend/pageprops/builder";
import {getGitCommits, getJiraProject, getJiraProjectStatistics} from "../../../../../backend/remote/requests";
import {getJiraIssues} from "../../../../../backend/remote/requests/getJiraIssues";
import {GitRepositoryNavigationItems} from "../../../../../components/organisms/gitrepository/GitRepositoryNavigation";
import {JiraProjectNavigationItems} from "../../../../../components/organisms/jiraproject/JiraProjectNavigation";
import {PageContextProvider} from "../../../../../components/util/PageContextProvider";
import {useNavbar} from "../../../../../hooks/useNavbar";
import {useServerResponse} from "../../../../../hooks/useServerResponse";
import {JiraProjectErrorTemplate} from "../../../../../templates/jira/project/JiraProjectErrorTemplate";
import {JiraProjectLoadingTemplate} from "../../../../../templates/jira/project/JiraProjectLoadingTemplate";
import {JiraProjectTemplate} from "../../../../../templates/jira/project/JiraProjectTemplate";
import {RestJiraIssue, RestJiraProject, RestJiraProjectStatistics} from "../../../../../types/jira";
import {RestPage} from "../../../../../types/paging";
import {RestServerResponse} from "../../../../../types/response";
import {ProjectPageQuery} from "../../index";

interface JiraProjectPageProps {
  serverResponse: RestServerResponse<RestJiraProject>;
  issuesResponse: RestServerResponse<RestPage<RestJiraIssue>>;
  statisticsResponse: RestServerResponse<RestJiraProjectStatistics>;
  projectId: number;
}

interface JiraProjectPageQuery extends ProjectPageQuery {
  jiraProjectId: string;
}

export const JiraProjectPage: FC<JiraProjectPageProps> = ({
  serverResponse,
  statisticsResponse,
  projectId,
  issuesResponse
}) => {
  const response = useServerResponse(serverResponse);
  const nav = useNavbar(JiraProjectNavigationItems.DASHBOARD, `/projects/${projectId}`);

  return (
    <PageContextProvider nav={nav}>
      {response.loading ? (
        <JiraProjectLoadingTemplate />
      ) : response.success ? (
        <JiraProjectTemplate
          jiraProject={response.body}
          statisticsResponse={statisticsResponse}
          issuesResponse={issuesResponse}
          onReload={response.reload}
        />
      ) : (
        <JiraProjectErrorTemplate />
      )}
    </PageContextProvider>
  );
};

export const getServerSideProps = ServerSideProps.builder<JiraProjectPageProps, JiraProjectPageQuery>()
  .request("serverResponse", getJiraProject, ({pathId}) => [pathId("jiraProjectId")] as const)
  .request(
    "issuesResponse",
    getJiraIssues,
    ({pathId, paging}) => [pathId("jiraProjectId"), {...paging, sort: paging.sort || "updateDate,desc"}] as const,
    ({queryStr}) => queryStr("tab") === JiraProjectNavigationItems.ISSUES
  )
  .request(
    "statisticsResponse",
    getJiraProjectStatistics,
    ({pathId}) => [pathId("jiraProjectId")] as const,
    ({queryStr}) => queryStr("tab") === JiraProjectNavigationItems.DASHBOARD
  )
  .prop("projectId", ({pathId}) => pathId("projectId"))
  .build();

export default JiraProjectPage;
