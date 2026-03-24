# Browserbeam TypeScript SDK

Official TypeScript/Node.js SDK for the [Browserbeam API](https://browserbeam.com) — browser automation built for AI agents.

## Installation

```bash
npm install @browserbeam/sdk
```

## Quick Start

```typescript
import Browserbeam from "@browserbeam/sdk";

const client = new Browserbeam({ apiKey: "sk_live_..." });
const session = await client.sessions.create({ url: "https://example.com" });

// Page state is available immediately
console.log(session.page?.title);
console.log(session.page?.interactive_elements);

// Interact with the page
await session.click({ ref: "e1" });

// Extract structured data
const result = await session.extract({
  title: "h1 >> text",
  links: ["a >> href"],
});
console.log(result.extraction);

await session.close();
```

## Configuration

```typescript
const client = new Browserbeam({
  apiKey: "sk_live_...",  // or set BROWSERBEAM_API_KEY env var
  baseUrl: "https://api.browserbeam.com",  // default
  timeout: 120_000,  // request timeout in ms
});
```

## Session Options

```typescript
const session = await client.sessions.create({
  url: "https://example.com",
  viewport: { width: 1280, height: 720 },
  locale: "en-US",
  timezone: "America/New_York",
  proxy: "http://user:pass@proxy:8080",
  block_resources: ["image", "font"],
  auto_dismiss_blockers: true,
  timeout: 300,
});
```

## Available Methods

| Method | Description |
|--------|-------------|
| `session.goto(url)` | Navigate to a URL |
| `session.observe()` | Get page state as markdown |
| `session.click({ ref })` | Click an element by ref, text, or label |
| `session.fill({ value, ref })` | Fill an input field |
| `session.type({ value, label })` | Type text character by character |
| `session.select({ value, label })` | Select a dropdown option |
| `session.check({ label })` | Toggle a checkbox |
| `session.scroll({ to: "bottom" })` | Scroll the page |
| `session.scrollCollect()` | Scroll and collect all content |
| `session.screenshot()` | Take a screenshot |
| `session.extract(schema)` | Extract structured data |
| `session.fillForm({ fields, submit })` | Fill and submit a form |
| `session.wait({ ms })` | Wait for time, selector, or text |
| `session.pdf()` | Generate a PDF |
| `session.executeJs(expr)` | Run JavaScript |
| `session.close()` | Close the session |

## Session Management

```typescript
const sessions = await client.sessions.list({ status: "active" });
const info = await client.sessions.get("ses_abc123");
await client.sessions.destroy("ses_abc123");
```

## Error Handling

```typescript
import Browserbeam, { RateLimitError, SessionNotFoundError } from "@browserbeam/sdk";

try {
  const session = await client.sessions.create({ url: "https://example.com" });
} catch (e) {
  if (e instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${e.retryAfter}s`);
  }
}
```

## Documentation

Full API documentation at [browserbeam.com/docs](https://browserbeam.com/docs/).

## License

MIT
