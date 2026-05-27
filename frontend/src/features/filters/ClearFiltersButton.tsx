import { Button } from "../../ui/Button/Button";

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export function ClearFiltersButton({ onClick, disabled }: Props) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} disabled={disabled}>
      Clear filters
    </Button>
  );
}
