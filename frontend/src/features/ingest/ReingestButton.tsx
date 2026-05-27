import { Button } from "../../ui/Button/Button";
import { Spinner } from "../../ui/Spinner/Spinner";
import { useStartIngest } from "../../hooks/queries/useStartIngest";

interface Props {
  label?: string;
  variant?: "primary" | "secondary";
}

export function ReingestButton({ label = "Re-ingest", variant = "secondary" }: Props) {
  const mutation = useStartIngest();
  const pending = mutation.isPending;

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={pending}
      leadingIcon={pending ? <Spinner size={12} /> : null}
    >
      {pending ? "Starting…" : label}
    </Button>
  );
}
