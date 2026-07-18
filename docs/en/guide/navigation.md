---
title: Navigation
order: 3
---
# Navigation

mxLocDoc uses a manifest file for predictable navigation.

By default it looks for `_sidebar.json`. If that file is missing, it also checks `mxlocdoc.json`. If no manifest exists, mxLocDoc builds a fallback tree from Markdown files.

## Manifest example

```json
{
  "title": "Project Docs",
  "items": [
    {"title": "Overview", "path": "README.md"},
    {"title": "Guide", "path": "guide/README.md", "items": [
      {"title": "Setup", "path": "guide/setup.md"}
    ]}
  ]
}
```

Each item can contain:

- `title`: visible label in the left navigation.
- `path`: Markdown file path relative to the selected docs root.
- `items`: nested child items.
- `hidden`: `true` to omit the item.

Paths are validated through the same safe filesystem layer as document requests.

