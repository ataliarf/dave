import type { ErrorRequestHandler } from "express";
import { HttpError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        ...("details" in err && err.details !== undefined ? { details: err.details } : {}),
      },
    });
    return;
  }

  logger.error({ err }, "unhandled error");
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Internal server error" },
  });
};
