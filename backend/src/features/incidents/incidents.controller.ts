import type { Request, Response } from "express";
import type { IncidentsQuery } from "@dave/shared";
import type { IncidentsService } from "./incidents.service.js";

type ListIncidentsRequest = Request<unknown, unknown, unknown, IncidentsQuery>;

export class IncidentsController {
  constructor(private readonly incidents: IncidentsService) {}

  list = async (req: ListIncidentsRequest, res: Response): Promise<void> => {
    const body = await this.incidents.list(req.query);
    res.json(body);
  };
}
