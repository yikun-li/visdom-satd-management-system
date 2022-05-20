import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {UrlObject} from "url";
import {usePage} from "./usePage";

export interface NavbarObject<T> {
  active: T;
  backUrl?: string;

  getUrl(page: T): {href: UrlObject; as: UrlObject};
}

export function useNavbar<T>(def: T, backUrl?: string): NavbarObject<T> {
  const router = useRouter();
  const {
    query: {search},
    to
  } = usePage();
  const [active, setActive] = useState<T | null>((router.query.tab as unknown as T) || null);

  const getUrl = useCallback<NavbarObject<T>["getUrl"]>(
    (page: T) => {
      const [href, as] = to({...search, tab: String(page)});
      return {href, as};
    },
    [search, to]
  );

  useEffect(() => {
    setActive(router.query.tab as unknown as T);
  }, [router.query.tab]);

  return {
    active: active || def,
    backUrl,
    getUrl
  };
}
