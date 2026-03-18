# Obsidian LikeC4

Render [LikeC4](https://likec4.dev) architecture diagrams inline within your Obsidian notes. Write architecture-as-code in fenced code blocks and see interactive diagrams in Reading view.

> **Desktop only** — this plugin uses WebAssembly for Graphviz layout, which requires Obsidian's Electron environment.

## Usage

Create a fenced code block with the `likec4` language identifier:

````markdown
```likec4
specification {
  element system
  element user
}

model {
  customer = user 'Customer'
  cloud = system 'Cloud System'
  customer -> cloud 'Uses'
}

views {
  view index {
    include *
  }
}
```
````

Switch to **Reading view** to see the rendered diagram.

### Code block options

You can pass options on the first line of the code block:

````markdown
```likec4 view=myView height=500
specification { ... }
model { ... }
views {
  view myView { include * }
  view another { include * }
}
```
````

| Option   | Description                          | Default |
|----------|--------------------------------------|---------|
| `view`   | Which view to render (by ID)         | First view |
| `height` | Diagram height in pixels             | 400     |

## Installation

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/your-username/obsidian-likec4/releases)
2. Create a folder `obsidian-likec4` in your vault's `.obsidian/plugins/` directory
3. Copy `main.js` and `manifest.json` into that folder
4. Restart Obsidian and enable the plugin in Settings → Community Plugins

### BRAT

1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this repository URL in BRAT settings
3. Enable "LikeC4 Diagrams" in Community Plugins

## Features

- **Inline rendering** — LikeC4 diagrams render directly in your notes
- **Interactive** — Click diagrams to open a full browser overlay with zoom, pan, and navigation
- **Self-contained** — Each code block is an independent model (no external files needed)
- **Dark/light theme** — Automatically adapts to your Obsidian theme
- **Full LikeC4 DSL** — Supports the complete LikeC4 specification including elements, relationships, views, styles, and more

## LikeC4 DSL Reference

For the full DSL syntax and features, see the [LikeC4 documentation](https://likec4.dev/dsl/).

### Quick example with styling

````markdown
```likec4
specification {
  element actor {
    style {
      shape person
      color green
    }
  }
  element system {
    style {
      color blue
    }
  }
  element database {
    style {
      shape storage
      color amber
    }
  }
}

model {
  user = actor 'User'
  webapp = system 'Web Application'
  db = database 'PostgreSQL'

  user -> webapp 'Browses'
  webapp -> db 'Reads/Writes'
}

views {
  view landscape {
    title 'System Landscape'
    include *
  }
}
```
````

## Limitations

- **Desktop only** — not compatible with Obsidian mobile
- **Per-block models** — each code block is self-contained; cross-note model sharing is not yet supported
- **Reading view only** — diagrams render in Reading view, not in Live Preview / Edit mode
- **Bundle size** — the plugin is ~4.5MB due to bundling the LikeC4 parser, Graphviz WASM, and React

## Credits

- [LikeC4](https://likec4.dev) — Architecture as Code toolchain by Denis Davydkov
- Built with `@likec4/language-services`, `@likec4/diagram`, and `@likec4/core`

## License

MIT
