import type { ReactNode } from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel: string;
}
