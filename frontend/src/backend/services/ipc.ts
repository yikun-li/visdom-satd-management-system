import {EventEmitter} from "events";

export enum IpcMessage {
  UPDATE_JOB = "UPDATE_JOB"
}

export class IpcService extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(200000);
  }

  public on(type: IpcMessage, listener: (...args: any[]) => void): this {
    return super.on(type, listener);
  }

  public emit(type: IpcMessage, ...args: any[]): boolean {
    return super.emit(type, ...args);
  }
}
