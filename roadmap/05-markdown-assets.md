# 05. Markdown Assets

## Цель

Безопасно отрисовать Markdown-документацию и корректно показать относительные картинки внутри MODX manager.

## Что сделать

- Выбрать безопасный Markdown renderer для PHP 7.4 / MODX 2.
- Отключить raw HTML или пропускать его через sanitizer.
- Поддержать относительные ссылки между `.md` файлами.
- Переписать изображения вида `![alt](./images/a.png)` на protected connector URL.
- Применить whitelist расширений asset-файлов.
- Обработать ошибки отсутствующих изображений без падения статьи.

## Куда именно

- Будущий renderer:
  - `core/components/mxlocdoc/services/MarkdownRenderer.php`
- Будущий asset service:
  - `core/components/mxlocdoc/services/AssetRepository.php`
- Будущий processor/connector:
  - `core/components/mxlocdoc/processors/mgr/document/get.class.php`
  - `core/components/mxlocdoc/processors/mgr/asset/get.class.php`
  - `assets/components/mxlocdoc/connector.php`
- Будущие manager templates/assets:
  - `core/components/mxlocdoc/templates/mgr/home.tpl`
  - `assets/components/mxlocdoc/js/mgr/`
  - `assets/components/mxlocdoc/css/mgr/`

## Зачем

Markdown должен быть удобен для разработчиков, но manager UI не должен выполнять произвольный HTML или отдавать произвольные файлы с диска.

## Чеклист готовности

- `.md` файл рендерится в HTML статьи.
- Raw HTML отключен или санитизирован.
- Ссылки на другие `.md` открывают документ внутри CMP без перезагрузки manager.
- Картинки отдаются через connector после проверки пути и расширения.
- Поддерживаются только расширения из `mxlocdoc.allowed_asset_extensions`, например `png,jpg,jpeg,gif,svg,webp`.
- Ошибки asset-загрузки видны в UI и логируются без раскрытия лишних путей.

## Риски и ограничения

- SVG может содержать активный контент; если whitelist включает `svg`, нужна отдельная политика санитизации или строгая отдача как файл без inline-вставки.
- Markdown renderer не должен требовать Node или frontend build.
- Ссылки на внешние URL надо отличать от локальных путей и не прокидывать через filesystem layer.
