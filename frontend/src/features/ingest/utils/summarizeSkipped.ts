import type { IngestStepResult, IngestSummary } from "@dave/shared";

export function totalSkipped(summary: IngestSummary): number {
  return Object.values(summary).reduce((acc, step) => acc + (step?.skipped?.length ?? 0), 0);
}

export function describeStep(step: IngestStepResult): string {
  return `parsed ${step.parsed} · inserted ${step.inserted} · updated ${step.updated} · skipped ${step.skipped.length}`;
}
