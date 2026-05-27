import { useQuery } from "@tanstack/react-query";
import type { ServiceDetailsResponse } from "@dave/shared";
import { getServiceDetails } from "../../api/services";
import { ApiError } from "../../api/errors";
import { qk } from "./queryKeys";

export function useServiceDetails(id: string | null) {
  return useQuery<ServiceDetailsResponse, ApiError>({
    queryKey: id ? qk.service(id) : ["service", "__none__"],
    queryFn: () => getServiceDetails(id as string),
    enabled: id != null,
  });
}
