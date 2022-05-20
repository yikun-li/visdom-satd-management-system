import Head from "next/head";
import {FC} from "react";
import {Page} from "../../../components/atoms/layout/Page";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {LoadingTileList} from "../../../components/molecules/util/LoadingTileList";
import {
  ProjectsListNavigation,
  ProjectsListNavigationItems
} from "../../../components/organisms/projectslist/ProjectsListNavigation";

interface ProjectsListLoadingTemplateProps {}

export const ProjectsListLoadingTemplate: FC<ProjectsListLoadingTemplateProps> = () => {
  return (
    <Page>
      <Head>
        <title>Projects</title>
      </Head>
      <ProjectsListNavigation />
      <NavBarContent id={ProjectsListNavigationItems.PROJECTS}>
        <PageHeader title="Available projects" />
        <LoadingTileList />
      </NavBarContent>
      <NavBarContent id={ProjectsListNavigationItems.CLASSIFIER}>
        <PageHeader title="Classifier Status" />
      </NavBarContent>
      <NavBarContent id={ProjectsListNavigationItems.SETTINGS}>
        <PageHeader title="Settings" />
      </NavBarContent>
    </Page>
  );
};
