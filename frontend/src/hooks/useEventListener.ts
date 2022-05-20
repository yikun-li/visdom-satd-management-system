import {useEffect} from "react";

export function useEventListener<Target extends EventTarget, Params extends Parameters<Target["addEventListener"]>>(
  target: Target,
  event: Params[0],
  listener: Params[1]
): void {
  useEffect(() => {
    target.addEventListener(event, listener);
    return () => {
      target.removeEventListener(event, listener);
    };
  }, [target, event, listener]);
}
