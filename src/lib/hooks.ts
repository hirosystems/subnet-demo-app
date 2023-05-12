import { useCallback, useEffect } from "react";
import { useInterval, useLatest } from "react-use";

export function useImmediateInterval(
  callback: Function,
  delay?: number | null | undefined,
) {
  const cb = useLatest(callback);

  useEffect(() => {
    cb.current();
  }, []);

  return useInterval(() => cb.current(), delay);
}
useLatest;
