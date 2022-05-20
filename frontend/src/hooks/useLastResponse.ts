import {useEffect, useRef} from "react";
import {ResourceState} from "./useRequestResource";

export function useLastResponse<Body>(response: ResourceState<Body>): [boolean, ResourceState<Body>] {
  const lastRes = useRef(response);

  useEffect(() => {
    if (!response.loading) {
      lastRes.current = response;
    }
  }, [response]);

  return [response.loading, response.loading ? lastRes.current : response];
}
