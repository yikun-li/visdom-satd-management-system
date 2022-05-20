import c from "classnames";
import {FC, useEffect, useRef} from "react";
import {useModal} from "../../../hooks/useModal";
import {useOutsideClick} from "../../../hooks/useOutsideClick";
import {RestGitFile} from "../../../types/git";
import {Modal} from "../../atoms/modal/Modal";
import {ViewCommentModal, ViewCommentModalArgs} from "../modals/viewcomment/ViewCommentModal";
import s from "./FileDisplay.module.scss";
import {FileDisplayContent} from "./FileDisplayContent";

interface FileDisplayProps {
  file: RestGitFile | null;

  onClose(): void;
}

export const FileDisplay: FC<FileDisplayProps> = ({file: currentFile, onClose}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [modalSession, openModal] = useModal<ViewCommentModalArgs>();
  const fileRef = useRef(currentFile);
  const file = currentFile || fileRef.current;

  useEffect(() => {
    if (currentFile) fileRef.current = currentFile;
  }, [currentFile]);

  useOutsideClick(containerRef.current, () => !modalSession && onClose());

  return (
    <>
      <div ref={containerRef} className={c(s.container, currentFile !== null && s.open)}>
        {file && <FileDisplayContent file={file} onOpenComment={(comment, file) => openModal({comment, file})} />}
      </div>
      <Modal session={modalSession} content={ViewCommentModal} />
    </>
  );
};
