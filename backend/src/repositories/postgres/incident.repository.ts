import { Prisma } from "@prisma/client";
import type { Incident, IncidentStatus } from "@dave/shared";
import { prisma } from "../../db/prisma.js";
import type { UpsertCounts } from "../types.js";

interface IncidentInput {
  id: string;
  serviceId: string;
  startedAt: Date;
  resolvedAt: Date | null;
  severity: string;
  title: string;
}

interface ListFilters {
  serviceId?: string;
  severities?: string[];
  status?: IncidentStatus;
  page: number;
  pageSize: number;
}

interface ListResult {
  items: Incident[];
  total: number;
}

const RECENT_INCIDENT_WINDOW_DAYS = 7;
const RECENT_INCIDENT_HARD_CAP = 50;

const toIncident = (r: {
  id: string;
  serviceId: string;
  startedAt: Date;
  resolvedAt: Date | null;
  severity: string;
  title: string;
}): Incident => ({
  id: r.id,
  serviceId: r.serviceId,
  startedAt: r.startedAt.toISOString(),
  resolvedAt: r.resolvedAt ? r.resolvedAt.toISOString() : null,
  severity: r.severity as Incident["severity"],
  title: r.title,
});

export class IncidentRepository {
  /**
   * Upsert all incidents in a single transaction. We split insert vs update
   * via a pre-fetch of existing ids so the step report has accurate counts.
   */
  async bulkUpsert(incidents: IncidentInput[]): Promise<UpsertCounts> {
    if (incidents.length === 0) return { inserted: 0, updated: 0 };

    return prisma.$transaction(async (tx) => {
      const ids = incidents.map((i) => i.id);
      const existing = await tx.incident.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });
      const existingIds = new Set(existing.map((e) => e.id));

      for (const i of incidents) {
        await tx.incident.upsert({
          where: { id: i.id },
          create: i,
          update: {
            serviceId: i.serviceId,
            startedAt: i.startedAt,
            resolvedAt: i.resolvedAt,
            severity: i.severity,
            title: i.title,
          },
        });
      }

      let inserted = 0;
      let updated = 0;
      for (const i of incidents) {
        if (existingIds.has(i.id)) updated++;
        else inserted++;
      }
      return { inserted, updated };
    });
  }

  async reconcile(keepIds: string[]): Promise<{ deleted: number }> {
    const result = await prisma.incident.deleteMany({
      where: keepIds.length > 0 ? { id: { notIn: keepIds } } : {},
    });
    return { deleted: result.count };
  }

  /**
   * Incidents on a service from the last 7 days, newest first. Hard-capped
   * at 50 — the panel renders a short list, not a full audit trail; clients
   * needing more should hit the paginated /api/incidents endpoint.
   */
  async findRecentByService(serviceId: string): Promise<Incident[]> {
    const since = new Date();
    since.setDate(since.getDate() - RECENT_INCIDENT_WINDOW_DAYS);

    const rows = await prisma.incident.findMany({
      where: { serviceId, startedAt: { gte: since } },
      orderBy: { startedAt: Prisma.SortOrder.desc },
      take: RECENT_INCIDENT_HARD_CAP,
    });

    return rows.map(toIncident);
  }

  /**
   * Distinct severities currently present in the incidents table, in canonical
   * sev1→sev4 order. Used to populate the incidents-tab severity filter.
   */
  async findDistinctSeverities(): Promise<Incident["severity"][]> {
    const rows = await prisma.incident.findMany({
      distinct: ["severity"],
      select: { severity: true },
    });
    const order: Record<string, number> = { sev1: 0, sev2: 1, sev3: 2, sev4: 3 };
    return rows
      .map((r) => r.severity as Incident["severity"])
      .sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99));
  }

  async list({ serviceId, severities, status, page, pageSize }: ListFilters): Promise<ListResult> {
    const where: Prisma.IncidentWhereInput = {
      ...(serviceId ? { serviceId } : {}),
      ...(severities && severities.length > 0 ? { severity: { in: severities } } : {}),
      ...(status === "ongoing" ? { resolvedAt: null } : {}),
      ...(status === "resolved" ? { resolvedAt: { not: null } } : {}),
    };

    const [rows, total] = await prisma.$transaction([
      prisma.incident.findMany({
        where,
        orderBy: [{ startedAt: Prisma.SortOrder.desc }, { id: Prisma.SortOrder.desc }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.incident.count({ where }),
    ]);

    return { items: rows.map(toIncident), total };
  }
}
