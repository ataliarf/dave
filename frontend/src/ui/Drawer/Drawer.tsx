import { useEffect } from "react";
import styles from "./Drawer.module.scss";
import type { DrawerProps } from "./types";

export function Drawer({ open, onClose, ariaLabel, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <aside className={styles.panel} role="complementary" aria-label={ariaLabel}>
      {children}
    </aside>
  );
}
