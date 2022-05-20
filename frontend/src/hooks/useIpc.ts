import {EventEmitter} from "events";
import {useEffect, useRef} from "react";
import {IpcMessage, IpcService} from "../backend/services/ipc";
import {useService} from "./useService";

export function useIpc(message: IpcMessage, callback: (...args: any[]) => void, notMainIpc?: EventEmitter): void {
  const ipcService = useService(IpcService);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = (...args: any[]) => callbackRef.current(...args);
    const ipc = notMainIpc || ipcService || new EventEmitter();

    ipc.on(message, handleEvent);

    return () => {
      ipc.removeListener(message, handleEvent);
    };
  }, [ipcService, message, notMainIpc]);
}
