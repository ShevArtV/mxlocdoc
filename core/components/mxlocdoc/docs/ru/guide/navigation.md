---
title: Навигация
order: 3
---
# Навигация

mxLocDoc использует manifest-файл для предсказуемой навигации.

По умолчанию читается `_sidebar.json`. Если его нет, проверяется `mxlocdoc.json`. Если manifest отсутствует, mxLocDoc строит fallback-дерево по Markdown-файлам.

## Пример manifest

```json
{
  "title": "Project Docs",
  "items": [
    {"title": "Обзор", "path": "README.md"},
    {"title": "Руководство", "path": "guide/README.md", "items": [
      {"title": "Установка", "path": "guide/setup.md"}
    ]}
  ]
}
```

Поля item:

- `title`: подпись в левой навигации.
- `path`: путь к Markdown-файлу относительно выбранного корня документации.
- `items`: вложенные пункты.
- `hidden`: `true`, чтобы скрыть пункт.

Все пути проходят проверку через тот же безопасный filesystem layer, что и запросы документов.

