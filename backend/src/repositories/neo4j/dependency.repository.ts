import type { Dependency } from "@dave/shared";
import { withSession } from "../../db/neo4j.js";
import type { UpsertCounts } from "../types.js";

export class DependencyRepository {
  /**
   * All edges where at least one endpoint is in `nodeIds`. Used by topology
   * to render half-edges crossing the filter boundary — the caller distinguishes
   * "fully inside" vs "boundary" by intersecting endpoint ids with the filter
   * set, so this query stays oblivious to the filter semantics.
   */
  async findEdgesTouching(nodeIds: string[]): Promise<Dependency[]> {
    if (nodeIds.length === 0) return [];
    return withSession(async (session) => {
      const result = await session.run(
        `
        MATCH (a:Service)-[r:DEPENDS_ON]->(b:Service)
        WHERE a.id IN $nodeIds OR b.id IN $nodeIds
        RETURN a.id AS from, b.id AS to, r.type AS type, r.criticality AS criticality
        ORDER BY a.id, b.id
        `,
        { nodeIds },
      );
      return result.records.map((r) => ({
        from: r.get("from") as string,
        to: r.get("to") as string,
        type: r.get("type") as Dependency["type"],
        criticality: r.get("criticality") as Dependency["criticality"],
      }));
    });
  }

  /**
   * Upsert dependency edges. Uses MATCH on both endpoints (never MERGE) so
   * we can never accidentally create phantom Service nodes from a bad edge.
   * Caller is responsible for filtering edges whose endpoints don't exist.
   */
  async bulkUpsert(deps: Dependency[]): Promise<UpsertCounts> {
    if (deps.length === 0) return { inserted: 0, updated: 0 };

    return withSession(async (session) => {
      const edgeKeys = deps.map((d) => [d.from, d.to]);

      const existingResult = await session.run(
        `
        UNWIND $edgeKeys AS k
        MATCH (a:Service {id: k[0]})-[r:DEPENDS_ON]->(b:Service {id: k[1]})
        RETURN a.id + '->' + b.id AS key
        `,
        { edgeKeys },
      );
      const existing = new Set(existingResult.records.map((r) => r.get("key") as string));

      await session.run(
        `
        UNWIND $deps AS d
        MATCH (a:Service {id: d.from})
        MATCH (b:Service {id: d.to})
        MERGE (a)-[r:DEPENDS_ON]->(b)
        SET r.type = d.type, r.criticality = d.criticality
        `,
        { deps },
      );

      let inserted = 0;
      let updated = 0;
      for (const d of deps) {
        if (existing.has(`${d.from}->${d.to}`)) updated++;
        else inserted++;
      }
      return { inserted, updated };
    });
  }

  /**
   * Delete edges whose [from, to] pair is not in `keepEdgeKeys`.
   * keepEdgeKeys is an array of [fromId, toId] tuples.
   */
  async reconcile(keepEdgeKeys: Array<[string, string]>): Promise<{ deleted: number }> {
    return withSession(async (session) => {
      const result = await session.run(
        `
        MATCH (a:Service)-[r:DEPENDS_ON]->(b:Service)
        WHERE NOT [a.id, b.id] IN $keepEdgeKeys
        DELETE r
        `,
        { keepEdgeKeys },
      );
      return {
        deleted: result.summary.counters.updates().relationshipsDeleted,
      };
    });
  }
}
