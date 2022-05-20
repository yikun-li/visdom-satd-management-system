import {useRouter} from "next/router";
import {FC, useCallback} from "react";
import {useLastResponse} from "../../../hooks/useLastResponse";
import {usePage} from "../../../hooks/usePage";
import {useServerResponse} from "../../../hooks/useServerResponse";
import {RestGitCommit} from "../../../types/git";
import {RestPage} from "../../../types/paging";
import {RestServerResponse} from "../../../types/response";
import {Heading} from "../../atoms/typography/Heading";
import {CommitsTable} from "../../molecules/tables/CommitsTable";

interface GitCommitsListProps {
  serverResponse: RestServerResponse<RestPage<RestGitCommit>>;
  commitUrl: string;
}

export const GitCommitsList: FC<GitCommitsListProps> = ({serverResponse, commitUrl}) => {
  const {to} = usePage();
  const router = useRouter();
  const [loading, response] = useLastResponse(useServerResponse(serverResponse));

  const handlePageChange = useCallback(
    (page: number) => router.replace(...to({page})).catch(() => void 0),
    [router, to]
  );

  const handleClick = useCallback(
    (commit: RestGitCommit) => router.push(`${commitUrl}/${commit.id}`).catch(() => void 0),
    [commitUrl, router]
  );

  return response.loading || response.success ? (
    <CommitsTable
      commits={response.loading ? null : response.body}
      onChangePage={handlePageChange}
      onClick={handleClick}
      loading={loading}
    />
  ) : (
    <Heading>Failed</Heading>
  );
};
