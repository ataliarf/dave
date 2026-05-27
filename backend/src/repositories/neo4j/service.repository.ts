import type { BlastRadiusNode, DirectNeighbor, Service, Tier } from "@dave/shared";
import { withSession } from "../../db/neo4j.js";
import type { UpsertCounts } from "../types.js";

interface FindAllFilters {
  teams?: string[];
  tiers?: Tier[];
  limit: number;
}

interface FindAllResult {
  services: Service[];
  total: number;
}

const BLAST_RADIUS_MAX_DEPTH = 10;

export class ServiceRepository {
  /**
   * Upsert services into Neo4j. Counts new vs existing nodes by checking
   * presence first — Cypher's MERGE doesn't distinguish in its summary.
   */
  async bulkUpsert(services: Service[]): Promise<UpsertCounts> {
    if (services.length === 0) return { inserted: 0, updated: 0 };

    return withSession(async (session) => {
      const ids = services.map((s) => s.id);

      const existingResult = await session.run(
        "MATCH (s:Service) WHERE s.id IN $ids RETURN s.id AS id",
        { ids },
      );
      const existing = new Set(existingResult.records.map((r) => r.get("id") as string));

      await session.run(
        `
        UNWIND $services AS svc
        MERGE (s:Service {id: svc.id})
        SET s.name = svc.name,
            s.team = svc.team,
            s.tier = svc.tier,
            s.language = svc.language,
            s.repo = svc.repo
        `,
        { services },
      );

      let inserted = 0;
      let updated = 0;
      for (const id of ids) {
        if (existing.has(id)) updated++;
        else inserted++;
      }
      return { inserted, updated };
    });
  }

  /**
   * Delete services not present in `keepIds`. Returns count of deleted nodes.
   * DETACH DELETE removes any leftover edges too. We rely on the Cypher
   * summary counters rather than RETURN count(...) because counting after
   * a delete is fragile across Neo4j versions.
   */
  async reconcile(keepIds: string[]): Promise<{ deleted: number }> {
    return withSession(async (session) => {
      const result = await session.run(
        "MATCH (s:Service) WHERE NOT s.id IN $keepIds DETACH DELETE s",
        { keepIds },
      );
      return { deleted: result.summary.counters.updates().nodesDeleted };
    });
  }

  async listIds(): Promise<string[]> {
    return withSession(async (session) => {
      const result = await session.run("MATCH (s:Service) RETURN s.id AS id");
      return result.records.map((r) => r.get("id") as string);
    });
  }

  async findOne(id: string): Promise<Service | null> {
    return withSession(async (session) => {
      const result = await session.run("MATCH (s:Service {id: $id}) RETURN s { .* } AS service", {
        id,
      });
      const record = result.records[0];
      if (!record) return null;
      return record.get("service") as Service;
    });
  }

  async findAll({ teams, tiers, limit }: FindAllFilters): Promise<FindAllResult> {
    return withSession(async (session) => {
      const result = await session.run(
        `
        MATCH (s:Service)
        WHERE ($teams IS NULL OR s.team IN $teams)
          AND ($tiers IS NULL OR s.tier IN $tiers)
        OPTIONAL MATCH (caller:Service)-[:DEPENDS_ON]->(s)
        WITH s, count(DISTINCT caller) AS inDegree
        OPTIONAL MATCH (s)-[:DEPENDS_ON]->(callee:Service)
        WITH s, inDegree, count(DISTINCT callee) AS outDegree
        ORDER BY
          CASE
            WHEN inDegree = 0 AND outDegree > 0 THEN 0
            WHEN inDegree = 0 AND outDegree = 0 THEN 1
            ELSE 2
          END,
          CASE s.tier WHEN 'critical' THEN 0 WHEN 'standard' THEN 1 ELSE 2 END,
          s.id
        WITH collect(s { .* }) AS allServices
        RETURN allServices[0..$limit] AS services, size(allServices) AS total
        `,
        {
          teams: teams ?? null,
          tiers: tiers ?? null,
          limit: Math.trunc(limit),
        },
      );
      const record = result.records[0];
      if (!record) return { services: [], total: 0 };
      return {
        services: record.get("services") as Service[],
        total: (record.get("total") as { toNumber: () => number }).toNumber(),
      };
    });
  }

  /**
   * Distinct team values currently in the graph, alphabetically sorted.
   * Used to populate the team filter UI.
   */
  async findDistinctTeams(): Promise<string[]> {
    return withSession(async (session) => {
      const result = await session.run(
        "MATCH (s:Service) RETURN DISTINCT s.team AS team ORDER BY team",
      );
      return result.records.map((r) => r.get("team") as string);
    });
  }

  /**
   * Distinct tiers currently in the graph, in canonical severity order.
   */
  async findDistinctTiers(): Promise<Tier[]> {
    return withSession(async (session) => {
      const result = await session.run(
        `
        MATCH (s:Service)
        WITH DISTINCT s.tier AS tier
        RETURN tier
        ORDER BY CASE tier WHEN 'critical' THEN 0 WHEN 'standard' THEN 1 ELSE 2 END
        `,
      );
      return result.records.map((r) => r.get("tier") as Tier);
    });
  }

  /**
   * Lightweight (id, name) pairs for every service. Used by the incidents
   * tab's service-filter dropdown — keeping the payload small avoids shipping
   * the full Service shape when only id + name is needed.
   */
  async findAllIdsAndNames(): Promise<{ id: string; name: string }[]> {
    return withSession(async (session) => {
      const result = await session.run(
        "MATCH (s:Service) RETURN s.id AS id, s.name AS name ORDER BY name",
      );
      return result.records.map((r) => ({
        id: r.get("id") as string,
        name: r.get("name") as string,
      }));
    });
  }

  async findNeighborIds(id: string): Promise<string[]> {
    return withSession(async (session) => {
      const result = await session.run(
        `
        MATCH (s:Service {id: $id})-[:DEPENDS_ON]-(n:Service)
        RETURN DISTINCT n.id AS id
        `,
        { id },
      );
      return result.records.map((r) => r.get("id") as string);
    });
  }

  /**
   * Total distinct-neighbor count per service in the full graph (upstream +
   * downstream, each neighbor counted once even if there are edges in both
   * directions). Used by the topology view to decide whether the expand
   * button on a node is meaningful — if everything we'd fetch is already on
   * the canvas, the button is hidden.
   */
  async findDegreesByIds(ids: string[]): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    if (ids.length === 0) return result;
    return withSession(async (session) => {
      const res = await session.run(
        `
        MATCH (s:Service) WHERE s.id IN $ids
        OPTIONAL MATCH (s)-[:DEPENDS_ON]-(n:Service)
        WITH s, collect(DISTINCT n.id) AS neighborIds
        RETURN s.id AS id, size(neighborIds) AS degree
        `,
        { ids },
      );
      for (const r of res.records) {
        const degree = r.get("degree") as { toNumber: () => number } | number;
        result.set(r.get("id") as string, typeof degree === "number" ? degree : degree.toNumber());
      }
      return result;
    });
  }

  async findByIds(ids: string[]): Promise<Service[]> {
    if (ids.length === 0) return [];
    return withSession(async (session) => {
      const result = await session.run(
        "MATCH (s:Service) WHERE s.id IN $ids RETURN s { .* } AS service",
        { ids },
      );
      return result.records.map((r) => r.get("service") as Service);
    });
  }

  /**
   * Direct upstream/downstream neighbors with edge metadata. Each direction
   * runs in its own session so the queries can fan out in parallel — Neo4j
   * disallows concurrent queries on a single session.
   */
  async findNeighbors(id: string): Promise<{
    directUpstream: DirectNeighbor[];
    directDownstream: DirectNeighbor[];
  }> {
    const toNeighbor = (r: { get: (k: string) => unknown }): DirectNeighbor => ({
      id: r.get("id") as string,
      name: r.get("name") as string,
      team: r.get("team") as string,
      type: r.get("type") as DirectNeighbor["type"],
      criticality: r.get("criticality") as DirectNeighbor["criticality"],
    });

    const [directUpstream, directDownstream] = await Promise.all([
      withSession(async (session) => {
        const result = await session.run(
          `
          MATCH (caller:Service)-[r:DEPENDS_ON]->(me:Service {id: $id})
          RETURN caller.id AS id, caller.name AS name, caller.team AS team,
                 r.type AS type, r.criticality AS criticality
          ORDER BY caller.id
          `,
          { id },
        );
        return result.records.map(toNeighbor);
      }),
      withSession(async (session) => {
        const result = await session.run(
          `
          MATCH (me:Service {id: $id})-[r:DEPENDS_ON]->(callee:Service)
          RETURN callee.id AS id, callee.name AS name, callee.team AS team,
                 r.type AS type, r.criticality AS criticality
          ORDER BY callee.id
          `,
          { id },
        );
        return result.records.map(toNeighbor);
      }),
    ]);

    return { directUpstream, directDownstream };
  }

  /**
   * Transitive blast radius. Hard depth cap at 10 hops to bound graph traversal
   * cost on dense subgraphs. Distance is the shortest hop count, so a service
   * reachable via depth-2 and depth-5 paths is reported as depth-2.
   */
  async findBlastRadius(id: string): Promise<{
    upstream: BlastRadiusNode[];
    downstream: BlastRadiusNode[];
  }> {
    const toBlastNode = (r: { get: (k: string) => unknown }): BlastRadiusNode => ({
      id: r.get("id") as string,
      distance: (r.get("distance") as { toNumber: () => number }).toNumber(),
    });

    const [downstream, upstream] = await Promise.all([
      withSession(async (session) => {
        const result = await session.run(
          `
          MATCH path = (start:Service {id: $id})-[:DEPENDS_ON*1..${BLAST_RADIUS_MAX_DEPTH}]->(target:Service)
          WITH target, min(length(path)) AS distance
          RETURN target.id AS id, distance
          ORDER BY distance, target.id
          `,
          { id },
        );
        return result.records.map(toBlastNode);
      }),
      withSession(async (session) => {
        const result = await session.run(
          `
          MATCH path = (start:Service {id: $id})<-[:DEPENDS_ON*1..${BLAST_RADIUS_MAX_DEPTH}]-(target:Service)
          WITH target, min(length(path)) AS distance
          RETURN target.id AS id, distance
          ORDER BY distance, target.id
          `,
          { id },
        );
        return result.records.map(toBlastNode);
      }),
    ]);

    return { upstream, downstream };
  }
}
