import { API_BASE } from "../lib/consts";
import { ApiError } from "./errors";

interface ErrorEnvelope {
  error: { code: string; message: string; details?: unknown };
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const envelope = body as ErrorEnvelope | null;
    const code = envelope?.error?.code ?? `HTTP_${res.status}`;
    const message = envelope?.error?.message ?? res.statusText;
    throw new ApiError(res.status, code, message, envelope?.error?.details);
  }

  return body as T;
}
