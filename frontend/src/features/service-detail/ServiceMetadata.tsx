import type { Service } from "@dave/shared";
import { isUrl } from "../../utils/isUrl";
import styles from "./ServiceDetailDrawer.module.scss";

interface Props {
  service: Service;
}

export function ServiceMetadata({ service }: Props) {
  return (
    <dl className={styles.meta}>
      <div className={styles.metaRow}>
        <dt>Language</dt>
        <dd>{service.language}</dd>
      </div>
      <div className={styles.metaRow}>
        <dt>Repo</dt>
        <dd className={styles.repoCell}>
          {isUrl(service.repo) ? (
            <a href={service.repo} target="_blank" rel="noreferrer noopener">
              {service.repo}
            </a>
          ) : (
            <span className={styles.repoText}>{service.repo}</span>
          )}
        </dd>
      </div>
      <div className={styles.metaRow}>
        <dt>ID</dt>
        <dd className={styles.idCell}>{service.id}</dd>
      </div>
    </dl>
  );
}
