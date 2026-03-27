import { HttpClient } from "./http.js";
import { Session } from "./session.js";
import type {
  SessionEnvelope,
  SessionInfo,
  SessionList,
  CreateSessionOptions,
  ListSessionsOptions,
} from "./types.js";

export type {
  SessionEnvelope,
  SessionInfo,
  SessionList,
  SessionListItem,
  PageState,
  MarkdownContent,
  InteractiveElement,
  Form,
  Changes,
  ScrollState,
  MediaItem,
  StepError,
  Step,
  CreateSessionOptions,
  ListSessionsOptions,
  ClickOptions,
  FillOptions,
  TypeOptions,
  SelectOptions,
  CheckOptions,
  ScrollOptions,
  ScrollCollectOptions,
  ScreenshotOptions,
  WaitOptions,
  ObserveOptions,
  GotoOptions,
  FillFormOptions,
  PdfOptions,
  UploadOptions,
  ExecuteJsOptions,
} from "./types.js";

export {
  BrowserbeamError,
  AuthenticationError,
  RateLimitError,
  QuotaExceededError,
  SessionNotFoundError,
  EngineUnavailableError,
  InvalidRequestError,
} from "./errors.js";

export { Session } from "./session.js";

class Sessions {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  async create(opts: CreateSessionOptions = {}): Promise<Session> {
    const { idempotency_key, ...body } = opts;
    const extraHeaders: Record<string, string> = {};
    if (idempotency_key) {
      extraHeaders["Idempotency-Key"] = idempotency_key;
    }
    const data = await this._http.post<SessionEnvelope>(
      "/v1/sessions",
      Object.keys(body).length > 0 ? body : {},
      Object.keys(extraHeaders).length > 0 ? extraHeaders : undefined,
    );
    return new Session(data, this._http);
  }

  async get(sessionId: string): Promise<SessionInfo> {
    return this._http.get<SessionInfo>(`/v1/sessions/${sessionId}`);
  }

  async list(opts: ListSessionsOptions = {}): Promise<SessionList> {
    return this._http.get<SessionList>("/v1/sessions", opts as Record<string, string | number | undefined>);
  }

  async destroy(sessionId: string): Promise<void> {
    await this._http.delete(`/v1/sessions/${sessionId}`);
  }
}

export interface BrowserbeamOptions {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export default class Browserbeam {
  sessions: Sessions;
  private _http: HttpClient;

  constructor(opts: BrowserbeamOptions = {}) {
    const apiKey = opts.apiKey ?? (typeof process !== "undefined" ? process.env.BROWSERBEAM_API_KEY : undefined) ?? "";
    if (!apiKey) {
      throw new Error(
        "No API key provided. Pass apiKey in options or set the BROWSERBEAM_API_KEY environment variable.",
      );
    }
    this._http = new HttpClient({
      apiKey,
      baseUrl: opts.baseUrl,
      timeout: opts.timeout,
    });
    this.sessions = new Sessions(this._http);
  }
}
