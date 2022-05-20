import {useRouter} from "next/router";
import {useCallback, useMemo} from "react";

interface UseClientQuery<Q extends Record<string, string>> {
  query: Q;

  push(fn: (query: Q) => Q): void;

  replace(fn: (query: Q) => Q): void;
}

function createNewState(query: Record<string, string>): any {
  const newQuery = new URLSearchParams(query).toString();
  console.log(window.history.state.as, window.history.state.url);
  const as = new URL(window.history.state.as);
  const url = new URL(window.history.state.url);
  as.search = newQuery === "" ? "" : `?${newQuery}`;
  url.search = newQuery === "" ? "" : `?${newQuery}`;

  return {
    ...window.history.state,
    as,
    url
  };
}

export function useClientQuery<Q extends Record<string, string> = any>(): UseClientQuery<Q> {
  const {query, push: routerPush, replace: routerReplace, pathname, asPath} = useRouter();
  const q = useMemo<Q>(
    () => (process.browser ? Object.fromEntries(new URLSearchParams(window.location.hash).entries()) : query) as Q,
    [query]
  );

  const push = useCallback<UseClientQuery<Q>["push"]>(
    (fn) => {
      const state = createNewState(fn(q));
      window.history.pushState(state, document.title, state.as);
    },
    [q]
  );

  const replace = useCallback<UseClientQuery<Q>["replace"]>(
    (fn) => {
      const state = createNewState(fn(q));
      window.history.replaceState(state, document.title, state.as);
    },
    [q]
  );

  return {query: q, push, replace};
}
