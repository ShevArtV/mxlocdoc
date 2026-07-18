# 07. Search

Status: partially done on 2026-07-18. Live filesystem search by title/path/body is implemented after stand feedback; cache/clear remains.

## Цель

Добавить быстрый поиск по Markdown-документации без DB-индекса в v1.

## Что сделать

- [x] Реализовать processor `search`.
- [x] Искать по title, headings, body и path.
- [x] Возвращать сниппеты результатов.
- [x] Сделать live-search в manager UI.
- Кешировать подготовленные данные в `core/cache/mxlocdoc` для v1.
- Добавить механизм cache clear.

## Куда именно

- Processor:
  - `core/components/mxlocdoc/processors/mgr/search.class.php`
- Services:
  - `core/components/mxlocdoc/services/searchindex.class.php`
  - `core/components/mxlocdoc/services/documentrepository.class.php`
  - `core/components/mxlocdoc/services/markdownrenderer.class.php`
- Будущий cache:
  - `core/cache/mxlocdoc/`
- Будущий UI:
  - `assets/components/mxlocdoc/js/mgr/mxlocdoc.js`
  - `core/components/mxlocdoc/templates/home.tpl`

## Зачем

Локальная документация полезна только если нужный раздел можно быстро найти. Для v1 достаточно filesystem scan + cache, чтобы не усложнять пакет таблицами и миграциями.

## Чеклист готовности

- Поиск можно отключить через `mxlocdoc.search_enabled`.
- Индекс строится по разрешенным `.md` файлам внутри `docs_path`.
- В результатах есть title, path и короткий snippet.
- Live-search не блокирует UI на небольших и средних наборах документации.
- Cache хранится в `core/cache/mxlocdoc`.
- Cache можно очистить из UI или processor-ом.

## Риски и ограничения

- Большие документационные деревья могут быть медленными без DB-индекса.
- Нужно уважать `mxlocdoc.max_file_size`, иначе поиск может читать слишком тяжелые файлы.
- Snippet не должен содержать опасный HTML; его нужно экранировать.
