import Head from "next/head";
import {FC} from "react";
import {Page} from "../../../components/atoms/layout/Page";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {
  GitRepositoryNavigation,
  GitRepositoryNavigationItems
} from "../../../components/organisms/gitrepository/GitRepositoryNavigation";

interface GitRepositoryLoadingTemplateProps {
  projectId: number;
}

export const GitRepositoryLoadingTemplate: FC<GitRepositoryLoadingTemplateProps> = () => {
  return (
    <Page>
      <Head>
        <title>Projects</title>
      </Head>
      <GitRepositoryNavigation />

      <NavBarContent id={GitRepositoryNavigationItems.DASHBOARD}>
        <PageHeader title="Repository Dashboard" />
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.BRANCHES}>
        <PageHeader title="Branches" />
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.COMMITS}>
        <PageHeader title="Commits" />
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.FILES}>
        <PageHeader title="Files" />
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.HEATMAP}>
        <PageHeader title="Heatmap" />
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.SETTINGS}>
        <PageHeader title="Repository Settings" />
      </NavBarContent>
    </Page>
  );
};
