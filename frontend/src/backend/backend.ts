import {ServiceManager} from "./servicemanager";
import {IpcService} from "./services/ipc";
import {JobService} from "./services/job";
import {RequestService} from "./services/request";

const services = [RequestService, JobService, IpcService];

export class WebBackend {
  private _services: ServiceManager = new ServiceManager(this, services);
  private _ssr = !process.browser;

  async initialize(): Promise<void> {
    await this.services.initializeServices();
  }

  get services(): ServiceManager {
    return this._services;
  }

  get ssr(): boolean {
    return this._ssr;
  }
}
