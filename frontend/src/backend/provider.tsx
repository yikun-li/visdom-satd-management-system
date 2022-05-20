import {Context, createContext, FC, useEffect, useMemo, useState} from "react";
import {WebBackend} from "./backend";

export const WebBackendContext: Context<WebBackend> = createContext({} as WebBackend);

export enum WebBackendState {
  NOT_INITIALIZED,
  READY,
  ERRORED
}

export const WebBackendProvider: FC = ({children}) => {
  const backend = useMemo(() => new WebBackend(), []);
  const [state, setState] = useState<WebBackendState>(WebBackendState.NOT_INITIALIZED);

  useEffect(() => {
    backend
      .initialize()
      .then(() => setState(WebBackendState.READY))
      .catch((err) => {
        console.error("Failed initializing backend", err);
        setState(WebBackendState.ERRORED);
      });
  }, [backend]);

  useEffect(() => {
    // backend.state = state;
  }, [backend, state]);

  return <WebBackendContext.Provider value={backend}>{children}</WebBackendContext.Provider>;
};
