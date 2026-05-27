import type {
  Service,
  Tier,
  TopologyEdge,
  TopologyExpandQuery,
  TopologyExpandResponse,
  TopologyNode,
  TopologyQuery,
  TopologyResponse,
} from "@dave/shared";
import { DependencyRepository } from "../../repositories/neo4j/dependency.repository.js";
import { ServiceRepository } from "../../repositories/neo4j/service.repository.js";

export class TopologyService {
  constructor(
    private readonly services: ServiceRepository,
    private readonly dependencies: DependencyRepository,
  ) {}

  async getTopology(query: TopologyQuery): Promise<TopologyResponse> {
    const { services: matched, total } = await this.services.findAll({
      teams: query.teams,
      tiers: query.tiers,
      limit: query.limit,
    });

    const ids = matched.map((s) => s.id);
    const idSet = new Set(ids);

    const [touchingEdges, degrees] = await Promise.all([
      this.dependencies.findEdgesTouching(ids),
      this.services.findDegreesByIds(ids),
    ]);

    const internalEdges = touchingEdges.filter((e) => idSet.has(e.from) && idSet.has(e.to));

    const nodes: TopologyNode[] = matched.map((s) => ({
      ...s,
      matchesFilter: true,
      degree: degrees.get(s.id) ?? 0,
    }));

    return {
      nodes,
      edges: internalEdges as TopologyEdge[],
      truncated: matched.length < total,
      totalNodes: total,
    };
  }

  async getNeighborhood(query: TopologyExpandQuery): Promise<TopologyExpandResponse> {
    const { nodeId, teams, tiers } = query;
    const neighborIds = await this.services.findNeighborIds(nodeId);
    const allIds = [nodeId, ...neighborIds];

    const [hydrated, touchingEdges, degrees] = await Promise.all([
      this.services.findByIds(allIds),
      this.dependencies.findEdgesTouching(allIds),
      this.services.findDegreesByIds(allIds),
    ]);

    const edges = touchingEdges.filter((e) => e.from === nodeId || e.to === nodeId);

    const nodes: TopologyNode[] = hydrated.map((s) => ({
      ...s,
      matchesFilter: serviceMatchesFilter(s, teams, tiers),
      degree: degrees.get(s.id) ?? 0,
    }));

    return { nodes, edges };
  }
}

function serviceMatchesFilter(
  service: Service,
  teams: string[] | undefined,
  tiers: Tier[] | undefined,
): boolean {
  if (teams && teams.length > 0 && !teams.includes(service.team)) return false;
  if (tiers && tiers.length > 0 && !tiers.includes(service.tier)) return false;
  return true;
}
