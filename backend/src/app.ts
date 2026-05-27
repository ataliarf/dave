import express, { type Express } from "express";
import { buildContainer } from "./composition.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { createFiltersRouter } from "./features/filters/filters.routes.js";
import { createIncidentsRouter } from "./features/incidents/incidents.routes.js";
import { createIngestRouter } from "./features/ingest/ingest.routes.js";
import { createServicesRouter } from "./features/services/services.routes.js";
import { createTopologyRouter } from "./features/topology/topology.routes.js";

export function createApp(): Express {
  const app = express();
  const container = buildContainer();

  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/ingest", createIngestRouter(container.ingestController));
  app.use("/api/topology", createTopologyRouter(container.topologyController));
  app.use("/api/services", createServicesRouter(container.servicesController));
  app.use("/api/incidents", createIncidentsRouter(container.incidentsController));
  app.use("/api/filters", createFiltersRouter(container.filtersController));

  app.use(errorHandler);

  return app;
}
