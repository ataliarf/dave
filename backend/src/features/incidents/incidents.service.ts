import type { IncidentsListResponse, IncidentsQuery } from "@dave/shared";
import { IncidentRepository } from "../../repositories/postgres/incident.repository.js";

export class IncidentsService {
  constructor(private readonly incidents: IncidentRepository) {}

  async list(query: IncidentsQuery): Promise<IncidentsListResponse> {
    const { items, total } = await this.incidents.list({
      serviceId: query.serviceId,
      severities: query.severities,
      status: query.status,
      page: query.page,
      pageSize: query.pageSize,
    });

    return {
      items,
      total,
      hasMore: query.page * query.pageSize < total,
    };
  }
}
