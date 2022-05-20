import {WebBackend} from "./backend";

// eslint-disable-next-line @typescript-eslint/ban-types
export type ServiceInstance = Object;
export type ServiceClass = new (backend: WebBackend) => ServiceInstance;

export interface InitializableService {
  initialize(): Promise<void>;
  order?: number;
}

export class ServiceManager {
  private services: Map<ServiceClass, ServiceInstance> = new Map<ServiceClass, ServiceInstance>();

  constructor(private backend: WebBackend, private classes: ServiceClass[]) {
    classes.forEach((cls) => {
      this.services.set(cls, new cls(backend));
    });
  }

  public get<T extends ServiceClass>(cls: T): InstanceType<T> {
    const service = this.services.get(cls);
    if (!service) throw new Error();
    return service as InstanceType<T>;
  }

  public async initializeServices(): Promise<void> {
    const inits = [...this.services.values()]
      .filter((instance) => typeof (instance as InitializableService).initialize === "function")
      .sort((a, b) => ((a as InitializableService).order || 10) - ((b as InitializableService).order || 10))
      .map((instance) => (instance as InitializableService).initialize.bind(instance));

    for (const init of inits) {
      await init();
    }
  }
}
