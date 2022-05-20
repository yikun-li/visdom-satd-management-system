import {WebBackend} from "../backend";
import {RequestManager} from "../remote/manager";

export class RequestService extends RequestManager {
  constructor(private backend: WebBackend) {
    super(backend.ssr ? `${process.env.BACKEND_HOST}/rest` : "/rest");
  }
}
