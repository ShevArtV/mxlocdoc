# mxLocDoc

Lightweight MODX Revolution 2 extra for reading local Markdown documentation inside the MODX manager.

Current status: roadmap stage. Package source code has not been scaffolded yet.

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

## Roadmap

The implementation plan is in [`roadmap/`](roadmap/):

- [`00-preparation.md`](roadmap/00-preparation.md) — done.
- [`01-package-skeleton.md`](roadmap/01-package-skeleton.md) — next.

## License

License will be defined before the first package release.
