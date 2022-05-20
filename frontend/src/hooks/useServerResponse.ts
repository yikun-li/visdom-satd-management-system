import {useEffect, useMemo} from "react";
import * as requests from "../backend/remote/requests";
import {RestRequestBuilder} from "../backend/remote/util/types";
import {RestServerResponse} from "../types/response";
import {useLazyRequestResource} from "./useLazyRequestResource";
import {ReloadableResource, ResourceState} from "./useRequestResource";
import {useUpdatableVars} from "./useUpdatableVars";

function getRequestBuilder(name: string): RestRequestBuilder<any, any, any> {
  const req = Object.entries(requests).find(([key]) => name === key);
  if (req) return req[1];
  throw new Error("Invalid request name");
}

export function useServerResponse<Body>(serverResponse: RestServerResponse<Body>): ReloadableResource<any[], Body> {
  const builder = useMemo(() => getRequestBuilder(serverResponse.request.builder), [serverResponse]);
  const [clientResponse, call] = useLazyRequestResource(builder, {loading: true} as const);
  const [vars, setVars] = useUpdatableVars<any[]>(serverResponse.request.vars);

  useEffect(() => {
    call(...vars).catch(() => void 0);
  }, [call, vars]);

  const state: ResourceState<Body> = serverResponse.loading
    ? clientResponse
    : serverResponse.success
    ? {loading: false, success: true, body: serverResponse.payload}
    : {loading: false, success: false, error: new Error(serverResponse.message)};

  return {...state, setVars, reload: () => call(...vars)};
}
