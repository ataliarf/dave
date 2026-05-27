export function emptyAcceptedError(parsed: number, skippedCount: number): string {
  return `all ${parsed} row${parsed === 1 ? "" : "s"} rejected (${skippedCount} validation failure${skippedCount === 1 ? "" : "s"})`;
}
