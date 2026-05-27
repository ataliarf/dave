export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const diffMs = now.getTime() - d.getTime();
  const past = diffMs >= 0;
  const ms = Math.abs(diffMs);

  const sec = Math.round(ms / 1000);
  if (sec < 45) return past ? "just now" : "in a moment";

  const min = Math.round(sec / 60);
  if (min < 60)
    return past ? `${min} ${plural(min, "minute")} ago` : `in ${min} ${plural(min, "minute")}`;

  const hr = Math.round(min / 60);
  if (hr < 24) return past ? `${hr} ${plural(hr, "hour")} ago` : `in ${hr} ${plural(hr, "hour")}`;

  const day = Math.round(hr / 24);
  if (day < 30)
    return past ? `${day} ${plural(day, "day")} ago` : `in ${day} ${plural(day, "day")}`;

  const month = Math.round(day / 30);
  if (month < 12)
    return past
      ? `${month} ${plural(month, "month")} ago`
      : `in ${month} ${plural(month, "month")}`;

  const year = Math.round(month / 12);
  return past ? `${year} ${plural(year, "year")} ago` : `in ${year} ${plural(year, "year")}`;
}

export function formatAbsoluteTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(ms: number): string {
  if (ms < 0) ms = 0;
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;

  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  if (hr < 24) return remMin === 0 ? `${hr}h` : `${hr}h ${remMin}m`;

  const day = Math.floor(hr / 24);
  const remHr = hr % 24;
  return remHr === 0 ? `${day}d` : `${day}d ${remHr}h`;
}

function plural(n: number, word: string): string {
  return n === 1 ? word : `${word}s`;
}
