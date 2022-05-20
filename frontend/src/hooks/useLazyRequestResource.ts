import {useState} from "react";
import {RestRequestBuilder} from "../backend/remote/util/types";
import {useCallRequest} from "./useCallRequest";
import {useIsMounted} from "./useIsMounted";
import {ResourceState} from "./useRequestResource";

export type UseLazyRequestResource<Body, Vars extends any[], Init> = [
  ResourceState<Body> | Init,
  (...vars: Vars) => Promise<Body | Error | undefined>
];

export function useLazyRequestResource<Vars extends any[], Body, Init = {loading: null}>(
  builder: RestRequestBuilder<Vars, any, Body>,
  initialState: Init
): UseLazyRequestResource<Body, Vars, Init> {
  const [state, setState] = useState<ResourceState<Body> | Init>(initialState);
  const mounted = useIsMounted();
  const call = useCallRequest(builder, setState, mounted);
  return [state, call];
}
