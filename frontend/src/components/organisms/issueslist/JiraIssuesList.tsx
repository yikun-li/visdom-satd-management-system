import {useRouter} from "next/router";
import {FC, useCallback} from "react";
import {useLastResponse} from "../../../hooks/useLastResponse";
import {usePage} from "../../../hooks/usePage";
import {useServerResponse} from "../../../hooks/useServerResponse";
import {RestGitCommit} from "../../../types/git";
import {RestJiraIssue} from "../../../types/jira";
import {RestPage} from "../../../types/paging";
import {RestServerResponse} from "../../../types/response";
import {Heading} from "../../atoms/typography/Heading";
import {CommitsTable} from "../../molecules/tables/CommitsTable";
import {IssuesTable} from "../../molecules/tables/IssuesTable";

interface JiraIssuesListProps {
  issuesResponse: RestServerResponse<RestPage<RestJiraIssue>>;
}

export const JiraIssuesList: FC<JiraIssuesListProps> = ({issuesResponse}) => {
  const {to} = usePage();
  const router = useRouter();
  const [loading, response] = useLastResponse(useServerResponse(issuesResponse));

  const handlePageChange = useCallback(
    (page: number) => router.replace(...to({page})).catch(() => void 0),
    [router, to]
  );

  const handleClick = useCallback((commit: RestJiraIssue) => {}, [router]);

  return response.loading || response.success ? (
    <IssuesTable
      issues={response.loading ? null : response.body}
      onChangePage={handlePageChange}
      onClick={handleClick}
      loading={loading}
    />
  ) : (
    <Heading>Failed</Heading>
  );
};
