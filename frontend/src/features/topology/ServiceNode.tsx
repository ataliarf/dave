import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Badge } from "../../ui/Badge/Badge";
import { Spinner } from "../../ui/Spinner/Spinner";
import { cx } from "../../utils/classNames";
import type { RFNodeData } from "./types";
import styles from "./ServiceNode.module.scss";

export function ServiceNode({ data }: NodeProps & { data: RFNodeData }) {
  const { service, matchesFilter, selected, blast, teamBucket, canExpand, isExpanding, onExpand } =
    data;

  const blastClass =
    blast === "origin"
      ? styles.blastOrigin
      : blast === "upstream"
        ? styles.blastUpstream
        : blast === "downstream"
          ? styles.blastDownstream
          : blast === "faded"
            ? styles.blastFaded
            : null;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanding && onExpand) onExpand(service.id);
  };

  return (
    <div
      className={cx(
        styles.node,
        styles[`tier_${service.tier}`],
        !matchesFilter && styles.boundary,
        selected && styles.selected,
        blastClass,
      )}
      style={{ ["--team-stripe" as string]: `var(--team-${teamBucket})` }}
    >
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <div className={styles.stripe} />
      <div className={styles.body}>
        <div className={styles.name} title={service.name}>
          {service.name}
        </div>
        <div className={styles.meta}>
          <Badge tone="team" bucket={teamBucket}>
            {service.team}
          </Badge>
          <Badge tone="tier" value={service.tier}>
            {service.tier}
          </Badge>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className={styles.handle} />
      {(canExpand || isExpanding) && onExpand ? (
        <button
          type="button"
          className={styles.expandBtn}
          onClick={handleExpandClick}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label={isExpanding ? "Loading neighbors" : `Expand neighbors of ${service.name}`}
          title={isExpanding ? "Loading neighbors…" : "Expand neighbors"}
          disabled={isExpanding}
        >
          {isExpanding ? (
            <Spinner size={10} />
          ) : (
            <svg
              className={styles.expandIcon}
              viewBox="0 0 10 10"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="4.25" y="0" width="1.5" height="10" rx="0.75" />
              <rect x="0" y="4.25" width="10" height="1.5" rx="0.75" />
            </svg>
          )}
        </button>
      ) : null}
    </div>
  );
}
