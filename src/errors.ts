export class BrowserbeamError extends Error {
  code: string;
  statusCode: number;
  context: Record<string, unknown>;
  requestId?: string;

  constructor(
    message: string,
    {
      code = "",
      statusCode = 0,
      context = {},
      requestId,
    }: {
      code?: string;
      statusCode?: number;
      context?: Record<string, unknown>;
      requestId?: string;
    } = {},
  ) {
    super(message);
    this.name = "BrowserbeamError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.requestId = requestId;
  }
}

export class AuthenticationError extends BrowserbeamError {
  constructor(opts: ConstructorParameters<typeof BrowserbeamError>[1] & { message?: string } = {}) {
    super(opts.message ?? "Invalid API key", opts);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends BrowserbeamError {
  retryAfter?: number;

  constructor(opts: ConstructorParameters<typeof BrowserbeamError>[1] & { message?: string; retryAfter?: number } = {}) {
    super(opts.message ?? "Rate limit exceeded", opts);
    this.name = "RateLimitError";
    this.retryAfter = opts.retryAfter;
  }
}

export class QuotaExceededError extends BrowserbeamError {
  retryAfter?: number;

  constructor(opts: ConstructorParameters<typeof BrowserbeamError>[1] & { message?: string; retryAfter?: number } = {}) {
    super(opts.message ?? "Runtime quota exhausted", opts);
    this.name = "QuotaExceededError";
    this.retryAfter = opts.retryAfter;
  }
}

export class SessionNotFoundError extends BrowserbeamError {
  constructor(opts: ConstructorParameters<typeof BrowserbeamError>[1] & { message?: string } = {}) {
    super(opts.message ?? "Session not found", opts);
    this.name = "SessionNotFoundError";
  }
}

export class EngineUnavailableError extends BrowserbeamError {
  retryAfter?: number;

  constructor(opts: ConstructorParameters<typeof BrowserbeamError>[1] & { message?: string; retryAfter?: number } = {}) {
    super(opts.message ?? "Browser engine unavailable", opts);
    this.name = "EngineUnavailableError";
    this.retryAfter = opts.retryAfter;
  }
}

export class InvalidRequestError extends BrowserbeamError {
  constructor(opts: ConstructorParameters<typeof BrowserbeamError>[1] & { message?: string } = {}) {
    super(opts.message ?? "Invalid request", opts);
    this.name = "InvalidRequestError";
  }
}

export function raiseForStatus(
  statusCode: number,
  body: Record<string, unknown>,
  headers: Record<string, string>,
): never {
  const errorData = (body.error ?? {}) as Record<string, unknown>;
  const code = (errorData.code as string) ?? "unknown";
  const message = (errorData.message as string) ?? "Unknown error";
  const context = (errorData.context as Record<string, unknown>) ?? {};
  const requestId = headers["x-request-id"];
  const retryAfterRaw = headers["retry-after"];
  const retryAfter = retryAfterRaw ? parseInt(retryAfterRaw, 10) : undefined;

  const opts = { code, statusCode, context, requestId, message };

  if (statusCode === 401) throw new AuthenticationError(opts);
  if (statusCode === 429) {
    if (code === "quota_exceeded") throw new QuotaExceededError({ ...opts, retryAfter });
    throw new RateLimitError({ ...opts, retryAfter });
  }
  if (statusCode === 404) throw new SessionNotFoundError(opts);
  if (statusCode === 503) throw new EngineUnavailableError({ ...opts, retryAfter });
  if (statusCode === 400) throw new InvalidRequestError(opts);
  throw new BrowserbeamError(message, opts);
}
