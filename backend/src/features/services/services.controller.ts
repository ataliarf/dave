import type { Request, Response } from "express";
import type { ServiceIdParams } from "@dave/shared";
import type { ServicesService } from "./services.service.js";

type ServiceIdRequest = Request<ServiceIdParams>;

export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  details = async (req: ServiceIdRequest, res: Response): Promise<void> => {
    const body = await this.services.getDetails(req.params.id);
    res.json(body);
  };

  blastRadius = async (req: ServiceIdRequest, res: Response): Promise<void> => {
    const body = await this.services.getBlastRadius(req.params.id);
    res.json(body);
  };
}
