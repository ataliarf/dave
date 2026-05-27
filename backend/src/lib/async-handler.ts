import type { Request, RequestHandler, Response } from "express";

export function asyncHandler<P, ResB, ReqB, ReqQ>(
  handler: (req: Request<P, ResB, ReqB, ReqQ>, res: Response) => Promise<unknown>,
): RequestHandler<P, ResB, ReqB, ReqQ> {
  return (req, res, next) => {
    handler(req, res).catch(next);
  };
}
