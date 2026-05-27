import { useQuery } from "@tanstack/react-query";
import type { BlastRadiusResponse } from "@dave/shared";
import { getBlastRadius } from "../../api/services";
import { ApiError } from "../../api/errors";
import { qk } from "./queryKeys";

export function useBlastRadius(id: string | null, enabled: boolean) {
  return useQuery<BlastRadiusResponse, ApiError>({
    queryKey: id ? qk.blast(id) : ["blast", "__none__"],
    queryFn: () => getBlastRadius(id as string),
    enabled: enabled && id != null,
  });
}
