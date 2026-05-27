import dagre from "dagre";
import type { Edge, Node } from "@xyflow/react";
import { NODE_HEIGHT, NODE_SEP, NODE_WIDTH, RANK_SEP } from "../consts";

export type Positions = Map<string, { x: number; y: number }>;

export function layoutDagre(nodes: Node[], edges: Edge[]): Positions {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", ranksep: RANK_SEP, nodesep: NODE_SEP });

  for (const n of nodes) {
    g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const e of edges) {
    g.setEdge(e.source, e.target);
  }

  dagre.layout(g);

  const positions: Positions = new Map();
  for (const n of nodes) {
    const node = g.node(n.id);
    if (!node) continue;
    // dagre returns center; React Flow expects top-left
    positions.set(n.id, {
      x: node.x - NODE_WIDTH / 2,
      y: node.y - NODE_HEIGHT / 2,
    });
  }
  return positions;
}
