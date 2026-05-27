import { Router } from "express";
import type { IngestController } from "./ingest.controller.js";

export function createIngestRouter(controller: IngestController): Router {
  const router = Router();
  router.post("/", (req, res, next) => {
    controller.start(req, res).catch(next);
  });
  router.get("/status", (req, res, next) => {
    controller.status(req, res).catch(next);
  });
  return router;
}
