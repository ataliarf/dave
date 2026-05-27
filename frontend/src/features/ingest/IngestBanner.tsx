import type { IngestRun } from "@dave/shared";
import { useIngestStatus } from "../../hooks/queries/useIngestStatus";
import { IngestStatusFailed } from "./status/IngestStatusFailed";
import { IngestStatusIdle } from "./status/IngestStatusIdle";
import { IngestStatusPartial } from "./status/IngestStatusPartial";
import { IngestStatusRunning } from "./status/IngestStatusRunning";
import { IngestStatusSucceeded } from "./status/IngestStatusSucceeded";
import { Skeleton } from "../../ui/Skeleton/Skeleton";
import styles from "./IngestBanner.module.scss";

export function IngestBanner() {
  const { data, isLoading } = useIngestStatus();

  if (isLoading || !data) {
    return (
      <div className={styles.banner}>
        <Skeleton width={280} height={14} />
      </div>
    );
  }

  if (data.status === "idle") return <IngestStatusIdle />;

  switch (data.status) {
    case "running":
      return <IngestStatusRunning run={data as IngestRun & { status: "running" }} />;
    case "succeeded":
      return <IngestStatusSucceeded run={data as IngestRun & { status: "succeeded" }} />;
    case "partial":
      return <IngestStatusPartial run={data as IngestRun & { status: "partial" }} />;
    case "failed":
      return <IngestStatusFailed run={data as IngestRun & { status: "failed" }} />;
  }
}
