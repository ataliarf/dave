import type { FilterOptionsResponse } from "@dave/shared";
import { ServiceRepository } from "../../repositories/neo4j/service.repository.js";
import { IncidentRepository } from "../../repositories/postgres/incident.repository.js";

export class FiltersService {
  constructor(
    private readonly services: ServiceRepository,
    private readonly incidents: IncidentRepository,
  ) {}

  /**
   * Returns the filter options that actually have data behind them — distinct
   * teams/tiers from the graph, distinct severities from incidents, plus the
   * full (id, name) pairs for the services dropdown.
   *
   * Pre-ingest the stores are empty and every array is empty too; the frontend
   * uses that signal to render the "no filters available — run an ingest"
   * empty state instead of an empty checkbox group.
   */
  async getOptions(): Promise<FilterOptionsResponse> {
    const [teams, tiers, severities, services] = await Promise.all([
      this.services.findDistinctTeams(),
      this.services.findDistinctTiers(),
      this.incidents.findDistinctSeverities(),
      this.services.findAllIdsAndNames(),
    ]);

    return { teams, tiers, severities, services };
  }
}
