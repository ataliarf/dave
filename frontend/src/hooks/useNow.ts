import { useEffect, useState } from "react";
import { RELATIVE_TIME_REFRESH_MS } from "../lib/consts";

/** Returns a Date that refreshes on a wall-clock interval, used to keep
 * relative-time strings ("3 minutes ago") current without manual triggers. */
export function useNow(intervalMs: number = RELATIVE_TIME_REFRESH_MS) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
