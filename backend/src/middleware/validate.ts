import type { RequestHandler } from "express";
import type { ZodTypeAny, infer as zInfer } from "zod";
import { ValidationError } from "../lib/errors.js";

export function validateQuery<S extends ZodTypeAny>(
  schema: S,
): RequestHandler<unknown, unknown, unknown, zInfer<S>> {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      next(new ValidationError("invalid query", parsed.error.flatten()));
      return;
    }
    req.query = parsed.data;
    next();
  };
}

export function validateParams<S extends ZodTypeAny>(schema: S): RequestHandler<zInfer<S>> {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      next(new ValidationError("invalid params", parsed.error.flatten()));
      return;
    }
    req.params = parsed.data;
    next();
  };
}

export function validateBody<S extends ZodTypeAny>(
  schema: S,
): RequestHandler<unknown, unknown, zInfer<S>> {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(new ValidationError("invalid request body", parsed.error.flatten()));
      return;
    }
    req.body = parsed.data;
    next();
  };
}
