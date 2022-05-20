import Head from "next/head";
import {FC} from "react";
import {Col, Row} from "react-grid-system";
import {GetAnalyserResponse} from "../../../backend/remote/requests/getAnalyser";
import {Button} from "../../../components/atoms/buttons/Button";
import {Page} from "../../../components/atoms/layout/Page";
import {Modal} from "../../../components/atoms/modal/Modal";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {ClassifierDashboard} from "../../../components/organisms/classifier/ClassifierDashboard";
import {ClassifierPanel} from "../../../components/organisms/classifier/ClassifierPanel";
import {CreateProjectModal, CreateProjectModalArgs} from "../../../components/organisms/modals/CreateProjectModal";
import {ProjectsListItems} from "../../../components/organisms/projectslist/ProjectsListItems";
import {
  ProjectsListNavigation,
  ProjectsListNavigationItems
} from "../../../components/organisms/projectslist/ProjectsListNavigation";
import {useModal} from "../../../hooks/useModal";
import {RestAnalyserStatus} from "../../../types/analyser";
import {RestProject} from "../../../types/project";
import {RestServerResponse} from "../../../types/response";

interface ProjectsListTemplateProps {
  projects: RestProject[];
  analyserResponse: RestServerResponse<GetAnalyserResponse>;

  onReload(): void;
}

export const ProjectsListTemplate: FC<ProjectsListTemplateProps> = ({projects, onReload, analyserResponse}) => {
  const [createProjectSession, openCreateProjectModal] = useModal<CreateProjectModalArgs, [RestProject]>();

  return (
    <Page>
      <Head>
        <title>Projects</title>
      </Head>
      <ProjectsListNavigation />
      <NavBarContent id={ProjectsListNavigationItems.PROJECTS}>
        <PageHeader title="Available projects">
          <Button type="color" tint="green" onClick={() => openCreateProjectModal({}).then(onReload)}>
            New project
          </Button>
        </PageHeader>
        <ProjectsListItems projects={projects} />
      </NavBarContent>
      <NavBarContent id={ProjectsListNavigationItems.CLASSIFIER}>
        <PageHeader title="Classifier Status" />
        <ClassifierDashboard analyserResponse={analyserResponse} />
      </NavBarContent>
      <NavBarContent id={ProjectsListNavigationItems.SETTINGS}>
        <PageHeader title="Settings" />
      </NavBarContent>
      <Modal session={createProjectSession} content={CreateProjectModal} />
    </Page>
  );
};
