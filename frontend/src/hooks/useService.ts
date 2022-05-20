import {useContext} from "react";
import {WebBackendContext} from "../backend/provider";
import {ServiceClass} from "../backend/servicemanager";

export function useService<A extends ServiceClass>(serviceClass: A): InstanceType<A> {
  const {services} = useContext(WebBackendContext);
  return services.get(serviceClass);
}
