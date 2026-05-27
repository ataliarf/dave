import { useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import type { TopologyResponse } from "@dave/shared";
import { ServiceNode } from "./ServiceNode";
import { layoutDagre } from "./utils/layoutDagre";
import { topologyToRfGraph } from "./utils/topologyToRfGraph";
import type { BlastClassifier } from "../blast-radius/utils/blastHighlight";
import { Legend } from "./Legend";
import styles from "./TopologyCanvas.module.scss";

const NODE_TYPES = { service: ServiceNode };

interface Props {
  topology: TopologyResponse;
  selectedId: string | null;
  blast: BlastClassifier;
  onSelect: (id: string | null) => void;
  onExpand?: (id: string) => void;
  isExpanding?: (id: string) => boolean;
}

export function TopologyCanvas({
  topology,
  selectedId,
  blast,
  onSelect,
  onExpand,
  isExpanding,
}: Props) {
  const { nodes, edges } = useMemo(() => {
    const graph = topologyToRfGraph({
      topology,
      selectedId,
      blast,
      isExpanding,
      onExpand,
    });
    const positions = layoutDagre(graph.nodes, graph.edges);
    return {
      nodes: graph.nodes.map((n) => ({
        ...n,
        position: positions.get(n.id) ?? { x: 0, y: 0 },
      })),
      edges: graph.edges,
    };
  }, [topology, selectedId, blast, isExpanding, onExpand]);

  const onNodeClick: NodeMouseHandler = (_e, node) => {
    onSelect(node.id);
  };

  return (
    <div className={styles.canvas}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        fitView
        fitViewOptions={{ padding: 0.18 }}
        onNodeClick={onNodeClick}
        onPaneClick={() => onSelect(null)}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
      <div className={styles.legendWrap}>
        <Legend />
      </div>
    </div>
  );
}
