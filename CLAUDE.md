# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Reportr** is a self-serve data analytics and publishing platform. Teams connect to data sources, build datasets and visualisations, and publish findings as dashboards, reports, or scroll-driven data stories called **Scrollytellers** — without writing code.

This directory contains static HTML/CSS/JS wireframes (v1.0, wireframe-complete). There is no build system — open files directly in a browser. The functional spec is at `../Reportr-Functional-Spec.docx`.

### User Roles
- **Admin** — build, publish, manage team
- **Editor** — build and publish
- **Viewer** — view only (read-only, no builder access)

## Architecture

### Shared files (used by all pages)
- `styles.css` — complete design system: CSS custom properties (tokens), layout, all reusable component styles (buttons, cards, forms, panels, badges, tables, etc.)
- `nav.js` — renders the sidebar via `buildSidebar(activeId)`. Call this at `DOMContentLoaded` with the page's nav ID as the argument.

### Per-page pattern
Each section is a pair: `{page}.html` + `{page}.js`. The HTML sets up structure and includes the scripts; the JS handles all state and interactivity.

| Page | Nav ID | Files |
|------|--------|-------|
| Connections | `connections` | `index.html`, `connection-manager.js` |
| Dataset Builder | `datasets` | `dataset-builder.html`, `dataset-builder.js` |
| Visualisation Builder | `visualisations` | `visualisation-builder.html`, `visualisation-builder.js` |
| Dashboard Builder | `dashboards` | `dashboard-builder.html`, `dashboard-builder.js` |
| Scrollyteller Builder | `scrollytellers` | `scrollyteller-builder.html`, `scrollyteller-builder.js` |
| Published | `published` | `published.html`, `published.js` |

Nav items for `themes.html`, `settings.html`, and `team.html` exist in `nav.js` but those pages have not been created yet (see §10 of the spec for their intended scope).

### Connection types supported
Vertica, PostgreSQL, MySQL, ClickHouse, Snowflake, BigQuery — wireframed. **CSV Upload** and **REST API** are in the spec (§4.2) but not yet in the wireframes.

### External CDN dependencies
- **Lucide icons** — `lucide.createIcons()` must be called after injecting any HTML containing `<i data-lucide="...">` elements
- **Chart.js** — used in the Dashboard Builder
- **CodeMirror 5** (with Dracula theme) — used in the Dataset Builder for the SQL editor

### Design tokens
All colours, spacing, typography, shadows, and motion values are defined as CSS custom properties on `:root` in `styles.css`. Use these tokens rather than raw values when adding new styles.

Key accent colours:
- `--accent` / `--accent-hover` — primary action green (`#16A34A`)
- `--blue-ui` — publish/user-related actions
- Semantic: `--green`, `--red`, `--amber`, `--purple`, `--teal`

### Slide panels
Right-side slide panels follow the `.panel` / `.overlay` pattern defined in `styles.css`. Toggle `.open` on both elements to show/hide. Panel structure: `.panel-header`, `.panel-body` (scrollable), `.panel-footer`.

---

## Key Data Models (from functional spec)

### Story (Scrollyteller)
```
{ id, title, subtitle, theme: "green"|"blue"|"purple"|"amber", font: "inter"|"georgia"|"mono", sections: Section[] }
```

### Section
```
{ id, layout: "cover"|"split-left"|"split-right"|"fullbleed"|"callout"|"text-only",
  label, mechanic: "step"|"continuous",
  stickyBlocks: StickyBlock[], blocks: Block[], steps: Step[],
  background: Background, cards: Card[] }
```

### StickyBlock / Block (scroll column element)
```
{ id, type: "chart"|"image"|"video"|"control"|"heading"|"body"|"stat"|"eyebrow"|"callout-card"|"divider",
  chartType, chartTitle, dataset, height,
  controlType: "dropdown"|"slider"|"checkbox", content, options[], min, max, value }
```

### Step
```
{ id, label, highlight: string[], annotation }
```

### Published Item
```
{ id, type: "dashboard"|"report"|"scrollyteller", title, description,
  access: "public"|"embed"|"password"|"private", slug, publishedDate, updatedDate,
  views, embeds, isArchived, href, datasets: string[] }
```

Published URL format: `reportr.app/p/[slug]`
Embed URL format: `reportr.app/embed/[slug]`
Story URL format: `reportr.app/s/[slug]`

---

## Scrollyteller Section Layout Types

| Layout | Sticky column | Scroll column | Steps |
|--------|--------------|---------------|-------|
| `cover` | None | Eyebrow, headline, sub-heading | No |
| `split-left` | Left ~45% — charts, images, controls | Right ~55% — text blocks | Yes |
| `split-right` | Right ~55% | Left ~45% | Yes |
| `fullbleed` | Full-width sticky background (chart/image/video/colour) | Frosted glass overlay cards | Yes (one per card) |
| `callout` | None | Large stat, heading, body — centred | No |
| `text-only` | None | Full-width text blocks | No |

Scroll mechanics (split layouts only):
- **Step-based** — chart updates discretely at predefined scroll positions via `IntersectionObserver` at threshold 0.5
- **Continuous** — chart responds proportionally to scroll position

---

## Publishing Flow

1. User clicks Publish → settings panel (title, access type, optional password, optional slug)
2. Item renders to `reportr.app/p/[slug]` and appears in the Published inventory
3. Updating re-renders at the same URL — existing embeds pick up changes automatically
4. Unpublishing removes public access immediately; archiving hides from inventory but keeps public access live

Embed snippet format:
```html
<iframe src="https://reportr.app/embed/[slug]" width="100%" height="600" frameborder="0" allowfullscreen></iframe>
```
Scrollyteller embeds require `scrolling="yes"` and minimum height 600px.

---

## Planned Screens (not yet wireframed)

- **Themes** (`themes.html`) — brand kits with primary/secondary colour, font, logo, background. Selectable at publish time.
- **Settings** (`settings.html`) — workspace name/logo, custom domain, API keys, data refresh defaults, notification preferences, danger zone.
- **Team** (`team.html`) — member list, invite by email, role assignment (Admin/Editor/Viewer), remove member, pending invites.
