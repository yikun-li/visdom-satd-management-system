import {FC} from "react";
import {ServerSideProps} from "../../../../../backend/pageprops/builder";
import {getGitCommits, getGitRepositoryBranches} from "../../../../../backend/remote/requests";
import {getGitRepository} from "../../../../../backend/remote/requests/getGitRepository";
import {GitRepositoryNavigationItems} from "../../../../../components/organisms/gitrepository/GitRepositoryNavigation";
import {PageContextProvider} from "../../../../../components/util/PageContextProvider";
import {useNavbar} from "../../../../../hooks/useNavbar";
import {useServerResponse} from "../../../../../hooks/useServerResponse";
import {GitRepositoryErrorTemplate} from "../../../../../templates/git/repository/GitRepositoryErrorTemplate";
import {GitRepositoryLoadingTemplate} from "../../../../../templates/git/repository/GitRepositoryLoadingTemplate";
import {GitRepositoryTemplate} from "../../../../../templates/git/repository/GitRepositoryTemplate";
import {RestGetGitRepositoryResponse, RestGitBranch, RestGitCommit} from "../../../../../types/git";
import {RestPage} from "../../../../../types/paging";
import {RestServerResponse} from "../../../../../types/response";
import {ProjectPageQuery} from "../../index";

interface GitRepositoryPageProps {
  projectId: number;
  queryBranch: string | null;
  repositoryResponse: RestServerResponse<RestGetGitRepositoryResponse>;
  commitsResponse: RestServerResponse<RestPage<RestGitCommit>>;
  branchesResponse: RestServerResponse<RestGitBranch[]>;
}

export interface GitRepositoryPageQuery extends ProjectPageQuery {
  repositoryId: string;
}

export const GitRepositoryPage: FC<GitRepositoryPageProps> = ({
  projectId,
  repositoryResponse,
  queryBranch,
  commitsResponse,
  branchesResponse
}) => {
  const response = useServerResponse(repositoryResponse);
  const nav = useNavbar(GitRepositoryNavigationItems.DASHBOARD, `/projects/${projectId}`);

  return (
    <PageContextProvider nav={nav}>
      {response.loading ? (
        <GitRepositoryLoadingTemplate projectId={projectId} />
      ) : response.success ? (
        <GitRepositoryTemplate
          repositoryInfo={response.body}
          projectId={projectId}
          branch={queryBranch || response.body.repository.defaultBranch}
          commitsResponse={commitsResponse}
          branchesResponse={branchesResponse}
          onReload={response.reload}
        />
      ) : (
        <GitRepositoryErrorTemplate error={response.error} />
      )}
    </PageContextProvider>
  );
};

export const getServerSideProps = ServerSideProps.builder<GitRepositoryPageProps, GitRepositoryPageQuery>()
  .request(
    "repositoryResponse",
    getGitRepository,
    ({pathId, queryStr}) => [pathId("repositoryId"), queryStr("branch") || null] as const
  )
  .request(
    "commitsResponse",
    getGitCommits,
    ({pathId, queryStr, paging}) => [pathId("repositoryId"), paging, queryStr("branch") || null] as const,
    ({queryStr}) => queryStr("tab") === GitRepositoryNavigationItems.COMMITS
  )
  .request(
    "branchesResponse",
    getGitRepositoryBranches,
    ({pathId}) => [pathId("repositoryId")] as const,
    ({queryStr}) => queryStr("tab") === GitRepositoryNavigationItems.BRANCHES
  )
  .toProps(({response, pathId, queryStr}) => ({
    repositoryResponse: response("repositoryResponse"),
    commitsResponse: response("commitsResponse"),
    branchesResponse: response("branchesResponse"),
    projectId: pathId("projectId"),
    queryBranch: queryStr("branch") || null
  }))
  .build();

export default GitRepositoryPage;
