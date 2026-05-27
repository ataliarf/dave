import type { Request, Response } from "express";
import type { FiltersService } from "./filters.service.js";

export class FiltersController {
  constructor(private readonly filters: FiltersService) {}

  get = async (_req: Request, res: Response): Promise<void> => {
    const body = await this.filters.getOptions();
    res.json(body);
  };
}
