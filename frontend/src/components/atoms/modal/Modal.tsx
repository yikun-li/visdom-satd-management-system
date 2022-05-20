import c from "classnames";
import {FC, MouseEventHandler, useCallback, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {CloseModalFn, ModalSession} from "../../../hooks/useModal";
import s from "./Modal.module.scss";

interface ModalProps<Props, CloseArgs extends unknown[]> {
  session: ModalSession<Props, CloseArgs>;
  content: FC<{onClose: CloseModalFn<CloseArgs>} & Props>;
}

const root = process.browser && document.getElementById("modals");

export function Modal<Props, CloseArgs extends unknown[] = []>({
  session,
  content: ContentComponent
}: ModalProps<Props, CloseArgs>): ReturnType<FC<ModalProps<Props, CloseArgs>>> {
  const [portal, setPortal] = useState(session !== null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(session ? <ContentComponent onClose={session.close} {...session.props} /> : null);

  const handleBackdropClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      if (event.target === event.currentTarget && session) {
        session.close(...([] as unknown as CloseArgs));
      }
    },
    [session]
  );

  useEffect(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    if (session !== null) {
      contentRef.current = <ContentComponent onClose={session.close} {...session.props} />;
      setPortal(true);
    } else {
      closeTimeoutRef.current = setTimeout(() => setPortal(false), 200);
    }
  }, [ContentComponent, session]);

  return portal && root
    ? createPortal(
        <div className={c(s.backdrop, session === null && s.backdropClosing)} onClick={handleBackdropClick}>
          <div className={c(s.container, session === null && s.containerClosing)}>{contentRef.current}</div>
        </div>,
        root
      )
    : null;
}
