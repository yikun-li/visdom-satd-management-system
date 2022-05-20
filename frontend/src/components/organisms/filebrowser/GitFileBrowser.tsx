import {useRouter} from "next/router";
import {FC, useState} from "react";
import {getGitCommitFiles} from "../../../backend/remote/requests";
import {HttpError} from "../../../backend/remote/util/errors";
import {RestError} from "../../../backend/remote/util/response";
import {useLastResponse} from "../../../hooks/useLastResponse";
import {usePage} from "../../../hooks/usePage";
import {useRequestResource} from "../../../hooks/useRequestResource";
import {RestGitDirectory, RestGitFile} from "../../../types/git";
import {Panel} from "../../atoms/panel/Panel";
import {Heading} from "../../atoms/typography/Heading";
import {Paragraph} from "../../atoms/typography/Paragraph";
import {FileDisplay} from "../filedisplay/FileDisplay";
import {NotScannedMessage} from "../../molecules/messages/NotScannedMessage";
import {FilesTable} from "../../molecules/tables/FilesTable";

interface GitFileBrowserProps {
  commitId: number;
}

function parentDir(dir: string): string {
  if (dir === "/") return "/";
  const dirs = dir.split("/");
  dirs.pop();
  dirs[dirs.length - 1] = "";
  return dirs.join("/");
}

export const GitFileBrowser: FC<GitFileBrowserProps> = ({commitId}) => {
  const router = useRouter();
  const {to, query} = usePage();
  const dir = query.search.dir || "/";
  const filesResponse = useRequestResource(getGitCommitFiles, [commitId, dir]);
  const [openFile, setOpenFile] = useState<RestGitFile | null>(null);
  const [loading, files] = useLastResponse(filesResponse);

  const handleGoUp = () => {
    router.push(...to({...query.search, dir: parentDir(dir)}), {shallow: true});
  };

  const handleOpenDirectory = (directory: RestGitDirectory) => {
    router.push(...to({...query.search, dir: `${directory.path}${directory.name}/`}), {shallow: true});
  };

  return (
    <>
      {files.loading || files.success ? (
        <FilesTable
          files={files.loading ? [] : files.body.files}
          directories={files.loading ? [] : files.body.directories}
          canGoUp={!files.loading && files.body.path !== "/"}
          onOpenFile={(file) => setTimeout(() => setOpenFile(file))}
          onGoUp={handleGoUp}
          onOpenDirectory={handleOpenDirectory}
          loading={loading}
        />
      ) : files.error instanceof RestError &&
        files.error.cause instanceof HttpError &&
        files.error.cause.status === 404 ? (
        <NotScannedMessage />
      ) : (
        <Panel fill="red">
          <Heading>An error occurred</Heading>
          <Paragraph>Something went wrong whilst retrieving the files.</Paragraph>
        </Panel>
      )}
      <FileDisplay file={openFile} onClose={() => setOpenFile(null)} />
    </>
  );
};
