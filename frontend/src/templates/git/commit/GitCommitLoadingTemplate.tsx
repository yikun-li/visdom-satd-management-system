import Head from "next/head";
import {FC} from "react";
import {Page} from "../../../components/atoms/layout/Page";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {
  GitCommitNavigation,
  GitCommitNavigationItems
} from "../../../components/organisms/gitcommit/GitCommitNavigation";

interface GitCommitLoadingTemplateProps {
  projectId: number;
  repositoryId: number;
}

export const GitCommitLoadingTemplate: FC<GitCommitLoadingTemplateProps> = ({projectId, repositoryId}) => {
  return (
    <Page>
      <Head>
        <title>Commits - SATD Analyser</title>
      </Head>
      <GitCommitNavigation />
      <NavBarContent id={GitCommitNavigationItems.OVERVIEW}>
        <PageHeader title="Commit Overview" />
      </NavBarContent>
      <NavBarContent id={GitCommitNavigationItems.FILES}>
        <PageHeader title="Files" />
      </NavBarContent>
    </Page>
  );
};
