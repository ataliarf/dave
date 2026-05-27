import { Router } from "express";
import { topologyExpandQuerySchema, topologyQuerySchema } from "@dave/shared";
import { asyncHandler } from "../../lib/async-handler.js";
import { validateQuery } from "../../middleware/validate.js";
import type { TopologyController } from "./topology.controller.js";

export function createTopologyRouter(controller: TopologyController): Router {
  const router = Router();
  router.get("/", validateQuery(topologyQuerySchema), asyncHandler(controller.get));
  router.get("/expand", validateQuery(topologyExpandQuerySchema), asyncHandler(controller.expand));
  return router;
}
