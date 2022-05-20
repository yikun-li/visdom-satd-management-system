import {FC} from "react";
import {RestGitCommit} from "../../../types/git";
import {RestPage} from "../../../types/paging";
import {Table} from "../../atoms/table/Table";
import {TableColumn} from "../../atoms/table/TableColumn";
import {Code} from "../../atoms/typography/Code";
import {Label} from "../../atoms/typography/Label";
import {PageFooter} from "../page/PageFooter";
import {CommitsTableContextMenu} from "./CommitsTableContextMenu";

interface CommitsTableProps {
  commits: RestPage<RestGitCommit> | null;
  loading?: boolean;

  onChangePage(page: number): void;

  onClick(commit: RestGitCommit): void;
}

export const CommitsTable: FC<CommitsTableProps> = ({commits, loading, onChangePage, onClick}) => {
  return (
    <>
      <Table loading={loading} data={commits?.content ?? []} keyExtractor={(commit) => commit.id} onRowClick={onClick}>
        <TableColumn<RestGitCommit, "hash">
          width={180}
          dataKey="hash"
          render={(hash) => <Code>{hash.substr(0, 12)}</Code>}
        >
          Hash
        </TableColumn>
        <TableColumn<RestGitCommit, "shortMessage"> dataKey="shortMessage">Message</TableColumn>
        <TableColumn<RestGitCommit, "snapped">
          width={120}
          dataKey="snapped"
          align="center"
          render={(snapped) => (snapped ? <Label color="green">Yes</Label> : <Label color="red">No</Label>)}
        >
          Indexed
        </TableColumn>
        <TableColumn<RestGitCommit, "date">
          align="center"
          width={240}
          dataKey="date"
          render={(date) => new Date(date).toDateString()}
        >
          Date
        </TableColumn>
        <TableColumn<RestGitCommit>
          width={80}
          render={(commit) => (
            <CommitsTableContextMenu commit={commit} onOpen={() => onClick(commit)} onIndex={() => void 0} />
          )}
        />
      </Table>
      {commits && <PageFooter page={commits} onChangePage={onChangePage} />}
    </>
  );
};
