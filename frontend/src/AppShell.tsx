import { Outlet } from "react-router-dom";
import { IngestBanner } from "./features/ingest/IngestBanner";
import { TabNav } from "./features/nav/TabNav";
import { useIngestInvalidator } from "./hooks/queries/useIngestInvalidator";
import styles from "./AppShell.module.scss";

export function AppShell() {
  useIngestInvalidator();
  return (
    <div className={styles.shell}>
      <IngestBanner />
      <TabNav />
      <main className={styles.body}>
        <Outlet />
      </main>
    </div>
  );
}
