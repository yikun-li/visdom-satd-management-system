import {ParsedUrlQuery} from "querystring";
import {FC} from "react";
import {ServerSideProps} from "../../../backend/pageprops/builder";
import {getProject} from "../../../backend/remote/requests";
import {ProjectNavigationItems} from "../../../components/organisms/project/ProjectNavigation";
import {PageContextProvider} from "../../../components/util/PageContextProvider";
import {useNavbar} from "../../../hooks/useNavbar";
import {useServerResponse} from "../../../hooks/useServerResponse";
import {ProjectErrorTemplate} from "../../../templates/projects/project/ProjectErrorTemplate";
import {ProjectLoadingTemplate} from "../../../templates/projects/project/ProjectLoadingTemplate";
import {ProjectTemplate} from "../../../templates/projects/project/ProjectTemplate";
import {RestProject} from "../../../types/project";
import {RestServerResponse} from "../../../types/response";

interface ProjectPageProps {
  serverResponse: RestServerResponse<RestProject>;
  projectId: number;
}

export interface ProjectPageQuery extends ParsedUrlQuery {
  projectId: string;
}

const ProjectPage: FC<ProjectPageProps> = ({serverResponse}) => {
  const response = useServerResponse(serverResponse);
  const nav = useNavbar(ProjectNavigationItems.DASHBOARD, "/projects");

  return (
    <PageContextProvider nav={nav}>
      {response.loading ? (
        <ProjectLoadingTemplate />
      ) : response.success ? (
        <ProjectTemplate project={response.body} onReload={response.reload} />
      ) : (
        <ProjectErrorTemplate error={response.error} />
      )}
    </PageContextProvider>
  );
};

export const getServerSideProps = ServerSideProps.builder<ProjectPageProps, ProjectPageQuery>()
  .request("serverResponse", getProject, ({pathId}) => [pathId("projectId")] as const)
  .prop("projectId", ({pathId}) => pathId("projectId"))
  .build();

export default ProjectPage;
