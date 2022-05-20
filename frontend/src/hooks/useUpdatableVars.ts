import {useEffect, useState} from "react";
import {useMemoArray} from "./useMemoArray";

export function useUpdatableVars<Vars extends any[]>(vars: Readonly<Vars>): [Vars, (vars: Vars) => void] {
  const memoized = useMemoArray(vars);
  const [stateVars, setStateVars] = useState<null | Vars>(null);

  useEffect(() => {
    setStateVars(null);
  }, [memoized]);

  return [stateVars || memoized, setStateVars];
}
