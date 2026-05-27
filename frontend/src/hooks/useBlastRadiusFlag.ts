import { useCallback } from "react";
import { useTypedSearchParams } from "./useTypedSearchParams";

export function useBlastRadiusFlag() {
  const { params, update } = useTypedSearchParams();
  const enabled = params.get("blast") === "1";

  const set = useCallback(
    (next: boolean) => {
      update((p) => {
        if (next) p.set("blast", "1");
        else p.delete("blast");
        return p;
      });
    },
    [update],
  );

  const toggle = useCallback(() => set(!enabled), [enabled, set]);

  return { enabled, set, toggle };
}
