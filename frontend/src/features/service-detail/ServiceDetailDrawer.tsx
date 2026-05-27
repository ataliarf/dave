import toast from "react-hot-toast";
import { useEffect } from "react";
import { Drawer } from "../../ui/Drawer/Drawer";
import { Skeleton } from "../../ui/Skeleton/Skeleton";
import { Button } from "../../ui/Button/Button";
import { useServiceDetails } from "../../hooks/queries/useServiceDetails";
import { useSelectedService } from "../../hooks/useSelectedService";
import { BlastRadiusToggle } from "../blast-radius/BlastRadiusToggle";
import { NeighborList } from "./NeighborList";
import { RecentIncidents } from "./RecentIncidents";
import { ServiceDetailHeader } from "./ServiceDetailHeader";
import { ServiceMetadata } from "./ServiceMetadata";
import { ViewAllIncidentsLink } from "./ViewAllIncidentsLink";
import styles from "./ServiceDetailDrawer.module.scss";

export function ServiceDetailDrawer() {
  const { id, select } = useSelectedService();
  const open = id !== null;
  const { data, isLoading, isError, error } = useServiceDetails(id);

  const close = () => select(null);

  useEffect(() => {
    if (isError && error) {
      toast.error(`Could not load service: ${error.message}. Please try again.`, {
        id: "service-detail-error",
      });
      select(null);
    }
  }, [isError, error, select]);

  return (
    <Drawer open={open} onClose={close} ariaLabel="Service detail">
      <div className={styles.body}>
        {isLoading || !data ? (
          <DrawerSkeleton onClose={close} />
        ) : (
          <>
            <ServiceDetailHeader service={data.service} onClose={close} />
            <div className={styles.scroll}>
              <ServiceMetadata service={data.service} />
              <BlastRadiusToggle />
              <NeighborList
                title="Upstream callers"
                emptyLabel="Nothing calls this service."
                neighbors={data.directUpstream}
                onSelect={select}
              />
              <NeighborList
                title="Downstream callees"
                emptyLabel="This service calls nothing."
                neighbors={data.directDownstream}
                onSelect={select}
              />
              <RecentIncidents incidents={data.recentIncidents} />
              <ViewAllIncidentsLink serviceId={data.service.id} />
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}

function DrawerSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <Skeleton width="60%" height={20} />
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </header>
      <div className={styles.scroll}>
        <Skeleton width="100%" height={14} />
        <Skeleton width="80%" height={14} />
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
      </div>
    </>
  );
}
