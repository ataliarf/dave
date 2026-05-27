import type { DirectNeighbor } from "@dave/shared";
import { Badge } from "../../ui/Badge/Badge";
import { hashTeamColor } from "../topology/utils/hashTeamColor";
import styles from "./NeighborList.module.scss";

interface Props {
  neighbor: DirectNeighbor;
  onSelect: (id: string) => void;
}

export function NeighborRow({ neighbor, onSelect }: Props) {
  return (
    <li>
      <button type="button" className={styles.row} onClick={() => onSelect(neighbor.id)}>
        <div className={styles.main}>
          <span className={styles.name}>{neighbor.name}</span>
          <span className={styles.subtle}>
            {neighbor.type} · {neighbor.criticality}
          </span>
        </div>
        <Badge tone="team" bucket={hashTeamColor(neighbor.team)}>
          {neighbor.team}
        </Badge>
      </button>
    </li>
  );
}
