import {FC, useMemo} from "react";
import {RestGitDirectory, RestGitFile} from "../../../types/git";
import {Table} from "../../atoms/table/Table";
import {TableColumn} from "../../atoms/table/TableColumn";
import {Label} from "../../atoms/typography/Label";
import {FileCommentsStatistics} from "../file/FileCommentsStatistics";
import {FilenameColumn} from "../file/FilenameColumn";
import {FileSatdPercentages} from "../file/FileSatdPercentages";
import s from "./FilesTable.module.scss";

interface FilesTableProps {
  directories: RestGitDirectory[];
  files: RestGitFile[];
  canGoUp?: boolean;
  loading: boolean;

  onOpenFile(file: RestGitFile): void;

  onGoUp(): void;

  onOpenDirectory(directory: RestGitDirectory): void;
}

export type FileTableEntry = {directory: true; data: RestGitDirectory} | {directory: false; data: RestGitFile};

function sortDirs(a: RestGitDirectory, b: RestGitDirectory): number {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

function sortFiles(a: RestGitFile, b: RestGitFile): number {
  return a.filename < b.filename ? -1 : a.filename > b.filename ? 1 : 0;
}

export const FilesTable: FC<FilesTableProps> = ({
  directories,
  files,
  canGoUp,
  onOpenDirectory,
  onOpenFile,
  onGoUp,
  loading
}) => {
  const entries = useMemo<FileTableEntry[]>(
    () => [
      ...(canGoUp ? [{directory: true as const, data: {name: "..", path: "..", statistics: null}}] : []),
      ...directories.sort(sortDirs).map((data) => ({directory: true as const, data})),
      ...files.sort(sortFiles).map((data) => ({directory: false as const, data}))
    ],
    [canGoUp, directories, files]
  );

  return (
    <Table<FileTableEntry>
      className={s.table}
      data={entries}
      keyExtractor={(entry) => (entry.directory ? entry.data.name : entry.data.id)}
      onRowClick={(entry) =>
        entry.directory ? (entry.data.name === ".." ? onGoUp() : onOpenDirectory(entry.data)) : onOpenFile(entry.data)
      }
      rowClass={() => s.row}
      loading={loading}
    >
      <TableColumn<FileTableEntry>
        render={(entry) => (
          <FilenameColumn directory={entry.directory}>
            {entry.directory ? entry.data.name : entry.data.filename}
          </FilenameColumn>
        )}
      >
        File
      </TableColumn>
      <TableColumn<FileTableEntry>
        width={160}
        align="center"
        render={(entry) =>
          entry.directory ? (
            entry.data.statistics && <FileCommentsStatistics statistics={entry.data.statistics} />
          ) : entry.data.scannedForComments ? (
            entry.data.statistics && <FileCommentsStatistics statistics={entry.data.statistics} />
          ) : (
            <Label color="red">Not scanned</Label>
          )
        }
      >
        Comments
      </TableColumn>
      <TableColumn<FileTableEntry>
        width={320}
        align="center"
        render={(entry) =>
          entry.directory
            ? entry.data.statistics && <FileSatdPercentages statistics={entry.data.statistics} />
            : entry.data.scannedForComments
            ? entry.data.statistics && <FileSatdPercentages statistics={entry.data.statistics} />
            : null
        }
      >
        SATD
      </TableColumn>
    </Table>
  );
};
