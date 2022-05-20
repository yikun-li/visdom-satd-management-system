import {useRouter} from "next/router";
import {useCallback, useMemo} from "react";
import {UrlObject} from "url";

interface UsePage {
  query: {
    path: Record<string, any>;
    search: Record<string, any>;
  };
  path: string;
  search: string;

  to(query: Record<string, any>, path?: string): [UrlObject, UrlObject];
}

function splitQuery(path: string, query: Record<string, any>): UsePage["query"] {
  return Object.entries(query)
    .map(([key, value]) => [key, value, path.includes(`[${key}]`)])
    .reduce(
      (prev, [key, value, inPath]) => ({
        ...prev,
        [inPath ? "path" : "search"]: {...prev[inPath ? "path" : "search"], [key]: value}
      }),
      {path: {}, search: {}}
    );
}

function getPath(path: string, pathQuery: Record<string, any>): string {
  return Object.entries(pathQuery).reduce((prev, [key, value]) => prev.replace(`[${key}]`, value), path);
}

export function usePage(): UsePage {
  const router = useRouter();
  const query = useMemo(() => splitQuery(router.pathname, router.query), [router.pathname, router.query]);
  const path = useMemo(() => getPath(router.pathname, query.path), [query.path, router.pathname]);
  const search = useMemo(() => new URLSearchParams(query.search).toString(), [query.search]);

  const to = useCallback<UsePage["to"]>(
    (newQuery, path) => {
      const pathname = path || router.pathname;
      const query = {...router.query, ...newQuery};
      return [
        {pathname, query},
        {pathname: getPath(pathname, query), query: splitQuery(pathname, query).search}
      ];
    },
    [router.pathname, router.query]
  );

  return {
    query,
    path,
    search,
    to
  };
}
