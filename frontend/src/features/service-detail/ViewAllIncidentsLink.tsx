import { Link } from "react-router-dom";
import styles from "./ServiceDetailDrawer.module.scss";

interface Props {
  serviceId: string;
}

export function ViewAllIncidentsLink({ serviceId }: Props) {
  return (
    <Link className={styles.viewAll} to={`/incidents?serviceId=${encodeURIComponent(serviceId)}`}>
      View all incidents for this service →
    </Link>
  );
}
