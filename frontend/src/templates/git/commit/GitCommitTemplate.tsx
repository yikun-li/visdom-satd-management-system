import Head from "next/head";
import {FC} from "react";
import {Page} from "../../../components/atoms/layout/Page";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {GitFileBrowser} from "../../../components/organisms/filebrowser/GitFileBrowser";
import {FileHeatmapBoard} from "../../../components/organisms/fileheatmap/FileHeatmapBoard";
import {GitCommitDashboard} from "../../../components/organisms/gitcommit/GitCommitDashboard";
import {
  GitCommitNavigation,
  GitCommitNavigationItems
} from "../../../components/organisms/gitcommit/GitCommitNavigation";
import {RestGitCommit} from "../../../types/git";

interface GitCommitTemplateProps {
  projectId: number;
  repositoryId: number;
  commit: RestGitCommit;
}

export const GitCommitTemplate: FC<GitCommitTemplateProps> = ({commit}) => {
  return (
    <Page>
      <Head>
        <title>Commits - SATD Analyser</title>
      </Head>
      <GitCommitNavigation />
      <NavBarContent id={GitCommitNavigationItems.OVERVIEW}>
        <PageHeader title="Commit Overview" />
        <GitCommitDashboard commit={commit} />
      </NavBarContent>
      <NavBarContent id={GitCommitNavigationItems.FILES}>
        <PageHeader title="Files" />
        <GitFileBrowser commitId={commit.id} />
      </NavBarContent>
      <NavBarContent id={GitCommitNavigationItems.HEATMAP}>
        <PageHeader title="Heatmap" />
        {commit.snapped ? <FileHeatmapBoard commitId={commit.id} /> : null}
      </NavBarContent>
    </Page>
  );
};
