# 03. Secure Filesystem

## Цель

Спроектировать безопасный слой доступа к локальной документации, чтобы manager UI не мог читать файлы за пределами `mxlocdoc.docs_path`.

## Что сделать

- Реализовать `PathResolver` для нормализации и проверки путей.
- Реализовать `DocumentRepository` для чтения `.md` файлов.
- Реализовать `AssetRepository` для отдачи картинок и разрешенных ассетов.
- Использовать `realpath` для корня документации и каждого запрошенного файла.
- Запретить выход за `docs_path`.
- Ограничить расширения `.md` и asset-файлов whitelist-ом.
- Проверять max size до чтения файла.
- Возвращать понятные ошибки для manager UI.

## Куда именно

- Будущие сервисы:
  - `core/components/mxlocdoc/services/PathResolver.php`
  - `core/components/mxlocdoc/services/DocumentRepository.php`
  - `core/components/mxlocdoc/services/AssetRepository.php`
- Будущие processors:
  - `core/components/mxlocdoc/processors/mgr/document/get.class.php`
  - `core/components/mxlocdoc/processors/mgr/asset/get.class.php`
- Будущий HTTP entrypoint:
  - `assets/components/mxlocdoc/connector.php`

## Зачем

Пакет работает с локальной файловой системой из manager. Без строгой нормализации путей он может превратиться в произвольное чтение файлов сайта.

## Чеклист готовности

- Любой относительный путь приводится к `realpath`.
- Итоговый путь обязан начинаться с `realpath(mxlocdoc.docs_path)`.
- `.md` читаются только через `DocumentRepository`.
- Картинки и ассеты читаются только через `AssetRepository`.
- Файлы больше `mxlocdoc.max_file_size` не читаются.
- Ошибки различают: не задан `docs_path`, файл не найден, запрещенное расширение, выход за корень, файл слишком большой.

## Риски и ограничения

- Симлинки внутри документации допустимы только если после `realpath` остаются внутри `docs_path`.
- Нельзя доверять путям из query string или manifest.
- Ошибки не должны раскрывать лишние системные пути за пределами разрешенной папки.
