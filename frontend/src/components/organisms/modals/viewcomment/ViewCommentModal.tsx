import {FC} from "react";
import {CloseModalFn} from "../../../../hooks/useModal";
import {DebtType} from "../../../../types/debt";
import {RestGitFile, RestGitFileComment} from "../../../../types/git";
import {fileExtension} from "../../../../util/files";
import {FileContent} from "../../../atoms/filecontent/FileContent";
import {Stack} from "../../../atoms/layout/Stack";
import {Heading} from "../../../atoms/typography/Heading";
import {KeywordsList} from "../../../molecules/keywords/KeywordsList";

export interface ViewCommentModalArgs {
  comment: RestGitFileComment;
  file: RestGitFile;
}

interface ViewCommentModalProps extends ViewCommentModalArgs {
  onClose: CloseModalFn;
}

export const ViewCommentModal: FC<ViewCommentModalProps> = ({comment, file}) => {
  return (
    <Stack spacing="l">
      <Heading>Code Comment</Heading>
      <FileContent content={comment.content.trim()} language={fileExtension(file.filename)} />
      {comment.debtType !== DebtType.NOT_DEBT && comment.debtType !== DebtType.NOT_ANALYSED && comment.keywords && (
        <Stack spacing="s">
          <Heading type="h5">Found keywords</Heading>
          <KeywordsList keywords={comment.keywords} />
        </Stack>
      )}
    </Stack>
  );
};
