import { Router } from "express";
import { incidentsQuerySchema } from "@dave/shared";
import { asyncHandler } from "../../lib/async-handler.js";
import { validateQuery } from "../../middleware/validate.js";
import type { IncidentsController } from "./incidents.controller.js";

export function createIncidentsRouter(controller: IncidentsController): Router {
  const router = Router();
  router.get("/", validateQuery(incidentsQuerySchema), asyncHandler(controller.list));
  return router;
}
