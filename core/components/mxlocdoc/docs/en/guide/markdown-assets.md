---
title: Markdown and assets
order: 4
---
# Markdown and assets

Markdown is rendered server-side with Parsedown safe mode enabled. Raw HTML is escaped by the renderer.

## Links

Relative links to Markdown files open inside the mxLocDoc manager UI:

```markdown
[Setup](guide/setup.md)
```

External links remain normal browser links.

## Images and assets

Relative images are served through the protected connector:

```markdown
![Diagram](images/diagram.svg)
```

mxLocDoc validates the asset path, extension and file size before streaming the file. The request must stay inside the configured documentation root.

