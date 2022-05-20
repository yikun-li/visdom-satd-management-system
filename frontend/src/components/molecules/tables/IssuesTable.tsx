import {FC} from "react";
import {RestGitCommit} from "../../../types/git";
import {RestJiraIssue} from "../../../types/jira";
import {RestPage} from "../../../types/paging";
import {Table} from "../../atoms/table/Table";
import {TableColumn} from "../../atoms/table/TableColumn";
import {Code} from "../../atoms/typography/Code";
import {Label} from "../../atoms/typography/Label";
import {PageFooter} from "../page/PageFooter";
import {CommitsTableContextMenu} from "./CommitsTableContextMenu";

interface IssuesTableProps {
  issues: RestPage<RestJiraIssue> | null;
  loading?: boolean;

  onChangePage(page: number): void;

  onClick(commit: RestJiraIssue): void;
}

export const IssuesTable: FC<IssuesTableProps> = ({loading, issues, onChangePage, onClick}) => {
  return (
    <>
      <Table loading={loading} data={issues?.content ?? []} keyExtractor={(issue) => issue.id} onRowClick={onClick}>
        <TableColumn<RestJiraIssue, "key">
          width={180}
          align="center"
          dataKey="key"
          render={(key) => <Code>{key}</Code>}
        >
          Issue Key
        </TableColumn>
        <TableColumn<RestJiraIssue, "summary"> dataKey="summary" render={(summary) => summary.content}>
          Summary
        </TableColumn>
        <TableColumn<RestJiraIssue>
          width={240}
          align="left"
          render={(issue) => (
            <>
              <div>Summary: {issue.summary.debtType}</div>
              {issue.description && <div>Description: {issue.description.debtType}</div>}
            </>
          )}
        >
          Debt
        </TableColumn>
        <TableColumn<RestJiraIssue, "type"> width={120} align="center" dataKey="type" render={(type) => type}>
          Issue type
        </TableColumn>
        <TableColumn<RestJiraIssue, "status"> width={120} align="center" dataKey="status" render={(type) => type}>
          Status
        </TableColumn>
        <TableColumn<RestJiraIssue>
          align="left"
          width={300}
          render={(date) => (
            <>
              <div>Created: {new Date(date.creationDate).toDateString()}</div>
              <div>Updated: {new Date(date.updateDate).toDateString()}</div>
            </>
          )}
        >
          Date
        </TableColumn>
        {/*<TableColumn<RestJiraIssue>*/}
        {/*  width={80}*/}
        {/*  render={(commit) => (*/}
        {/*    <CommitsTableContextMenu commit={commit} onOpen={() => onClick(commit)} onIndex={() => void 0} />*/}
        {/*  )}*/}
        {/*/>*/}
      </Table>
      {issues && <PageFooter page={issues} onChangePage={onChangePage} />}
    </>
  );
};
