# mxLocDoc

Lightweight MODX Revolution 2 extra for reading local Markdown documentation inside the MODX manager.

Current status: package skeleton with system settings, secure filesystem
services, Markdown navigation, safe Markdown rendering with protected asset
URLs, a vanilla JS/CSS manager docs UI, multilingual documentation roots,
cached filesystem live-search, and a built MODX 2 transport package.

User documentation is available in [`docs/`](docs/). The package also ships the
same documentation for the built-in MODX manager viewer.

## Core Decisions

- MODX 2 package.
- Built with `modxbuilder`.
- Manager UI as a lightweight CMP with vanilla JS/CSS.
- No VitePress, Node, Vue, Vite, or separate frontend build pipeline.
- Documentation root comes from the `mxlocdoc.docs_path` system setting; the default uses `[[+corePath]]components/mxlocdoc/docs/`.
- If the docs root contains language folders such as `en/` and `ru/`, the manager UI shows a language selector. The default selected language is the manager language when it exists.
- Navigation comes from `_sidebar.json` or `mxlocdoc.json`, with filesystem fallback.
- Markdown is rendered server-side with safe HTML handling.
- Relative Markdown images are served through a protected connector.
- Search scans `.md` files by title, path and body and caches the prepared index in `core/cache/mxlocdoc`.
- MODX manager cache clear also clears mxLocDoc cache through the `mxLocDocCacheClear` plugin on `OnBeforeCacheUpdate`.
- Markdown rendering uses vendored Parsedown in safe mode.

## Roadmap

The implementation plan is in [`roadmap/`](roadmap/):

- [`00-preparation.md`](roadmap/00-preparation.md) — done.
- [`01-package-skeleton.md`](roadmap/01-package-skeleton.md) — done.
- [`02-system-settings.md`](roadmap/02-system-settings.md) — done.
- [`03-secure-filesystem.md`](roadmap/03-secure-filesystem.md) — done.
- [`04-navigation.md`](roadmap/04-navigation.md) — done.
- [`05-markdown-assets.md`](roadmap/05-markdown-assets.md) — done.
- [`06-manager-ui.md`](roadmap/06-manager-ui.md) — done.
- [`07-search.md`](roadmap/07-search.md) — done.
- [`08-hostland-stand.md`](roadmap/08-hostland-stand.md) — done.
- [`09-release.md`](roadmap/09-release.md) — done; `0.1.0-pl` transport built.
- [`10-modx3-port.md`](roadmap/10-modx3-port.md) — planned.

## License

GNU GPL v2, same as miniShop2. See [`LICENSE`](LICENSE).
