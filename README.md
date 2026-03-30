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
| `session.observe()` | Get page state as markdown. Supports `mode: "full"` for all sections. |
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
| `session.executeJs(code)` | Run JavaScript |
| `session.close()` | Close the session |

## Page Map & Full Mode

The first `observe` call automatically includes a `page.map` — a lightweight structural outline of the page's landmark regions (header, nav, main, aside, footer) with CSS selectors and descriptive hints. Use it to discover what content is available outside the main area.

```typescript
const res = await session.observe();
console.log(res.page?.map);
// [{ section: "nav", selector: "nav.top-nav", hint: "Home · Docs · Pricing" }, ...]
```

To re-request the map on subsequent calls:

```typescript
await session.observe({ include_page_map: true });
```

When you need content from **all** page sections (sidebars, footer links, nav items), use `mode: "full"`. The response markdown is organized by region headers:

```typescript
const full = await session.observe({ mode: "full", max_text_length: 20000 });
// page.markdown.content contains:
// ## [nav]
// Home · Docs · Pricing
// ## [main]
// ...article content...
// ## [aside]
// Related posts · ...
```

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
