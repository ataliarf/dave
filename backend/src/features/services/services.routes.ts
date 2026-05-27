import { Router } from "express";
import { serviceIdParamsSchema } from "@dave/shared";
import { asyncHandler } from "../../lib/async-handler.js";
import { validateParams } from "../../middleware/validate.js";
import type { ServicesController } from "./services.controller.js";

export function createServicesRouter(controller: ServicesController): Router {
  const router = Router();
  router.get(
    "/:id/blast-radius",
    validateParams(serviceIdParamsSchema),
    asyncHandler(controller.blastRadius),
  );
  router.get("/:id", validateParams(serviceIdParamsSchema), asyncHandler(controller.details));
  return router;
}
