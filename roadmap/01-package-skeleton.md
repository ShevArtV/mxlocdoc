# 01. Package Skeleton

## Цель

Описать будущий минимальный каркас MODX 2 transport-пакета mxLocDoc без создания кода на этапе roadmap.

## Что сделать

- Создать будущую структуру `core/components/mxlocdoc/`.
- Создать будущую структуру `assets/components/mxlocdoc/`.
- Создать будущую структуру `modxbuilder/mxlocdoc/`.
- Добавить namespace, manager menu, lexicon, docs, readme, changelog и license.
- Настроить сборку через `modxbuilder`.

## Куда именно

- Будущий core-код:
  - `core/components/mxlocdoc/controllers/`
  - `core/components/mxlocdoc/processors/`
  - `core/components/mxlocdoc/model/`
  - `core/components/mxlocdoc/services/`
  - `core/components/mxlocdoc/templates/`
  - `core/components/mxlocdoc/lexicon/ru/`
  - `core/components/mxlocdoc/docs/readme.txt`
  - `core/components/mxlocdoc/docs/changelog.txt`
  - `core/components/mxlocdoc/docs/license.txt`
- Будущие assets:
  - `assets/components/mxlocdoc/connector.php`
  - `assets/components/mxlocdoc/js/mgr/`
  - `assets/components/mxlocdoc/css/mgr/`
- Будущий builder:
  - `modxbuilder/mxlocdoc/build/build.package.php`
  - `modxbuilder/mxlocdoc/build/config/config.inc.php`
  - `modxbuilder/mxlocdoc/build/data/transport.settings.php`
  - `modxbuilder/mxlocdoc/build/data/transport.menu.php`
  - `modxbuilder/mxlocdoc/build/resolvers/resolvers.php`

## Зачем

Transport-пакет должен ставиться штатно через MODX package manager, регистрировать namespace и menu, приносить системные настройки и manager UI без ручного копирования файлов.

## Чеклист готовности

- Namespace `mxlocdoc` зарегистрирован на `{core_path}components/mxlocdoc/`.
- В manager menu есть пункт входа в CMP.
- Лексиконы вынесены в `lexicon/ru/`.
- `docs/readme.txt`, `docs/changelog.txt`, `docs/license.txt` попадают в package attributes.
- Builder собирает transport из `modxbuilder/mxlocdoc/build/`.

## Риски и ограничения

- На этом этапе не нужна xPDO-схема, если v1 не хранит поисковый индекс в БД.
- Нельзя заводить Node/Vite pipeline: UI должен работать как обычные manager assets.
- Нельзя забыть `assets/components/mxlocdoc/connector.php`, потому что через него пойдут Markdown assets и AJAX-процессоры.
