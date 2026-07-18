---
title: Languages
order: 6
---
# Languages

mxLocDoc supports multilingual documentation through language folders inside `mxlocdoc.docs_path`.

Example:

```text
docs/
├── en/
│   ├── _sidebar.json
│   └── README.md
└── ru/
    ├── _sidebar.json
    └── README.md
```

When more than one language folder is detected, the manager UI shows a language selector.

The default selected language is the manager language when a matching folder exists. If there is no matching folder, mxLocDoc selects the first available language.

If only one language exists, the selector is hidden.

