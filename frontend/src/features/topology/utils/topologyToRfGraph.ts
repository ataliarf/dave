import type { Edge, Node } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type { TopologyResponse } from "@dave/shared";
import type { BlastClassifier } from "../../blast-radius/utils/blastHighlight";
import type { RFEdgeData, RFNodeData } from "../types";
import { edgeStyle } from "./edgeStyle";
import { hashTeamColor } from "./hashTeamColor";

interface Args {
  topology: TopologyResponse;
  selectedId: string | null;
  blast: BlastClassifier;
  isExpanding?: (id: string) => boolean;
  onExpand?: (id: string) => void;
}

export interface RfGraph {
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
}

const BLAST_STROKE: Record<string, string> = {
  origin: "var(--blast-origin)",
  upstream: "var(--blast-upstream)",
  downstream: "var(--blast-downstream)",
};

export function topologyToRfGraph({
  topology,
  selectedId,
  blast,
  isExpanding,
  onExpand,
}: Args): RfGraph {
  const visibleNeighbors = new Map<string, Set<string>>();
  const touch = (a: string, b: string) => {
    let set = visibleNeighbors.get(a);
    if (!set) {
      set = new Set();
      visibleNeighbors.set(a, set);
    }
    set.add(b);
  };
  for (const e of topology.edges) {
    if (e.from === e.to) continue;
    touch(e.from, e.to);
    touch(e.to, e.from);
  }

  const nodes: Node<RFNodeData>[] = topology.nodes.map((n) => {
    const visibleCount = visibleNeighbors.get(n.id)?.size ?? 0;
    const hasUnseenNeighbors = n.degree > visibleCount;
    return {
      id: n.id,
      type: "service",
      position: { x: 0, y: 0 },
      data: {
        service: n,
        matchesFilter: n.matchesFilter,
        selected: n.id === selectedId,
        blast: blast.enabled ? blast.classifyNode(n.id) : "none",
        teamBucket: hashTeamColor(n.team),
        canExpand: onExpand != null && hasUnseenNeighbors,
        isExpanding: isExpanding?.(n.id) ?? false,
        onExpand,
      },
    };
  });

  const edges: Edge<RFEdgeData>[] = topology.edges.map((e) => {
    const klass = blast.enabled ? blast.classifyEdge(e.from, e.to) : "none";
    const { strokeWidth, strokeDasharray } = edgeStyle(e.type, e.criticality);
    const stroke =
      klass === "faded" ? "var(--surface-3)" : (BLAST_STROKE[klass] ?? "var(--text-muted)");
    const opacity = klass === "faded" ? 0.35 : 1;

    return {
      id: `${e.from}->${e.to}`,
      source: e.from,
      target: e.to,
      data: { type: e.type, criticality: e.criticality, blast: klass },
      style: { stroke, strokeWidth, strokeDasharray, opacity },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: stroke,
        width: 14,
        height: 14,
      },
    };
  });

  return { nodes, edges };
}
