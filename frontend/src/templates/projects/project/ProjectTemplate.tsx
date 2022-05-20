import Head from "next/head";
import {FC} from "react";
import {Button} from "../../../components/atoms/buttons/Button";
import {Page} from "../../../components/atoms/layout/Page";
import {Modal} from "../../../components/atoms/modal/Modal";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {AddSourceModal, AddSourceModalArgs} from "../../../components/organisms/modals/addsource/AddSourceModal";
import {ProjectDashboard} from "../../../components/organisms/project/ProjectDashboard";
import {ProjectNavigation, ProjectNavigationItems} from "../../../components/organisms/project/ProjectNavigation";
import {ProjectSourcesList} from "../../../components/organisms/sourceslist/ProjectSourcesList";
import {useModal} from "../../../hooks/useModal";
import {RestProject} from "../../../types/project";

interface ProjectTemplateProps {
  project: RestProject;

  onReload(): void;
}

export const ProjectTemplate: FC<ProjectTemplateProps> = ({project, onReload}) => {
  const [addSourceModalSession, openAddSourceModal] = useModal<AddSourceModalArgs>();

  return (
    <Page>
      <Head>
        <title>Project</title>
      </Head>
      <ProjectNavigation />
      <NavBarContent id={ProjectNavigationItems.DASHBOARD}>
        <PageHeader title="Project Dashboard" />
        <ProjectDashboard project={project} />
      </NavBarContent>
      <NavBarContent id={ProjectNavigationItems.SOURCES}>
        <PageHeader title="Sources">
          <Button type="color" tint="green" onClick={() => openAddSourceModal({project}).then(onReload)}>
            Add source
          </Button>
        </PageHeader>
        {project.sources && <ProjectSourcesList sources={project.sources} projectId={project.id} />}
      </NavBarContent>
      <NavBarContent id={ProjectNavigationItems.SETTINGS}>
        <PageHeader title="Project Settings" />
      </NavBarContent>

      <Modal session={addSourceModalSession} content={AddSourceModal} />
    </Page>
  );
};
