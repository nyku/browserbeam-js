# Changelog

All notable changes to the `@browserbeam/sdk` TypeScript SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-03-27

### Added

- `Form` interface and export: `ref`, `id`, `action`, `method`, and `fields` (array of interactive element refs) aligned with the API’s enriched forms.
- `InteractiveElement`: optional `in` (landmark), `near` (heading / section label), and `form` (parent form ref).

### Changed

- `PageState.forms` is now `Form[]` instead of `Record<string, unknown>[]`, matching the live API response shape.

## [0.2.0] - 2026-03-25

### Added

- `goto`: `wait_until` option for JavaScript-based wait conditions
- `fill`, `type`, `select`, `check`: `text` option for element targeting by visible text
- `scroll`: `text` and `label` options for element targeting
- `wait`: `until` option for JavaScript-based wait conditions
- `upload`: `text` and `label` options for element targeting; new `UploadOptions` interface
- `executeJs`: `result_key` and `timeout` options; new `ExecuteJsOptions` interface
- `pdf`: `scale` and `margin` options

### Changed

- `upload` method signature changed from `upload(ref, files)` to `upload(opts: UploadOptions)` — **breaking change**
- `executeJs` parameter renamed from `expression` to `code` — **breaking change**

## [0.1.0] - 2026-03-24

### Added

- Initial release
- Full TypeScript support with exported types for all options and responses
- Session management: `create`, `list`, `get`, `destroy`
- Navigation: `goto` with `wait_for` and `wait_timeout` (accepts string URL or `GotoOptions`)
- Page observation: `observe` with `scope`, `format`, `include_links`, `max_text_length`
- Interactions: `click`, `fill`, `fillForm`
- Data extraction: `extract` with schema-based selectors
- Media: `screenshot`, `pdf`
- Scrolling: `scroll`, `scrollCollect`
- Waiting: `wait` with `ms`, `selector`, `text`, `timeout`
- Session lifecycle: `close`
- Dual format output: CJS and ESM builds with full `.d.ts` type declarations

[0.3.0]: https://github.com/nyku/browserbeam-js/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nyku/browserbeam-js/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nyku/browserbeam-js/releases/tag/v0.1.0
