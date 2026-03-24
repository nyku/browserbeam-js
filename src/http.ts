import { raiseForStatus } from "./errors.js";

const DEFAULT_BASE_URL = "https://api.browserbeam.com";
const DEFAULT_TIMEOUT = 120_000;

export interface HttpClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

function lowerHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor({ apiKey, baseUrl, timeout }: HttpClientOptions) {
    this.baseUrl = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeout = timeout ?? DEFAULT_TIMEOUT;
    this.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "browserbeam-js/0.1.0",
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: { ...this.headers, ...extraHeaders },
        body: body != null ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (response.status === 204) {
        return {} as T;
      }

      const json = await response.json();

      if (response.status >= 400) {
        raiseForStatus(response.status, json, lowerHeaders(response.headers));
      }

      return json as T;
    } finally {
      clearTimeout(timer);
    }
  }

  async post<T>(path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>("POST", path, body, extraHeaders);
  }

  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) searchParams.set(key, String(value));
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>("GET", url);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}
