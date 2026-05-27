import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { StartIngestResponse } from "@dave/shared";
import { startIngest } from "../../api/ingest";
import { ApiError } from "../../api/errors";
import { qk } from "./queryKeys";

export function useStartIngest() {
  const qc = useQueryClient();

  return useMutation<StartIngestResponse, ApiError>({
    mutationFn: startIngest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.ingestStatus() });
    },
    onError: (err) => {
      if (err.status === 409) {
        toast("An ingest is already running — tracking it now.", { icon: "ℹ️" });
        qc.invalidateQueries({ queryKey: qk.ingestStatus() });
        return;
      }
      toast.error(`Failed to start ingest: ${err.message}`);
    },
  });
}
