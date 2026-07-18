# 06. Manager UI

## Цель

Сделать manager CMP похожим на внутренний docs-сайт: с навигацией, поиском, хлебными крошками, статьей и оглавлением.

## Что сделать

- Реализовать layout: sidebar, top search, breadcrumbs, article, headings/toc.
- Использовать vanilla JS/CSS без Vue, Node, Vite и отдельного build-step.
- Сделать responsive-поведение для узких экранов manager.
- Обработать длинные названия файлов, заголовков и путей без переполнений.
- Проверить UI в MODX manager через Chrome MCP/browser check.

## Куда именно

- Будущий manager controller:
  - `core/components/mxlocdoc/controllers/mgr/home.class.php`
  - `core/components/mxlocdoc/controllers/index.class.php`
- Будущий template:
  - `core/components/mxlocdoc/templates/mgr/home.tpl`
- Будущие assets:
  - `assets/components/mxlocdoc/js/mgr/mxlocdoc.js`
  - `assets/components/mxlocdoc/css/mgr/main.css`
- Будущие processors:
  - `core/components/mxlocdoc/processors/mgr/navigation/get.class.php`
  - `core/components/mxlocdoc/processors/mgr/document/get.class.php`
  - `core/components/mxlocdoc/processors/mgr/search.class.php`

## Зачем

Ценность пакета не в списке файлов, а в быстром чтении проектной документации из manager. Docs-like UI снижает трение для администраторов и разработчиков.

## Чеклист готовности

- Sidebar показывает manifest/fallback-навигацию.
- Top search доступен сразу после открытия CMP.
- Breadcrumbs отражают текущий путь документа.
- Article area корректно рендерит заголовки, списки, code blocks, таблицы и изображения.
- TOC строится по headings текущей статьи.
- Длинные строки и названия не ломают layout.
- UI проверен в manager через Chrome MCP/browser check.

## Риски и ограничения

- MODX 2 manager может иметь старые CSS/JS ограничения, поэтому UI должен быть простым и изолированным.
- Нельзя завязываться на npm build artifacts.
- Responsive нужен для manager viewport, но v1 не обязан быть полноценным публичным mobile docs-сайтом.
