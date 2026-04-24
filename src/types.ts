export interface MarkdownContent {
  content: string;
  length?: {
    shown: number;
    total: number;
  };
}

export interface InteractiveElement {
  ref: string;
  tag: string;
  role?: string;
  label: string;
  value?: string;
  /** Nearest semantic landmark (e.g. nav, main, form, dialog). */
  in?: string;
  /** Nearest heading text or section aria-label for disambiguation. */
  near?: string;
  /** Parent form ref from `page.forms` when the element is inside a form. */
  form?: string;
}

export interface Form {
  ref: string;
  id: string | null;
  action: string;
  method: string;
  /** Interactive element refs belonging to this form, in document order. */
  fields: string[];
}

export interface MapEntry {
  section: string;
  selector: string;
  hint: string;
}

export interface Changes {
  content_changed: boolean;
  content_delta?: string | null;
  elements_added: Record<string, unknown>[];
  elements_removed: Record<string, unknown>[];
}

export interface ScrollState {
  y: number;
  height: number;
  viewport: number;
  percent: number;
}

export interface PageState {
  url: string;
  title: string;
  stable: boolean;
  markdown?: MarkdownContent | null;
  /** Structural outline of page sections. Auto-included on first observe, or when `include_page_map: true`. */
  map?: MapEntry[];
  interactive_elements: InteractiveElement[];
  forms: Form[];
  changes?: Changes | null;
  scroll?: ScrollState | null;
}

export interface MediaItem {
  type: "screenshot" | "pdf";
  format: string;
  data: string;
}

export interface StepError {
  step: number;
  action: string;
  code:
    | "element_not_found"
    | "navigation_failed"
    | "captcha_detected"
    | "captcha_unsolvable"
    | "access_denied"
    | "action_failed"
    | "extract_failed"
    | "invalid_request";
  message: string;
  context?: Record<string, unknown>;
}

export interface SessionEnvelope {
  session_id: string;
  expires_at: string;
  request_id: string;
  completed: number;
  page: PageState | null;
  media: MediaItem[];
  extraction: Record<string, unknown> | null;
  blockers_dismissed: string[];
  error: StepError | null;
}

export interface SessionInfo {
  session_id: string;
  status: "active" | "closed" | "failed";
  started_at: string;
  ended_at?: string | null;
  duration_seconds?: number | null;
  expires_at: string;
  /** Present when `status` is `"failed"`. Engine fatal error code (e.g. `access_denied`). */
  error_code?: string | null;
  /** Human-readable details when the session failed fatally. */
  error_message?: string | null;
}

export interface SessionListItem {
  session_id: string;
  status: string;
  started_at: string;
}

export interface SessionList {
  sessions: SessionListItem[];
  has_more: boolean;
  next_cursor: string | null;
}

export type Step = Record<string, Record<string, unknown>>;

export interface CreateSessionOptions {
  url?: string;
  steps?: Step[];
  timeout?: number;
  viewport?: { width?: number; height?: number };
  user_agent?: string;
  locale?: string;
  timezone?: string;
  proxy?: string | { kind: "datacenter" | "residential"; country?: string };
  block_resources?: ("image" | "font" | "media" | "stylesheet" | "script")[];
  auto_dismiss_blockers?: boolean;
  cookies?: Record<string, unknown>[];
  idempotency_key?: string;
}

export interface ListSessionsOptions {
  status?: "active" | "closed" | "failed";
  limit?: number;
  after?: string;
}

export interface ClickOptions {
  ref?: string;
  text?: string;
  label?: string;
}

export interface FillOptions {
  value: string;
  ref?: string;
  text?: string;
  label?: string;
}

export interface TypeOptions {
  value: string;
  ref?: string;
  text?: string;
  label?: string;
  delay?: number;
}

export interface SelectOptions {
  value: string;
  ref?: string;
  text?: string;
  label?: string;
}

export interface CheckOptions {
  ref?: string;
  text?: string;
  label?: string;
  checked?: boolean;
}

export interface ScrollOptions {
  to?: string;
  direction?: string;
  amount?: number;
  times?: number;
  ref?: string;
  text?: string;
  label?: string;
}

export interface ScrollCollectOptions {
  max_scrolls?: number;
  wait_ms?: number;
  timeout_ms?: number;
  max_text_length?: number;
}

export interface ScreenshotOptions {
  full_page?: boolean;
  format?: string;
  quality?: number;
  selector?: string;
}

export interface WaitOptions {
  ms?: number;
  selector?: string;
  text?: string;
  until?: string;
  timeout?: number;
}

export interface ObserveOptions {
  scope?: string;
  format?: string;
  /** `"main"` (default) returns main content only. `"full"` returns all page sections organized by region headers. */
  mode?: "main" | "full";
  /** Include a section map in the response. Auto-included on first observe; set `true` to request again. */
  include_page_map?: boolean;
  include_links?: boolean;
  max_text_length?: number;
}

export interface GotoOptions {
  url: string;
  wait_for?: string;
  wait_until?: string;
  wait_timeout?: number;
}

export interface FillFormOptions {
  fields: Record<string, string>;
  submit?: boolean;
}

export interface PdfOptions {
  format?: string;
  landscape?: boolean;
  print_background?: boolean;
  scale?: number;
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
}

export interface UploadOptions {
  files: string[];
  ref?: string;
  text?: string;
  label?: string;
}

export interface ExecuteJsOptions {
  code: string;
  result_key?: string;
  timeout?: number;
}
