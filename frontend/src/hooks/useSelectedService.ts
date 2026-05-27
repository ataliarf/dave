import { useCallback } from "react";
import { useTypedSearchParams } from "./useTypedSearchParams";

export function useSelectedService() {
  const { params, update } = useTypedSearchParams();
  const id = params.get("service") ?? null;

  const select = useCallback(
    (next: string | null) => {
      update((p) => {
        if (next == null) {
          p.delete("service");
          p.delete("blast");
        } else {
          p.set("service", next);
        }
        return p;
      });
    },
    [update],
  );

  return { id, select };
}
