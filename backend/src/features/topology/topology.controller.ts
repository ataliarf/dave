import type { Request, Response } from "express";
import type { TopologyExpandQuery, TopologyQuery } from "@dave/shared";
import type { TopologyService } from "./topology.service.js";

type GetTopologyRequest = Request<unknown, unknown, unknown, TopologyQuery>;
type ExpandTopologyRequest = Request<unknown, unknown, unknown, TopologyExpandQuery>;

export class TopologyController {
  constructor(private readonly topology: TopologyService) {}

  get = async (req: GetTopologyRequest, res: Response): Promise<void> => {
    const body = await this.topology.getTopology(req.query);
    res.json(body);
  };

  expand = async (req: ExpandTopologyRequest, res: Response): Promise<void> => {
    const body = await this.topology.getNeighborhood(req.query);
    res.json(body);
  };
}
