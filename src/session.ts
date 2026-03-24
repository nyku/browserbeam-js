import type {
  SessionEnvelope,
  Step,
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
  PageState,
  MediaItem,
  StepError,
} from "./types.js";
import type { HttpClient } from "./http.js";

function stripUndefined(obj: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  );
}

export class Session {
  sessionId: string;
  expiresAt: string;
  requestId: string;
  completed: number;
  page: PageState | null;
  media: MediaItem[];
  extraction: Record<string, unknown> | null;
  blockersDismissed: string[];
  error: StepError | null;

  private _http: HttpClient;
  private _last: SessionEnvelope;

  constructor(envelope: SessionEnvelope, http: HttpClient) {
    this._http = http;
    this._last = envelope;
    this.sessionId = envelope.session_id;
    this.expiresAt = envelope.expires_at;
    this.requestId = envelope.request_id;
    this.completed = envelope.completed;
    this.page = envelope.page;
    this.media = envelope.media;
    this.extraction = envelope.extraction;
    this.blockersDismissed = envelope.blockers_dismissed;
    this.error = envelope.error;
  }

  private _update(envelope: SessionEnvelope): void {
    this._last = envelope;
    this.sessionId = envelope.session_id;
    this.expiresAt = envelope.expires_at;
    this.requestId = envelope.request_id;
    this.completed = envelope.completed;
    this.page = envelope.page;
    this.media = envelope.media;
    this.extraction = envelope.extraction;
    this.blockersDismissed = envelope.blockers_dismissed;
    this.error = envelope.error;
  }

  get lastResponse(): SessionEnvelope {
    return this._last;
  }

  async act(steps: Step[]): Promise<SessionEnvelope> {
    const data = await this._http.post<SessionEnvelope>(
      `/v1/sessions/${this.sessionId}/act`,
      { steps },
    );
    this._update(data);
    return data;
  }

  async goto(urlOrOpts: string | GotoOptions): Promise<SessionEnvelope> {
    const opts = typeof urlOrOpts === "string" ? { url: urlOrOpts } : urlOrOpts;
    return this.act([{ goto: stripUndefined(opts) }]);
  }

  async observe(opts: ObserveOptions = {}): Promise<SessionEnvelope> {
    return this.act([{ observe: stripUndefined(opts) }]);
  }

  async click(opts: ClickOptions): Promise<SessionEnvelope> {
    return this.act([{ click: stripUndefined(opts) }]);
  }

  async fill(opts: FillOptions): Promise<SessionEnvelope> {
    return this.act([{ fill: stripUndefined(opts) }]);
  }

  async type(opts: TypeOptions): Promise<SessionEnvelope> {
    return this.act([{ type: stripUndefined(opts) }]);
  }

  async select(opts: SelectOptions): Promise<SessionEnvelope> {
    return this.act([{ select: stripUndefined(opts) }]);
  }

  async check(opts: CheckOptions): Promise<SessionEnvelope> {
    return this.act([{ check: stripUndefined(opts) }]);
  }

  async scroll(opts: ScrollOptions = {}): Promise<SessionEnvelope> {
    return this.act([{ scroll: stripUndefined(opts) }]);
  }

  async scrollCollect(opts: ScrollCollectOptions = {}): Promise<SessionEnvelope> {
    return this.act([{ scroll_collect: stripUndefined(opts) }]);
  }

  async screenshot(opts: ScreenshotOptions = {}): Promise<SessionEnvelope> {
    return this.act([{ screenshot: stripUndefined(opts) }]);
  }

  async wait(opts: WaitOptions): Promise<SessionEnvelope> {
    return this.act([{ wait: stripUndefined(opts) }]);
  }

  async extract(schema: Record<string, unknown>): Promise<SessionEnvelope> {
    return this.act([{ extract: schema }]);
  }

  async fillForm(opts: FillFormOptions): Promise<SessionEnvelope> {
    return this.act([{ fill_form: stripUndefined(opts) }]);
  }

  async upload(ref: string, files: string[]): Promise<SessionEnvelope> {
    return this.act([{ upload: { ref, files } }]);
  }

  async pdf(opts: PdfOptions = {}): Promise<SessionEnvelope> {
    return this.act([{ pdf: stripUndefined(opts) }]);
  }

  async executeJs(expression: string): Promise<SessionEnvelope> {
    return this.act([{ execute_js: { expression } }]);
  }

  async close(): Promise<SessionEnvelope> {
    return this.act([{ close: {} }]);
  }
}
