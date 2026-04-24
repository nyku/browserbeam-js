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

// Extract with CSS, AI, and JS selectors combined
const result = await session.extract({
  products: [{
    _parent: ".product-card",
    _limit: 3,
    name: "h2 >> text",                          // CSS selector
    price: ".price >> text",                     // CSS selector
    url: "a >> href",                            // CSS attribute
    rating: "ai >> the star rating out of 5",    // AI selector
    in_stock: "js >> el.querySelector('.stock')?.textContent.includes('In stock')",  // JS
  }],
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
  user_agent: "Mozilla/5.0 ...",  // omit for automatic rotation
  locale: "en-US",
  timezone: "America/New_York",
  block_resources: ["image", "font"],
  auto_dismiss_blockers: true,
  timeout: 300,
});
```

### Proxies

All sessions use a datacenter proxy by default (country auto-detected from the URL's TLD). No configuration needed. To customize:

```typescript
// Use a residential proxy for a specific country
const session = await client.sessions.create({
  url: "https://example.com",
  proxy: { kind: "residential", country: "us" },
});

// Or bring your own proxy (overrides managed proxy)
const session = await client.sessions.create({
  url: "https://example.com",
  proxy: "http://user:pass@proxy:8080",
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

List sessions by status: `"active"`, `"closed"`, or `"failed"`. Failed sessions ended because of a fatal error (e.g. blocked by a proxy or unsolvable challenge); use `get` to read `error_code` and `error_message`.

```typescript
const active = await client.sessions.list({ status: "active" });
const failed = await client.sessions.list({ status: "failed" });
const info = await client.sessions.get("ses_abc123");
if (info.status === "failed") {
  console.error(info.error_code, info.error_message);
}
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
