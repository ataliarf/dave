import { z } from "zod";
import { TIERS } from "../domain/service.js";

export const serviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  team: z.string().min(1),
  tier: z.enum(TIERS),
  language: z.string().min(1),
  repo: z.string().min(1),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
