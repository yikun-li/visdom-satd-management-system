import {useRouter} from "next/router";
import {FC, useEffect} from "react";

export function getRedirectComponent(replacer: (prev: string) => string): FC {
  return () => {
    const router = useRouter();
    useEffect(() => {
      router.replace(replacer(location.pathname));
    }, [router]);
    return null;
  };
}
