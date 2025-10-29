import { useEffect, useRef, useCallback } from "react";

export function useDebounce(
  callback: (...args: unknown[]) => Promise<void> | void,
  delay: number
) {
  const timeoutRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    (...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
