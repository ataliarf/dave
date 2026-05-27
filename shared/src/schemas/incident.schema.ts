import { z } from "zod";
import { SEVERITIES } from "../domain/incident.js";

const isoDatetime = z
  .string()
  .min(1)
  .refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "invalid ISO 8601 datetime",
  });

export const incidentRowSchema = z.object({
  id: z.string().min(1),
  service_id: z.string().min(1),
  started_at: isoDatetime,
  resolved_at: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null))
    .pipe(isoDatetime.nullable()),
  severity: z.enum(SEVERITIES),
  title: z.string().min(1),
});

export type IncidentRowInput = z.infer<typeof incidentRowSchema>;
