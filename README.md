# mxLocDoc

Lightweight MODX Revolution 2 extra for reading local Markdown documentation inside the MODX manager.

Current status: package skeleton with system settings, secure filesystem
services, Markdown navigation, safe Markdown rendering with protected asset
URLs, and a vanilla JS/CSS manager docs UI. Full-text search is still a roadmap
item.

## Core Decisions

- MODX 2 package.
- Built with `modxbuilder`.
- Manager UI as a lightweight CMP with vanilla JS/CSS.
- No VitePress, Node, Vue, Vite, or separate frontend build pipeline.
- Documentation root comes from the `mxlocdoc.docs_path` system setting.
- Navigation comes from `_sidebar.json` or `mxlocdoc.json`, with filesystem fallback.
- Markdown is rendered server-side with safe HTML handling.
- Relative Markdown images are served through a protected connector.
- Search scans `.md` files and may use cache in v1.
- Markdown rendering uses vendored Parsedown in safe mode.

## Roadmap

The implementation plan is in [`roadmap/`](roadmap/):

- [`00-preparation.md`](roadmap/00-preparation.md) — done.
- [`01-package-skeleton.md`](roadmap/01-package-skeleton.md) — done.
- [`02-system-settings.md`](roadmap/02-system-settings.md) — done.
- [`03-secure-filesystem.md`](roadmap/03-secure-filesystem.md) — done.
- [`04-navigation.md`](roadmap/04-navigation.md) — done.
- [`05-markdown-assets.md`](roadmap/05-markdown-assets.md) — done.
- [`06-manager-ui.md`](roadmap/06-manager-ui.md) — done locally; live manager browser check is deferred to Hostland stand.
- [`07-search.md`](roadmap/07-search.md) — next.

## License

License will be defined before the first package release.
