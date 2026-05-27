import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import type { FiltersController } from "./filters.controller.js";

export function createFiltersRouter(controller: FiltersController): Router {
  const router = Router();
  router.get("/", asyncHandler(controller.get));
  return router;
}
