import type { BlastRadiusResponse, ServiceDetailsResponse } from "@dave/shared";
import { apiFetch } from "./client";

export function getServiceDetails(id: string): Promise<ServiceDetailsResponse> {
  return apiFetch<ServiceDetailsResponse>(`/services/${encodeURIComponent(id)}`);
}

export function getBlastRadius(id: string): Promise<BlastRadiusResponse> {
  return apiFetch<BlastRadiusResponse>(`/services/${encodeURIComponent(id)}/blast-radius`);
}
