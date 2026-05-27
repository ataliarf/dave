import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { TopologyResponse } from "@dave/shared";
import { getTopology, type TopologyParams } from "../../api/topology";
import { ApiError } from "../../api/errors";
import { qk } from "./queryKeys";

export function useTopology(params: TopologyParams) {
  return useQuery<TopologyResponse, ApiError>({
    queryKey: qk.topology(params),
    queryFn: () => getTopology(params),
    placeholderData: keepPreviousData,
  });
}
