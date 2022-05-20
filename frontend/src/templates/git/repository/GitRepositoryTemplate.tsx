import Head from "next/head";
import {FC} from "react";
import {RadioInput} from "../../../components/atoms/form/RadioInput";
import {Page} from "../../../components/atoms/layout/Page";
import {Modal} from "../../../components/atoms/modal/Modal";
import {Panel} from "../../../components/atoms/panel/Panel";
import {Heading} from "../../../components/atoms/typography/Heading";
import {RadioListInput} from "../../../components/molecules/form/radio/RadioListInput";
import {RadioListItem} from "../../../components/molecules/form/radio/RadioListItem";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NotScannedMessage} from "../../../components/molecules/messages/NotScannedMessage";
import {UntrackedMessage} from "../../../components/molecules/messages/UntrackedMessage";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {GitBranchList} from "../../../components/organisms/branchlist/GitBranchList";
import {GitCommitsList} from "../../../components/organisms/commitslist/GitCommitsList";
import {GitFileBrowser} from "../../../components/organisms/filebrowser/GitFileBrowser";
import {FileHeatmapBoard} from "../../../components/organisms/fileheatmap/FileHeatmapBoard";
import {GitRepositoryDashboard} from "../../../components/organisms/gitrepository/GitRepositoryDashboard";
import {GitRepositoryDashboardHeader} from "../../../components/organisms/gitrepository/GitRepositoryDashboardHeader";
import {
  GitRepositoryNavigation,
  GitRepositoryNavigationItems
} from "../../../components/organisms/gitrepository/GitRepositoryNavigation";
import {GitRepositoryUntrackedDashboard} from "../../../components/organisms/gitrepository/GitRepositoryUntrackedDashboard";
import {
  ScanRepositoryModal,
  ScanRepositoryModalArgs
} from "../../../components/organisms/modals/scan/ScanRepositoryModal";
import {Test} from "../../../components/util/Test";
import {useModal} from "../../../hooks/useModal";
import {RestGetGitRepositoryResponse, RestGitBranch, RestGitCommit} from "../../../types/git";
import {RestPage} from "../../../types/paging";
import {RestServerResponse} from "../../../types/response";

interface GitRepositoryTemplateProps {
  projectId: number;
  repositoryInfo: RestGetGitRepositoryResponse;
  branch: string;
  commitsResponse: RestServerResponse<RestPage<RestGitCommit>>;
  branchesResponse: RestServerResponse<RestGitBranch[]>;

  onReload(): void;
}

export const GitRepositoryTemplate: FC<GitRepositoryTemplateProps> = ({
  projectId,
  commitsResponse,
  branchesResponse,
  repositoryInfo,
  branch,
  onReload
}) => {
  const [scanModalSession, openScanModal] = useModal<ScanRepositoryModalArgs>();
  const latestSnappedCommitId = repositoryInfo.latestSnapshot?.commitIds[0] ?? null;

  return (
    <Page>
      <Head>
        <title>Projects</title>
      </Head>

      <GitRepositoryNavigation />

      <NavBarContent id={GitRepositoryNavigationItems.DASHBOARD}>
        <GitRepositoryDashboardHeader
          projectId={projectId}
          repositoryId={repositoryInfo.repository.id}
          branch={repositoryInfo.branch}
          onOpenScan={() => openScanModal({repository: repositoryInfo.repository, branch: repositoryInfo.branch!})}
          onReload={onReload}
        />
        {repositoryInfo.branch ? (
          <GitRepositoryDashboard
            repository={repositoryInfo.repository}
            branch={repositoryInfo.branch}
            latestCommit={repositoryInfo.latestCommit}
            latestSnapshot={repositoryInfo.latestSnapshot}
          />
        ) : (
          <GitRepositoryUntrackedDashboard repository={repositoryInfo.repository} branch={branch} onReload={onReload} />
        )}
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.BRANCHES}>
        <PageHeader title="Branches" />
        <GitBranchList
          defaultBranch={repositoryInfo.repository.defaultBranch}
          serverResponse={branchesResponse}
          currentBranch={branch}
          onOpenScan={(branch) => openScanModal({repository: repositoryInfo.repository, branch})}
          repository={repositoryInfo.repository}
          onReload={onReload}
        />
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.COMMITS}>
        <PageHeader title="Commits" />
        {repositoryInfo.branch ? (
          <GitCommitsList
            serverResponse={commitsResponse}
            commitUrl={`/projects/${projectId}/git/${repositoryInfo.repository.id}/commits`}
          />
        ) : (
          <UntrackedMessage branch={branch} />
        )}
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.FILES}>
        <PageHeader title="Files" />
        {latestSnappedCommitId ? <GitFileBrowser commitId={latestSnappedCommitId} /> : <NotScannedMessage />}
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.HEATMAP}>
        <PageHeader title="Heatmap" />
        {latestSnappedCommitId ? <FileHeatmapBoard commitId={latestSnappedCommitId} /> : <NotScannedMessage />}
      </NavBarContent>

      <NavBarContent id={GitRepositoryNavigationItems.SETTINGS}>
        <PageHeader title="Repository Settings" />
      </NavBarContent>

      <Modal session={scanModalSession} content={ScanRepositoryModal} />
    </Page>
  );
};
