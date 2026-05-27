import type { BlastRadiusResponse } from "@dave/shared";
import type { BlastClassification } from "../types";

export interface BlastClassifier {
  enabled: boolean;
  classifyNode: (id: string) => BlastClassification;
  classifyEdge: (from: string, to: string) => BlastClassification;
}

export function buildBlastClassifier(
  data: BlastRadiusResponse | undefined,
  originId: string | null,
  enabled: boolean,
): BlastClassifier {
  if (!enabled || !data || !originId) {
    return {
      enabled: false,
      classifyNode: () => "none",
      classifyEdge: () => "none",
    };
  }

  const upstream = new Set(data.upstream.map((n) => n.id));
  const downstream = new Set(data.downstream.map((n) => n.id));

  const classifyNode = (id: string): BlastClassification => {
    if (id === originId) return "origin";
    if (upstream.has(id)) return "upstream";
    if (downstream.has(id)) return "downstream";
    return "faded";
  };

  /**
   * Edge sits on the upstream path if both endpoints are on the upstream side
   * (or one is the origin and the other upstream); same for downstream.
   * Anything else fades.
   */
  const classifyEdge = (from: string, to: string): BlastClassification => {
    const f = classifyNode(from);
    const t = classifyNode(to);
    if (f === "faded" || t === "faded") return "faded";

    // Upstream subgraph: callers ➜ origin, edges flow toward origin
    if ((f === "upstream" || f === "origin") && (t === "upstream" || t === "origin")) {
      return "upstream";
    }
    // Downstream subgraph: origin ➜ callees
    if ((f === "downstream" || f === "origin") && (t === "downstream" || t === "origin")) {
      return "downstream";
    }
    return "faded";
  };

  return { enabled: true, classifyNode, classifyEdge };
}
