import {FC} from "react";
import {ServerSideProps} from "../../../../../../../backend/pageprops/builder";
import {getGitCommit} from "../../../../../../../backend/remote/requests";
import {GitCommitNavigationItems} from "../../../../../../../components/organisms/gitcommit/GitCommitNavigation";
import {PageContextProvider} from "../../../../../../../components/util/PageContextProvider";
import {useNavbar} from "../../../../../../../hooks/useNavbar";
import {useServerResponse} from "../../../../../../../hooks/useServerResponse";
import {GitCommitErrorTemplate} from "../../../../../../../templates/git/commit/GitCommitErrorTemplate";
import {GitCommitLoadingTemplate} from "../../../../../../../templates/git/commit/GitCommitLoadingTemplate";
import {GitCommitTemplate} from "../../../../../../../templates/git/commit/GitCommitTemplate";
import {RestGitCommit} from "../../../../../../../types/git";
import {RestServerResponse} from "../../../../../../../types/response";
import {GitRepositoryPageQuery} from "../../index";

interface GitCommitPageProps {
  serverResponse: RestServerResponse<RestGitCommit>;
  projectId: number;
  repositoryId: number;
}

export interface GitCommitPageQuery extends GitRepositoryPageQuery {
  commitId: string;
}

export const GitCommitPage: FC<GitCommitPageProps> = ({serverResponse, repositoryId, projectId}) => {
  const response = useServerResponse(serverResponse);
  const nav = useNavbar(GitCommitNavigationItems.OVERVIEW, `/projects/${projectId}/git/${repositoryId}`);

  return (
    <PageContextProvider nav={nav}>
      {response.loading ? (
        <GitCommitLoadingTemplate projectId={projectId} repositoryId={repositoryId} />
      ) : response.success ? (
        <GitCommitTemplate projectId={projectId} repositoryId={repositoryId} commit={response.body} />
      ) : (
        <GitCommitErrorTemplate />
      )}
    </PageContextProvider>
  );
};

export const getServerSideProps = ServerSideProps.builder<GitCommitPageProps, GitCommitPageQuery>()
  .request("serverResponse", getGitCommit, ({pathId}) => [pathId("commitId")] as const)
  .prop("projectId", ({pathId}) => pathId("projectId"))
  .prop("repositoryId", ({pathId}) => pathId("repositoryId"))
  .build();

export default GitCommitPage;
