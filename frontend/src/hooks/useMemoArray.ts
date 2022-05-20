import {useMemo} from "react";
import {usePrevious} from "./usePrevious";

export function useMemoArray<T extends Readonly<any[]>>(array: T): T {
  const prev = usePrevious(array) || array;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedArray = useMemo(() => array, [...array]);
  return memoizedArray.length === 0 && array.length !== 0 ? prev : memoizedArray;
}
