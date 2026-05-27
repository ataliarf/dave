import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type SearchParamUpdater = (current: URLSearchParams) => URLSearchParams;

export function useTypedSearchParams() {
  const [params, setParams] = useSearchParams();

  const update = useCallback(
    (updater: SearchParamUpdater) => {
      setParams((prev) => updater(new URLSearchParams(prev)), { replace: false });
    },
    [setParams],
  );

  return { params, update };
}

export function readListParam(params: URLSearchParams, key: string): string[] {
  const v = params.get(key);
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function writeListParam(
  params: URLSearchParams,
  key: string,
  values: string[],
): URLSearchParams {
  if (values.length === 0) params.delete(key);
  else params.set(key, values.join(","));
  return params;
}
