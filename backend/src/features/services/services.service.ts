import type { BlastRadiusResponse, ServiceDetailsResponse } from "@dave/shared";
import { NotFoundError } from "../../lib/errors.js";
import { ServiceRepository } from "../../repositories/neo4j/service.repository.js";
import { IncidentRepository } from "../../repositories/postgres/incident.repository.js";

export class ServicesService {
  constructor(
    private readonly services: ServiceRepository,
    private readonly incidents: IncidentRepository,
  ) {}

  async getDetails(id: string): Promise<ServiceDetailsResponse> {
    const [service, neighbors, recentIncidents] = await Promise.all([
      this.services.findOne(id),
      this.services.findNeighbors(id),
      this.incidents.findRecentByService(id),
    ]);

    if (!service) {
      throw new NotFoundError(`service not found: ${id}`);
    }

    return {
      service,
      directUpstream: neighbors.directUpstream,
      directDownstream: neighbors.directDownstream,
      recentIncidents,
    };
  }

  /**
   * Both directions returned in one response — clients always need both for
   * the canvas highlight, and the two graph queries are cheap enough to fan
   * out in parallel.
   */
  async getBlastRadius(id: string): Promise<BlastRadiusResponse> {
    const exists = await this.services.findOne(id);
    if (!exists) {
      throw new NotFoundError(`service not found: ${id}`);
    }
    return this.services.findBlastRadius(id);
  }
}
