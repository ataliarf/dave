import type { DirectNeighbor } from "@dave/shared";

export interface NeighborListProps {
  title: string;
  emptyLabel: string;
  neighbors: DirectNeighbor[];
  onSelect: (id: string) => void;
}
