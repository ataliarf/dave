import type { Service } from "@dave/shared";
import { Badge } from "../../ui/Badge/Badge";
import { Button } from "../../ui/Button/Button";
import { hashTeamColor } from "../topology/utils/hashTeamColor";
import styles from "./ServiceDetailDrawer.module.scss";

interface Props {
  service: Service;
  onClose: () => void;
}

export function ServiceDetailHeader({ service, onClose }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h2 className={styles.title} title={service.name}>
          {service.name}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close service detail">
          ✕
        </Button>
      </div>
      <div className={styles.badges}>
        <Badge tone="tier" value={service.tier}>
          {service.tier}
        </Badge>
        <Badge tone="team" bucket={hashTeamColor(service.team)}>
          {service.team}
        </Badge>
      </div>
    </header>
  );
}
