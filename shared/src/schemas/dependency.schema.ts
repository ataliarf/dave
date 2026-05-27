import { z } from "zod";
import { CRITICALITIES, DEPENDENCY_TYPES } from "../domain/dependency.js";

export const dependencySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  type: z.enum(DEPENDENCY_TYPES),
  criticality: z.enum(CRITICALITIES),
});

export type DependencyInput = z.infer<typeof dependencySchema>;
