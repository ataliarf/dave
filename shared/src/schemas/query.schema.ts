import { z } from "zod";
import { INCIDENT_STATUSES, SEVERITIES } from "../domain/incident.js";
import { TIERS } from "../domain/service.js";

/**
 * Schema for a comma-separated list query param (e.g. `?teams=a,b,c`).
 * Empty / missing input becomes undefined (not []) so downstream code can
 * distinguish "filter not set" from "filter set to empty list".
 */
const listOf = <T extends z.ZodTypeAny>(item: T) =>
  z
    .string()
    .optional()
    .transform((v) =>
      v && v.length > 0
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    )
    .pipe(z.array(item).nonempty().optional());

export const TOPOLOGY_NODE_LIMIT_DEFAULT = 500;
export const TOPOLOGY_NODE_LIMIT_MAX = 2000;

export const topologyQuerySchema = z.object({
  teams: listOf(z.string().min(1)),
  tiers: listOf(z.enum(TIERS)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : TOPOLOGY_NODE_LIMIT_DEFAULT))
    .pipe(z.number().int().positive().max(TOPOLOGY_NODE_LIMIT_MAX)),
});

export type TopologyQuery = z.infer<typeof topologyQuerySchema>;

export const INCIDENTS_PAGE_SIZE_DEFAULT = 20;
export const INCIDENTS_PAGE_SIZE_MAX = 100;

export const incidentsQuerySchema = z.object({
  serviceId: z.string().min(1).optional(),
  severities: listOf(z.enum(SEVERITIES)),
  status: z.enum(INCIDENT_STATUSES).optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 1))
    .pipe(z.number().int().positive()),
  pageSize: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : INCIDENTS_PAGE_SIZE_DEFAULT))
    .pipe(z.number().int().positive().max(INCIDENTS_PAGE_SIZE_MAX)),
});

export type IncidentsQuery = z.infer<typeof incidentsQuerySchema>;

export const serviceIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type ServiceIdParams = z.infer<typeof serviceIdParamsSchema>;

export const topologyExpandQuerySchema = z.object({
  nodeId: z.string().min(1),
  teams: listOf(z.string().min(1)),
  tiers: listOf(z.enum(TIERS)),
});

export type TopologyExpandQuery = z.infer<typeof topologyExpandQuerySchema>;
