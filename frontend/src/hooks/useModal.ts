import {useCallback, useState} from "react";

export type CloseModalFn<CloseArgs extends unknown[] = []> = (...closeArgs: CloseArgs) => void;
export type OpenModalFn<Props, CloseArgs extends unknown[] = []> = (props: Props) => Promise<CloseArgs>;
export type ModalSession<Props, CloseArgs extends unknown[] = []> = {
  close: CloseModalFn<CloseArgs>;
  props: Props;
} | null;

export function useModal<Props = Record<never, never>, CloseArgs extends unknown[] = []>(): [
  ModalSession<Props, CloseArgs>,
  OpenModalFn<Props, CloseArgs>
] {
  const [session, setSession] = useState<ModalSession<Props, CloseArgs>>(null);

  const open = useCallback<OpenModalFn<Props, CloseArgs>>((props) => {
    return new Promise<CloseArgs>((resolve) => {
      const close: CloseModalFn<CloseArgs> = (...closeArgs) => {
        setSession(null);
        resolve(closeArgs);
      };

      setSession({close, props});
    });
  }, []);

  return [session, open];
}
