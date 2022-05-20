import {FC} from "react";
import {ServerSideProps} from "../../backend/pageprops/builder";
import {getAnalyser, getProjects} from "../../backend/remote/requests";
import {GetAnalyserResponse} from "../../backend/remote/requests/getAnalyser";
import {ProjectsListNavigationItems} from "../../components/organisms/projectslist/ProjectsListNavigation";
import {PageContextProvider} from "../../components/util/PageContextProvider";
import {useNavbar} from "../../hooks/useNavbar";
import {useServerResponse} from "../../hooks/useServerResponse";
import {ProjectsListErrorTemplate} from "../../templates/projects/projectslist/ProjectsListErrorTemplate";
import {ProjectsListLoadingTemplate} from "../../templates/projects/projectslist/ProjectsListLoadingTemplate";
import {ProjectsListTemplate} from "../../templates/projects/projectslist/ProjectsListTemplate";
import {RestProject} from "../../types/project";
import {RestServerResponse} from "../../types/response";

interface ProjectsPageProps {
  serverResponse: RestServerResponse<RestProject[]>;
  analyserResponse: RestServerResponse<GetAnalyserResponse>;
}

export const ProjectsPage: FC<ProjectsPageProps> = ({serverResponse, analyserResponse}) => {
  const response = useServerResponse(serverResponse);
  const nav = useNavbar(ProjectsListNavigationItems.PROJECTS);

  return (
    <PageContextProvider nav={nav}>
      {response.loading ? (
        <ProjectsListLoadingTemplate />
      ) : response.success ? (
        <ProjectsListTemplate projects={response.body} onReload={response.reload} analyserResponse={analyserResponse} />
      ) : (
        <ProjectsListErrorTemplate error={response.error} />
      )}
    </PageContextProvider>
  );
};

export const getServerSideProps = ServerSideProps.builder<ProjectsPageProps>()
  .request("serverResponse", getProjects, () => [] as [])
  .request(
    "analyserResponse",
    getAnalyser,
    () => [] as const,
    ({queryStr}) => queryStr("tab") === ProjectsListNavigationItems.CLASSIFIER
  )
  .build();

export default ProjectsPage;
