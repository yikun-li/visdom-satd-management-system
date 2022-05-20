import {MutableRefObject, useCallback} from "react";
import {RestRequestBuilder} from "../backend/remote/util/types";
import {RequestService} from "../backend/services/request";
import {ResourceState} from "./useRequestResource";
import {useService} from "./useService";

export type CallRequest<Vars extends any[], Body> = (...vars: Vars) => Promise<Body | Error | undefined>;

export function useCallRequest<Vars extends any[], Body>(
  builder: RestRequestBuilder<Vars, any, Body> | null,
  callback: (state: ResourceState<Body>) => void,
  shouldSet: MutableRefObject<boolean>
): CallRequest<Vars, Body> {
  const requester = useService(RequestService);

  return useCallback<CallRequest<Vars, Body>>(
    async (...vars: Vars) => {
      if (!builder) return;

      shouldSet.current && callback({loading: true});
      try {
        const response = await requester.executeAndThrow(await builder(...vars));
        shouldSet.current && callback({loading: false, success: true, body: response.body});
        return response.body;
      } catch (error) {
        shouldSet.current && callback({loading: false, success: false, error});
        throw error;
      }
    },
    [builder, callback, requester, shouldSet]
  );
}
