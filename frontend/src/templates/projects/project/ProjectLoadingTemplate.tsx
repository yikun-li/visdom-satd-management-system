import Head from "next/head";
import {FC} from "react";
import {Page} from "../../../components/atoms/layout/Page";
import {PageContent} from "../../../components/atoms/layout/PageContent";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {LoadingTileList} from "../../../components/molecules/util/LoadingTileList";
import {ProjectNavigation, ProjectNavigationItems} from "../../../components/organisms/project/ProjectNavigation";

interface ProjectLoadingTemplateProps {}

export const ProjectLoadingTemplate: FC<ProjectLoadingTemplateProps> = () => {
  return (
    <Page>
      <Head>
        <title>Project</title>
      </Head>
      <ProjectNavigation />
      <PageContent>
        <NavBarContent id={ProjectNavigationItems.DASHBOARD}>
          <PageHeader title="Project Dashboard" />
        </NavBarContent>
        <NavBarContent id={ProjectNavigationItems.SOURCES}>
          <PageHeader title="Sources" />
          <LoadingTileList />
        </NavBarContent>
        <NavBarContent id={ProjectNavigationItems.SETTINGS}>
          <PageHeader title="Project Settings" />
        </NavBarContent>
      </PageContent>
    </Page>
  );
};
