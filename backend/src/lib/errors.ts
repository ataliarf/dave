export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "HttpError";
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, "CONFLICT", message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, "NOT_FOUND", message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends HttpError {
  readonly details: unknown;

  constructor(message: string, details?: unknown) {
    super(400, "VALIDATION_ERROR", message);
    this.name = "ValidationError";
    this.details = details;
  }
}
