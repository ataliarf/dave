/** djb2-style string hash. Deterministic, returns a non-negative 32-bit int. */
export function hashString(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}
