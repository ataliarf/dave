import { TabLink } from "./TabLink";
import styles from "./TabNav.module.scss";

export function TabNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <TabLink to="/" label="Topology" />
      <TabLink to="/incidents" label="Incidents" />
      <TabLink to="/analytics" label="Analytics" disabled badge="Coming soon" />
    </nav>
  );
}
