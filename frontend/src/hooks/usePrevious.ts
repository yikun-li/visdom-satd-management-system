import {useEffect, useRef} from "react";

export function usePrevious<T>(value: T): T | null {
  const prev = useRef<T | null>(null);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
}
