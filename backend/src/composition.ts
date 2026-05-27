import { FiltersController } from "./features/filters/filters.controller.js";
import { FiltersService } from "./features/filters/filters.service.js";
import { IncidentsController } from "./features/incidents/incidents.controller.js";
import { IncidentsService } from "./features/incidents/incidents.service.js";
import { IngestController } from "./features/ingest/ingest.controller.js";
import { InProcessIngestExecutor } from "./features/ingest/ingest-executor.js";
import { IngestService } from "./features/ingest/ingest.service.js";
import { ServicesController } from "./features/services/services.controller.js";
import { ServicesService } from "./features/services/services.service.js";
import { TopologyController } from "./features/topology/topology.controller.js";
import { TopologyService } from "./features/topology/topology.service.js";
import { DependencyRepository } from "./repositories/neo4j/dependency.repository.js";
import { ServiceRepository } from "./repositories/neo4j/service.repository.js";
import { IncidentRepository } from "./repositories/postgres/incident.repository.js";
import { IngestRunRepository } from "./repositories/postgres/ingest-run.repository.js";

export interface AppContainer {
  ingestController: IngestController;
  topologyController: TopologyController;
  servicesController: ServicesController;
  incidentsController: IncidentsController;
  filtersController: FiltersController;
}

/**
 * Composition root: instantiate the layers and wire dependencies.
 * Kept as a single function (rather than a DI container) because the graph
 * is small and explicit construction reads cleanly. When the system grows,
 * swap this for inversify / awilix / tsyringe without touching call sites.
 */
export function buildContainer(): AppContainer {
  const services = new ServiceRepository();
  const dependencies = new DependencyRepository();
  const incidents = new IncidentRepository();
  const runs = new IngestRunRepository();
  const executor = new InProcessIngestExecutor();

  const ingest = new IngestService(runs, services, dependencies, incidents, executor);
  const topology = new TopologyService(services, dependencies);
  const servicesFeature = new ServicesService(services, incidents);
  const incidentsFeature = new IncidentsService(incidents);
  const filtersFeature = new FiltersService(services, incidents);

  return {
    ingestController: new IngestController(ingest),
    topologyController: new TopologyController(topology),
    servicesController: new ServicesController(servicesFeature),
    incidentsController: new IncidentsController(incidentsFeature),
    filtersController: new FiltersController(filtersFeature),
  };
}
