import {useEffect, useRef} from "react";

export function useThrottleEffect(callback: () => void, throttle: number, dependencies: any[]): void {
  const callTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (callTimeout.current) {
      clearTimeout(callTimeout.current);
    }
    callTimeout.current = setTimeout(() => callback(), throttle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
