import {useEffect, useState} from "react";
import {RestRequestBuilder} from "../backend/remote/util/types";
import {useCallRequest} from "./useCallRequest";
import {useIsMounted} from "./useIsMounted";
import {useUpdatableVars} from "./useUpdatableVars";

export type ResourceState<Body> =
  | {loading: true}
  | {loading: false; success: true; body: Body}
  | {loading: false; success: false; error: Error};

export type ReloadableResource<Vars extends any[], Body> = ResourceState<Body> & {
  reload: () => Promise<void>;
  setVars: (vars: Vars) => void;
};

export function useRequestResource<Vars extends any[], Body>(
  builder: RestRequestBuilder<Vars, any, Body> | null,
  vars: Vars
): ReloadableResource<Vars, Body> {
  const [storedVars, setVars] = useUpdatableVars<Vars>(vars);
  const [state, setState] = useState<ResourceState<Body>>({loading: true});
  const mounted = useIsMounted();
  const call = useCallRequest(builder, setState, mounted);

  useEffect(() => {
    call(...storedVars).catch(() => void 0);
  }, [storedVars, call]);

  return {...state, setVars, reload: async () => void (await call(...storedVars))};
}
