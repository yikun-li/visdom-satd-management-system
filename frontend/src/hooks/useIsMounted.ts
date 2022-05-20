import {MutableRefObject, useEffect, useRef} from "react";

export function useIsMounted(): MutableRefObject<boolean> {
  const ref = useRef(true);
  useEffect(() => {
    ref.current = true;

    return () => {
      ref.current = false;
    };
  }, []);
  return ref;
}
