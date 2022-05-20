import {FC} from "react";
import {getGitFile} from "../../../backend/remote/requests";
import {useRequestResource} from "../../../hooks/useRequestResource";
import {RestGitFile, RestGitFileComment} from "../../../types/git";
import {fileExtension} from "../../../util/files";
import {FileComment} from "../../atoms/filecontent/FileComment";
import {FileContent} from "../../atoms/filecontent/FileContent";
import {Paragraph} from "../../atoms/typography/Paragraph";
import {PageHeader} from "../../molecules/header/PageHeader";

interface FileDisplayContentProps {
  file: RestGitFile;

  onOpenComment(comment: RestGitFileComment, file: RestGitFile): void;
}

export const FileDisplayContent: FC<FileDisplayContentProps> = ({file, onOpenComment}) => {
  const fileContent = useRequestResource(getGitFile, [file.id]);

  return (
    <div>
      <PageHeader title={file.filename} />

      {!file.scannedForComments && <Paragraph>This file has not been scanned for comments yet.</Paragraph>}

      {fileContent.loading ? (
        <div></div>
      ) : fileContent.success ? (
        fileContent.body.content ? (
          <FileContent content={fileContent.body.content ?? ""} language={fileExtension(file.filename)}>
            {fileContent.body.comments?.map((comment) => (
              <FileComment
                key={comment.id}
                comment={comment}
                startLine={comment.line}
                numLines={comment.content.trim().split("\n").length}
                onClick={() => onOpenComment(comment, fileContent.body)}
              />
            ))}
          </FileContent>
        ) : (
          <Paragraph>No file content found.</Paragraph>
        )
      ) : (
        <Paragraph>Error loading file content.</Paragraph>
      )}
    </div>
  );
};
