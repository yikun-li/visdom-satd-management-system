import {FC} from "react";
import {RestGitBranch} from "../../../types/git";
import {formatInteger} from "../../../util/format/number";
import {Stack} from "../../atoms/layout/Stack";
import {Table} from "../../atoms/table/Table";
import {TableColumn} from "../../atoms/table/TableColumn";
import {Code} from "../../atoms/typography/Code";
import {Label} from "../../atoms/typography/Label";
import {BranchesTableContextMenu} from "./BranchesTableContextMenu";

interface BranchesTableProps {
  branches: RestGitBranch[] | null;
  defaultBranch: string;
  currentBranch: string;
  loading: boolean;

  onClick(branch: RestGitBranch): void;

  onScan(branch: RestGitBranch): void;

  onTrackBranch(branch: RestGitBranch): void;
}

export const BranchesTable: FC<BranchesTableProps> = ({
  branches,
  onClick,
  defaultBranch,
  currentBranch,
  loading,
  onScan,
  onTrackBranch
}) => {
  return (
    <Table data={branches ?? []} keyExtractor={(branch) => branch.name} onRowClick={onClick} loading={loading}>
      <TableColumn<RestGitBranch, "name">
        dataKey="name"
        render={(name) => (
          <Stack horizontal spacing="m">
            <Code>{name}</Code>
            {defaultBranch === name && <Label color="blue">Default</Label>}
            {currentBranch === name && (
              <Label color="green" fill>
                Selected
              </Label>
            )}
          </Stack>
        )}
      >
        Name
      </TableColumn>
      <TableColumn<RestGitBranch>
        width={200}
        align="center"
        render={({id, totalCommits, totalSnapped}) =>
          id !== null ? (
            <strong>
              {formatInteger(totalSnapped ?? 0)} / {formatInteger(totalCommits ?? 0)}
            </strong>
          ) : (
            <Label color="red">Not tracked</Label>
          )
        }
      >
        Commits
      </TableColumn>
      <TableColumn<RestGitBranch>
        width={80}
        render={(branch) => (
          <BranchesTableContextMenu
            branch={branch}
            onSelect={() => onClick(branch)}
            onStartTracking={() => onTrackBranch(branch)}
            onScanCommits={() => onScan(branch)}
          />
        )}
      />
    </Table>
  );
};
