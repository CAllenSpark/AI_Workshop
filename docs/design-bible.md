# Design Bible — Writer's Research Companion

**Version:** 2.0
**Owner:** Designer, UI/UX
**Last updated:** 2026-03-03

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Grid](#4-spacing--grid)
5. [Component Specifications](#5-component-specifications)
6. [Iconography](#6-iconography)
7. [Responsive Behavior](#7-responsive-behavior)
8. [ASCII Wireframe](#8-ascii-wireframe)
9. [Fantasy Layer System](#9-fantasy-layer-system)
10. [Regional Context Layers](#10-regional-context-layers)
11. [Fantasy Entry Dialog](#11-fantasy-entry-dialog)

---

## 1. Design Principles

Every design decision in the Writer's Research Companion is governed by four principles. When conflicts arise, they are resolved in the order listed.

### Minimal

Every element must earn its place on screen. If a component does not directly support the user's current task — exploring, filtering, or reading — it is removed or hidden behind a deliberate interaction. Chrome is reduced to the bare minimum. White space is a structural element, not leftover room.

### Layered

The knowledge base contains four distinct data categories: events, people, places, and environment. These layers must be visually distinguishable at a glance through consistent use of color, iconography, and spatial grouping. Each layer can be toggled independently, allowing the user to focus on exactly the dimension of research they need.

### Temporal

Time is the primary navigation axis. The timeline is not a secondary widget — it is the central organizing structure of the entire interface. All data is anchored to temporal coordinates first, with spatial and categorical dimensions as secondary facets. The interface should make it effortless to scrub through centuries, zoom into decades, and jump between eras.

### Grounded

The visual language evokes the Pacific Northwest setting — muted greens, slate water tones, weathered warmth — without becoming decorative or themed to the point of distraction. The aesthetic should feel like a well-made field notebook: purposeful, quiet, and respectful of the content it holds.

---

## 2. Color Palette

The palette draws from the natural landscape of Vashon Island and the broader Puget Sound region: conifer forests, gray-blue water, weathered wood, and the warm amber light of Pacific Northwest evenings.

### Core Colors

| Role        | Name            | Hex       | Usage                                      |
|-------------|-----------------|-----------|---------------------------------------------|
| Primary     | Forest Green    | `#2D5F3E` | Primary actions, active states, key UI elements |
| Secondary   | Slate Blue      | `#4A6D8C` | Secondary actions, supporting UI, links      |
| Accent      | Warm Amber      | `#C8913A` | Highlights, calls to action, selected states |
| Background  | Parchment       | `#F5F0E8` | Page background, default surface             |
| Surface     | Soft Gray       | `#E8E4DD` | Cards, panels, elevated containers           |
| Text Primary| Charcoal        | `#2C2C2C` | Body text, headings                          |
| Text Secondary | Warm Gray    | `#6B6560` | Captions, metadata, muted labels             |
| Border      | Stone           | `#D1CCC4` | Dividers, card borders, subtle separators    |

### Layer Colors

Each data layer has a dedicated color used consistently across timeline markers, card borders, badges, and filter chips.

| Layer       | Name            | Hex       | Light Variant (bg) | Usage                        |
|-------------|-----------------|-----------|---------------------|-------------------------------|
| Events      | Amber           | `#C8913A` | `#FBF3E4`           | Historical events, milestones |
| People      | Teal            | `#3A8C8C` | `#E4F3F3`           | Individuals, groups, families |
| Places      | Forest Green    | `#2D5F3E` | `#E4F0E8`           | Locations, landmarks, routes  |
| Environment | Earth Brown     | `#8C6B4A` | `#F0EBE4`           | Climate, geology, ecology     |

### Semantic Colors

| Role        | Hex       | Usage                              |
|-------------|-----------|-------------------------------------|
| Error       | `#B84233` | Validation errors, destructive actions |
| Warning     | `#C8913A` | Cautions, approximate data indicators  |
| Success     | `#3E7A4F` | Confirmations, save states             |
| Info        | `#4A6D8C` | Informational callouts, tooltips       |

### Dark Surfaces

For the detail panel and overlays where a darker treatment aids focus:

| Role            | Hex       | Usage                              |
|-----------------|-----------|-------------------------------------|
| Panel BG        | `#3A3835` | Detail panel background              |
| Panel Surface   | `#4A4744` | Cards within dark panel              |
| Panel Text      | `#F5F0E8` | Text on dark surfaces                |
| Panel Text Muted| `#A8A29E` | Secondary text on dark surfaces      |

---

## 3. Typography

### Font Stack

| Role    | Font Family                     | Fallback Stack                          | Weight(s)     |
|---------|----------------------------------|-----------------------------------------|---------------|
| Heading | **Merriweather**                | Georgia, "Times New Roman", serif       | 400, 700      |
| Body    | **Inter**                       | -apple-system, "Segoe UI", sans-serif   | 400, 500, 600 |
| Mono    | **JetBrains Mono**              | "Cascadia Code", "Fira Code", monospace | 400           |

**Rationale:** Merriweather provides a warm, readable serif with strong screen rendering — appropriate for a research tool that handles long-form text. Inter is one of the most legible UI sans-serifs available, with clear character differentiation at small sizes. JetBrains Mono ensures dates and data labels are visually crisp and evenly spaced.

### Type Scale

The scale uses a 1.25 ratio (Major Third) anchored to a 16px base.

| Level       | Size   | Line Height | Weight | Font     | Letter Spacing | Usage                        |
|-------------|--------|-------------|--------|----------|----------------|-------------------------------|
| H1          | 32px   | 40px (1.25) | 700    | Heading  | -0.02em        | Page title                    |
| H2          | 26px   | 34px (1.31) | 700    | Heading  | -0.01em        | Section title                 |
| H3          | 20px   | 28px (1.40) | 700    | Heading  | 0              | Subsection title              |
| H4          | 16px   | 24px (1.50) | 600    | Body     | 0.01em         | Card title, group label       |
| Body        | 16px   | 26px (1.625)| 400    | Body     | 0              | Paragraph text, descriptions  |
| Body Small  | 14px   | 22px (1.57) | 400    | Body     | 0              | Secondary text, card body     |
| Caption     | 12px   | 18px (1.50) | 500    | Body     | 0.02em         | Labels, metadata, badges      |
| Data Label  | 13px   | 18px (1.38) | 400    | Mono     | 0.04em         | Dates, coordinates, IDs       |
| Overline    | 11px   | 16px (1.45) | 600    | Body     | 0.08em         | Era labels, category headers (uppercase) |

### Typographic Guidelines

- **Paragraph max-width:** 65ch (approximately 600px) for comfortable reading.
- **Heading margin:** Always use at least 24px above headings and 8px below to create clear visual hierarchy.
- **No underlines** except for hyperlinks.
- **Tabular numerals** (font-feature-settings: "tnum") should be enabled for all date and numeric columns to ensure vertical alignment.

---

## 4. Spacing & Grid

### Base Unit

All spacing is derived from an **8px base unit**. Sub-unit values (4px) are permitted only for fine optical adjustments such as icon alignment or badge padding.

### Spacing Scale

| Token    | Value | Usage                                              |
|----------|-------|----------------------------------------------------|
| `xs`     | 4px   | Inner padding of badges, icon-to-label gap          |
| `sm`     | 8px   | Tight padding, gap between related elements         |
| `md`     | 12px  | Card internal padding (compact), input padding      |
| `base`   | 16px  | Standard card padding, gap between stacked elements |
| `lg`     | 24px  | Section spacing, gap between card groups            |
| `xl`     | 32px  | Major section breaks, panel padding                 |
| `2xl`    | 48px  | Page section separation                             |
| `3xl`    | 64px  | Top/bottom page margins, hero spacing               |

### Grid System

**Desktop (1024px and above):**

- 12-column grid
- Column gap: 24px
- Outer margin: 32px (capped at content max-width)
- Content max-width: **1280px**
- Detail panel width: 4 columns (fixed right)
- Main content area: 8 columns (when detail panel is open), 12 columns (when closed)

**Tablet (768px–1023px):**

- 8-column grid
- Column gap: 16px
- Outer margin: 24px

**Mobile (below 768px):**

- 4-column grid
- Column gap: 16px
- Outer margin: 16px

### Breakpoints

| Name     | Min Width | Max Width | Columns | Behavior                              |
|----------|-----------|-----------|---------|----------------------------------------|
| Mobile   | 0         | 767px     | 4       | Stacked layout, bottom sheet detail    |
| Tablet   | 768px     | 1023px    | 8       | Timeline + collapsible overlay panel   |
| Desktop  | 1024px    | 1439px    | 12      | Full layout with side panel            |
| Wide     | 1440px    | —         | 12      | Centered content, wider timeline track |

---

## 5. Component Specifications

### 5.1 Timeline Track

The timeline is the central navigation element of the application. It occupies the full width of the main content area and provides the primary means of temporal exploration.

#### Structure

```
[Zoom Controls] [Era Quick-Select Buttons                    ] [Density Toggle]
┌──────────────────────────────────────────────────────────────────────────────┐
│  Era Label         Era Label              Era Label            Era Label     │
│  ├────────────────┼───────────────────────┼────────────────────┤            │
│  ●  ●    ● ●●     ▲  ●         ●  ▲  ●   ●●  ●   ●     ●    ▲            │
│                          ▼ (playhead)                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│  ░░░░░░░░█████░░░░░███░░░░░░░░░░░░░░████████░░░░░░░██░░░░░░░░░░           │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Specifications

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Track height            | 120px (96px markers area + 24px density strip)       |
| Background              | `Surface (#E8E4DD)`                                  |
| Border                  | 1px `Border (#D1CCC4)`, border-radius 8px            |
| Era dividers            | 1px dashed `Border (#D1CCC4)`, full track height     |
| Era labels              | Overline style, positioned above dividers             |
| Scroll behavior         | Horizontal scroll with momentum, drag-to-pan          |
| Playhead                | 2px wide, `Accent (#C8913A)`, triangular handle 12px  |
| Playhead interaction    | Drag horizontally, click-to-position on track         |

#### Entry Markers

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Shape                   | Circle (point events), horizontal bar (span events)  |
| Size                    | 10px diameter (circle), 10px height (bar)            |
| Color                   | Layer color at 100% opacity                          |
| Hover state             | Scale 1.4x, tooltip with title and date              |
| Selected state          | Scale 1.6x, white 2px ring, drop shadow              |
| Cluster indicator       | Stacked circles with count badge when markers overlap |

#### Density Indicator

A miniature heatmap strip at the bottom of the timeline track showing data density across the full time range.

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Height                  | 24px                                                 |
| Empty                   | `Background (#F5F0E8)`                               |
| Low density             | Layer color at 20% opacity                           |
| Medium density          | Layer color at 50% opacity                           |
| High density            | Layer color at 80% opacity                           |
| Segment width           | Proportional to zoom level, minimum 4px              |

#### Zoom Controls

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Position                | Top-left of timeline region                          |
| Controls                | Zoom in (+), zoom out (-), fit-all button            |
| Button size             | 32px square, border-radius 6px                       |
| Zoom range              | Full range (all eras) to single-decade view           |
| Zoom interaction        | Scroll wheel on timeline, pinch on touch devices     |

---

### 5.2 Data Cards

Data cards are the primary content containers. They appear in a scrollable region below the timeline and display entries relevant to the current viewport or selection.

#### Compact Entry Card

```
┌─────────────────────────────────────────┐
│▌ Title of Entry                    [icon]│
│▌ c. 1890 · Events                        │
│▌ Brief one-line description of the       │
│▌ entry content, truncated if needed...   │
└─────────────────────────────────────────┘
```

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Width                   | Fill column (min 280px, max 400px in grid)           |
| Padding                 | 16px                                                 |
| Background              | White `#FFFFFF`                                      |
| Border                  | 1px `Border (#D1CCC4)`                               |
| Border-radius           | 8px                                                  |
| Left indicator          | 4px wide bar, full card height, layer color          |
| Title                   | H4 style (16px, 600 weight, Body font)               |
| Date                    | Data Label style (13px, Mono font, `Warm Gray`)      |
| Layer badge             | Caption style, layer color text, layer light bg      |
| Description             | Body Small (14px), max 2 lines, ellipsis overflow    |
| Hover state             | Elevation: `0 2px 8px rgba(0,0,0,0.08)`             |
| Selected state          | Border changes to layer color, 2px width             |
| Click action            | Opens expanded detail in the detail panel            |

#### Expanded Detail Card (Detail Panel)

Displayed in the right-side detail panel when a card is selected.

```
┌───────────────────────────────────────┐
│  [x close]                            │
│                                       │
│  ▌ EVENT                              │
│  Title of Entry                       │
│  c. 1890 – c. 1895                    │
│                                       │
│  ─────────────────────────────────    │
│                                       │
│  Full multi-paragraph description     │
│  of the entry with all available      │
│  detail and context provided by the   │
│  research layer.                      │
│                                       │
│  ─────────────────────────────────    │
│                                       │
│  SOURCES                              │
│  1. Primary source citation           │
│  2. Secondary source citation         │
│                                       │
│  ─────────────────────────────────    │
│                                       │
│  CROSS-REFERENCES                     │
│  [card] Related Person Entry          │
│  [card] Related Place Entry           │
│                                       │
└───────────────────────────────────────┘
```

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Panel width             | 400px (desktop), full-width sheet (mobile)           |
| Background              | `Panel BG (#3A3835)` or `White (#FFFFFF)` (user pref)|
| Padding                 | 32px                                                 |
| Close button            | 32px, top-right, icon-only                           |
| Layer overline          | Overline style, layer color, uppercase               |
| Title                   | H2 style (26px, Merriweather, 700)                   |
| Date range              | Data Label style                                     |
| Description             | Body style (16px, 1.625 line-height)                 |
| Section dividers        | 1px `Border`, 24px margin above and below            |
| Source list             | Numbered, Body Small, links styled in `Slate Blue`   |
| Cross-reference chips   | Compact cards with layer indicator, clickable         |
| Entry animation         | Slide in from right, 200ms ease-out                  |
| Exit animation          | Slide out to right, 150ms ease-in                    |

---

### 5.3 Filter Controls

Filters occupy a horizontal bar above the timeline track. They allow the user to control which layers are visible, constrain the date range, and search across all entries.

#### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Search...           🔍]   [Events ●] [People ●] [Places ●] [Env ●]  │
│  [Prehistory] [Indigenous] [Pioneer] [Modern] [All]    Date: [===●==]  │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Search Input

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Width                   | 280px (desktop), full-width (mobile)                 |
| Height                  | 40px                                                 |
| Background              | White `#FFFFFF`                                      |
| Border                  | 1px `Border (#D1CCC4)`, border-radius 8px            |
| Placeholder             | "Search entries..." in `Warm Gray`                   |
| Icon                    | Search icon, 16px, right-aligned inside input        |
| Type-ahead              | Dropdown appears after 2 characters, max 8 results   |
| Type-ahead item         | Title + date + layer badge, highlight matching text  |

#### Layer Toggle Chips

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Height                  | 32px                                                 |
| Padding                 | 4px 12px                                             |
| Border-radius           | 16px (pill shape)                                    |
| Active state            | Layer color background at 15%, layer color text, layer color dot (8px) |
| Inactive state          | `Surface (#E8E4DD)` background, `Warm Gray` text     |
| Transition              | Background color 150ms ease                          |
| Interaction             | Click to toggle on/off                               |

#### Era Quick-Select Buttons

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Style                   | Text buttons, Body Small (14px), 500 weight          |
| Active state            | `Accent (#C8913A)` underline, `Charcoal` text        |
| Inactive state          | `Warm Gray` text, no underline                       |
| Interaction             | Click to snap timeline to era boundaries             |
| Eras (Vashon prototype) | Prehistory, Indigenous, Pioneer, Modern, All         |

#### Date Range Slider

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Track height            | 4px, border-radius 2px                               |
| Track color             | `Border (#D1CCC4)`                                   |
| Active range color      | `Accent (#C8913A)`                                   |
| Handle size             | 16px circle, white fill, 2px `Accent` border         |
| Handles                 | Two (start and end), draggable                       |
| Labels                  | Data Label style below each handle, showing date     |

---

### 5.4 Information Architecture

#### Visual Layering on the Timeline

When multiple layers are active, their markers occupy distinct vertical lanes within the timeline track to prevent occlusion:

```
  Era Label              Era Label
  ├─────────────────────┤
  ● ●    ●              ●        ← Events (top lane)
     ▲        ▲    ▲             ← People (second lane)
  ■       ■              ■  ■   ← Places (third lane)
  ◆    ◆         ◆              ← Environment (bottom lane)
```

- Each active layer occupies a horizontal lane approximately 20px tall within the marker area.
- When only one layer is active, its markers center vertically in the full marker area.
- When all four layers are active, lanes compress to fit the 96px marker area (24px per lane).

#### Card-to-Timeline Relationship

- Selecting a marker on the timeline scrolls the card list to the corresponding entry and opens it.
- Selecting a card in the list moves the playhead to that entry's date and highlights its timeline marker.
- When the user scrubs the playhead, the card list live-filters to show entries within the visible time window.

#### Detail Panel Positioning

| Viewport    | Behavior                                                          |
|-------------|-------------------------------------------------------------------|
| Desktop     | Fixed right panel, 400px wide. Main content reflows to remaining width. Panel slides in/out. |
| Tablet      | Overlay panel from right, 360px wide, with scrim on main content. |
| Mobile      | Bottom sheet, slides up to 85% viewport height, draggable handle. |

---

## 6. Iconography

### Style Guidelines

- **Stroke-based** icons, 1.5px stroke weight
- **24px** default canvas (scale to 16px for inline use, 20px for buttons)
- **Rounded** line caps and joins
- Color inherits from the parent text or specified layer color
- Icon set: use [Lucide Icons](https://lucide.dev/) as the base library for consistency

### Layer Type Icons

| Layer       | Icon              | Description                              |
|-------------|-------------------|------------------------------------------|
| Events      | `calendar`        | Calendar page — marks points in time     |
| People      | `user`            | Person silhouette — individuals/groups   |
| Places      | `map-pin`         | Map pin — geographic locations           |
| Environment | `leaf`            | Leaf — natural and ecological features   |

### Navigation Icons

| Action         | Icon              | Usage                                    |
|----------------|-------------------|------------------------------------------|
| Zoom in        | `plus`            | Timeline zoom control                    |
| Zoom out       | `minus`           | Timeline zoom control                    |
| Fit all        | `maximize-2`      | Reset timeline to full range             |
| Pan left       | `chevron-left`    | Timeline scroll hint                     |
| Pan right      | `chevron-right`   | Timeline scroll hint                     |
| Close panel    | `x`               | Close detail panel                       |
| Back           | `arrow-left`      | Return to previous view (mobile)         |

### Action Icons

| Action         | Icon              | Usage                                    |
|----------------|-------------------|------------------------------------------|
| Search         | `search`          | Search input, search trigger             |
| Filter         | `sliders`         | Open/close filter bar (mobile)           |
| Export         | `download`        | Export data (JSON, CSV)                  |
| Share          | `share-2`         | Share/copy link to entry                 |
| External link  | `external-link`   | Open source URL in new tab               |
| Info           | `info`            | Tooltip trigger, help text               |

---

## 7. Responsive Behavior

### Desktop (1024px and above)

```
┌─────────────────────────────────────────────────────────┬──────────────┐
│  Search + Filters                                       │              │
│─────────────────────────────────────────────────────────│  Detail      │
│  Timeline Track (full width of main area)               │  Panel       │
│─────────────────────────────────────────────────────────│  (400px)     │
│  Data Cards (grid: 2-3 columns)                         │              │
│                                                         │              │
│                                                         │              │
└─────────────────────────────────────────────────────────┴──────────────┘
```

- Full timeline track with all controls visible.
- Data cards display in a responsive grid (2 columns at 1024px, 3 columns at 1280px+).
- Detail panel is persistent when open, pushing main content to the left.
- Filter bar is always visible above the timeline.

### Tablet (768px–1023px)

```
┌────────────────────────────────────────────────────────────────────────┐
│  Search + Filters (condensed: layer chips + hamburger for more)       │
│────────────────────────────────────────────────────────────────────────│
│  Timeline Track (full width)                                          │
│────────────────────────────────────────────────────────────────────────│
│  Data Cards (2-column grid)                                           │
│                                                            ┌──────────│
│                                                            │ Detail   │
│                                                            │ (overlay)│
│                                                            └──────────│
└────────────────────────────────────────────────────────────────────────┘
```

- Timeline track remains full-width and horizontally scrollable.
- Filter bar condenses: layer chips remain visible; era select and date range move into a collapsible section.
- Detail panel opens as a right-side overlay (360px) with a translucent scrim over the main content.
- Data cards shift to a 2-column grid.

### Mobile (below 768px)

```
┌───────────────────────────────┐
│  Search bar + [Filter icon]   │
│───────────────────────────────│
│  Timeline Track (swipeable)   │
│───────────────────────────────│
│  Card                         │
│  Card                         │
│  Card                         │
│  Card                         │
│           ...                 │
│┌─────────────────────────────┐│
││  Detail (bottom sheet)      ││
││                             ││
│└─────────────────────────────┘│
└───────────────────────────────┘
```

- Timeline track is horizontally swipeable; zoom is controlled by pinch gesture.
- Filter controls collapse behind a filter icon button; tapping it reveals a full-width dropdown with all filter options.
- Data cards stack in a single column, full width.
- Detail view opens as a bottom sheet (slides up from bottom, draggable to expand or dismiss).
- Era quick-select is replaced by a horizontal scrollable chip row within the filter dropdown.

### Responsive Summary Table

| Feature              | Desktop            | Tablet              | Mobile              |
|----------------------|--------------------|-----------------------|---------------------|
| Grid columns         | 12                 | 8                     | 4                   |
| Card layout          | 2–3 col grid       | 2 col grid            | 1 col stack         |
| Detail panel         | Side panel (push)  | Overlay (right)       | Bottom sheet        |
| Filter bar           | Fully expanded     | Condensed + expand    | Icon + dropdown     |
| Timeline zoom        | Buttons + scroll   | Buttons + pinch       | Pinch only          |
| Timeline navigation  | Scroll + drag      | Scroll + drag         | Swipe               |

---

## 8. ASCII Wireframe

### Primary Desktop View (Detail Panel Open)

```
╔══════════════════════════════════════════════════════════════╦════════════════════╗
║  Writer's Research Companion                                ║                    ║
╠══════════════════════════════════════════════════════════════╣                    ║
║                                                             ║                    ║
║  [Search entries...              🔍]                        ║                    ║
║                                                             ║                    ║
║  [● Events] [● People] [● Places] [● Env]                  ║    DETAIL PANEL    ║
║  [Prehistory] [Indigenous] [Pioneer] [Modern] [All]         ║                    ║
║  Date: [●════════════════●]                                 ║    ── close [x] ── ║
║                                                             ║                    ║
╠══════════════════════════════════════════════════════════════╣    ▌EVENT          ║
║                                                             ║                    ║
║  [+][-][⬜]  Prehistory    │  Indigenous  │  Pioneer │ Mod  ║    Mosquito Fleet  ║
║  ┌──────────────────────────────────────────────────────┐   ║    Established     ║
║  │        ●                │              │            │ │   ║                    ║
║  │  ●          ●           │  ●     ●  ▲  │ ●  ● ▲●  │ │   ║    c. 1890–1920   ║
║  │     ▲    ▲              │     ▲       │  ▲        │ │   ║                    ║
║  │  ◆       ◆  ◆          │  ◆     ◆    │ ◆   ◆    │ │   ║    ─────────────   ║
║  │                         │         ▼    │           │ │   ║                    ║
║  ├──────────────────────────────────────────────────────┤   ║    A network of    ║
║  │  ░░░░██░░░░░░░░░░░░░░░░░████░░░░░░████████░░░░░░░░░│   ║    small steamboat ║
║  └──────────────────────────────────────────────────────┘   ║    routes serving  ║
║                                                             ║    Vashon Island   ║
╠══════════════════════════════════════════════════════════════╣    and surrounding  ║
║                                                             ║    communities...  ║
║  ┌──────────────────┐  ┌──────────────────┐                 ║                    ║
║  │▌ Mosquito Fleet  │  │▌ Vashon College  │                 ║    ─────────────   ║
║  │▌ c. 1890 · Event │  │▌ c. 1892 · Place │                 ║                    ║
║  │▌ Network of small│  │▌ Short-lived     │                 ║    SOURCES         ║
║  │▌ steamboats...   │  │▌ educational...  │                 ║    1. Vashon       ║
║  └──────────────────┘  └──────────────────┘                 ║       Heritage     ║
║                                                             ║       Museum       ║
║  ┌──────────────────┐  ┌──────────────────┐                 ║    2. HistoryLink  ║
║  │▌ Lumber Industry │  │▌ S'Homamish Use  │                 ║       Essay #8847  ║
║  │▌ c. 1880 · Event │  │▌ ~8000 BCE· Env  │                 ║                    ║
║  │▌ Timber harvested│  │▌ Seasonal camps  │                 ║    ─────────────   ║
║  │▌ extensively...  │  │▌ and shellfish...│                 ║                    ║
║  └──────────────────┘  └──────────────────┘                 ║    CROSS-REFS      ║
║                                                             ║    → Vashon Dock   ║
║                                                             ║    → Burton, WA    ║
╚══════════════════════════════════════════════════════════════╩════════════════════╝

LEGEND:
  ● = Event marker (amber)        ▲ = People marker (teal)
  ■ = Place marker (forest green) ◆ = Environment marker (earth brown)
  ▼ = Playhead / scrub handle     ░ = Low density    █ = High density
  ▌ = Layer color indicator (left border on cards)
```

### Key Interaction Notes for the Wireframe

1. **Playhead (▼):** Positioned on the timeline at the currently focused date. Dragging it scrubs through time and live-updates the card list below.
2. **Card selection:** Clicking a compact card (bottom left) populates the detail panel (right) and moves the playhead to that entry's date.
3. **Layer toggles:** Deactivating a layer chip (top) immediately hides that layer's markers on the timeline and removes its cards from the list.
4. **Density strip:** The bottom bar of the timeline provides at-a-glance awareness of where data is concentrated, guiding the user to rich areas of the knowledge base.
5. **Era buttons:** Clicking an era label snaps the timeline viewport to that era's boundaries and filters cards accordingly.

---

## Appendix: CSS Custom Properties

For implementation reference, the design tokens translate to the following CSS custom properties:

```css
:root {
  /* Core Colors */
  --color-primary:        #2D5F3E;
  --color-secondary:      #4A6D8C;
  --color-accent:         #C8913A;
  --color-background:     #F5F0E8;
  --color-surface:        #E8E4DD;
  --color-text:           #2C2C2C;
  --color-text-muted:     #6B6560;
  --color-border:         #D1CCC4;

  /* Layer Colors */
  --color-layer-events:       #C8913A;
  --color-layer-events-bg:    #FBF3E4;
  --color-layer-people:       #3A8C8C;
  --color-layer-people-bg:    #E4F3F3;
  --color-layer-places:       #2D5F3E;
  --color-layer-places-bg:    #E4F0E8;
  --color-layer-env:          #8C6B4A;
  --color-layer-env-bg:       #F0EBE4;

  /* Dark Panel */
  --color-panel-bg:         #3A3835;
  --color-panel-surface:    #4A4744;
  --color-panel-text:       #F5F0E8;
  --color-panel-text-muted: #A8A29E;

  /* Semantic */
  --color-error:    #B84233;
  --color-warning:  #C8913A;
  --color-success:  #3E7A4F;
  --color-info:     #4A6D8C;

  /* Typography */
  --font-heading: 'Merriweather', Georgia, 'Times New Roman', serif;
  --font-body:    'Inter', -apple-system, 'Segoe UI', sans-serif;
  --font-mono:    'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace;

  /* Spacing */
  --space-xs:   4px;
  --space-sm:   8px;
  --space-md:   12px;
  --space-base: 16px;
  --space-lg:   24px;
  --space-xl:   32px;
  --space-2xl:  48px;
  --space-3xl:  64px;

  /* Layout */
  --content-max-width: 1280px;
  --detail-panel-width: 400px;
  --timeline-height: 120px;

  /* Transitions */
  --transition-fast:   150ms ease;
  --transition-normal: 200ms ease-out;
  --transition-slow:   300ms ease-in-out;

  /* Elevation */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md:  0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg:  0 4px 16px rgba(0, 0, 0, 0.12);

  /* Border Radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-full: 9999px;
}
```

---

## 9. Fantasy Layer System

This section defines the visual language for fantasy (fictional) entries that coexist with historical data on the timeline. The design goal is to make fantasy entries immediately recognizable as non-historical while maintaining visual harmony with the existing palette. Fantasy entries should feel like they belong to the same interface — not bolted on — but should never be confused with verified historical content.

### 9.1 Design Rationale

The existing historical palette is rooted in the Pacific Northwest landscape: greens, blues, ambers, and earth tones. These are desaturated, grounded colors. The fantasy palette shifts toward cooler, more luminous hues — purples, magentas, and blue-violets — that evoke an "other" quality without clashing. The choice of purple/violet as the fantasy anchor color is deliberate: purple occupies a region of the color wheel with no overlap to the existing layer colors, and it carries longstanding cultural associations with imagination, mystery, and the supernatural.

### 9.2 Fantasy Color Palette

#### Fantasy Layer Colors

| Layer              | Name              | Hex       | Light Variant (bg) | Contrast vs White | Contrast vs Parchment | Usage                                |
|--------------------|-------------------|-----------|---------------------|-------------------|------------------------|---------------------------------------|
| Fantasy Events     | Amethyst          | `#7B4BAA` | `#F3EBF9`           | 4.68:1            | 4.51:1                 | Fictional events, plot milestones     |
| Fantasy People     | Deep Rose         | `#9E3A6E` | `#F9EBF2`           | 5.72:1            | 5.51:1                 | Fictional characters, groups          |
| Fantasy Places     | Mystic Teal       | `#2A6B7C` | `#E4F0F4`           | 5.08:1            | 4.89:1                 | Fictional locations, landmarks        |
| Fantasy Environment| Twilight Indigo   | `#4A4E8C` | `#ECEDF5`           | 6.12:1            | 5.90:1                 | Fictional climate, magical landscapes |

All primary colors exceed the WCAG AA threshold of 4.5:1 against both `White (#FFFFFF)` and `Parchment (#F5F0E8)`. Light variants are used as card backgrounds, badge fills, and filter chip active states, mirroring the existing historical layer pattern.

#### Fantasy Core Colors

| Role             | Name            | Hex       | Usage                                                |
|------------------|-----------------|-----------|------------------------------------------------------|
| Fantasy Primary  | Amethyst        | `#7B4BAA` | Primary fantasy UI accents, header highlights        |
| Fantasy Accent   | Soft Violet     | `#A67BC5` | Secondary highlights, glow effects (decorative only) |
| Fantasy Muted    | Dusty Lavender  | `#8B7FA0` | Fantasy metadata text, muted labels                  |
| Fantasy Surface  | Pale Orchid     | `#F3EBF9` | Card backgrounds when in fantasy-focused mode        |

#### Fantasy Dark Panel Colors

For the detail panel when displaying a fantasy entry:

| Role                    | Hex       | Usage                                      |
|-------------------------|-----------|---------------------------------------------|
| Fantasy Panel Header BG | `#2E2840` | Header band behind the entry title          |
| Fantasy Panel Accent    | `#A67BC5` | Cross-reference links, source highlights    |
| Fantasy Panel Text      | `#F5F0E8` | Same as historical — consistency is key     |

### 9.3 Visual Distinction System

Fantasy entries must be visually distinct from historical entries across every component where both can appear. The distinction system uses four complementary signals: **color**, **shape**, **texture**, and **badge**. No single signal is solely responsible — each reinforces the others.

#### 9.3.1 Timeline Track Markers

| Property                | Historical                              | Fantasy                                            |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Shape                   | Circle (point), horizontal bar (span)   | Diamond/rhombus (point), dashed bar (span)         |
| Size                    | 10px diameter                           | 10px diagonal (diamond rotated 45 degrees)         |
| Border                  | None                                    | 1px solid, same layer color                        |
| Fill                    | Solid layer color                       | Layer color at 70% opacity                         |
| Glow                    | None                                    | `0 0 6px {layer-color}40` (subtle outer glow)      |
| Hover state             | Scale 1.4x, tooltip                     | Scale 1.4x, tooltip with "Fantasy" prefix          |
| Selected state          | Scale 1.6x, white 2px ring             | Scale 1.6x, white 2px ring, persistent glow        |

CSS for fantasy marker:

```css
.entry-marker.fantasy {
  width: 10px;
  height: 10px;
  transform: translateX(-50%) rotate(45deg);
  border: 1px solid currentColor;
  opacity: 0.85;
  box-shadow: 0 0 6px rgba(123, 75, 170, 0.25);
}

.entry-marker.fantasy.selected {
  transform: translateX(-50%) rotate(45deg) scale(1.4);
  box-shadow: 0 0 0 2px white, 0 0 10px rgba(123, 75, 170, 0.4);
}
```

The diamond shape provides instant visual differentiation from the circular historical markers without requiring the user to read any label. The subtle glow reinforces the "otherworldly" quality without being distracting.

#### 9.3.2 Timeline Lane Allocation

When fantasy layers are active alongside historical layers, fantasy markers occupy additional lanes below the historical lanes:

```
  Era Label              Era Label
  |---------------------|
  o  o    o              o          <-- Historical Events (top lane)
     A        A    A                <-- Historical People (second lane)
  ................................................................................  <-- divider (1px dashed, #D1CCC4, 50% opacity)
  <>    <>       <>                 <-- Fantasy Events (third lane, diamonds)
     <>      <>                     <-- Fantasy People (fourth lane, diamonds)
```

The 1px dashed divider between historical and fantasy lanes provides a clear boundary. When only historical or only fantasy layers are active, the divider is hidden and lanes expand to fill the available space.

#### 9.3.3 Entry Cards

| Property                | Historical                              | Fantasy                                            |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Left indicator          | 4px solid bar, layer color              | 4px bar with diagonal stripe pattern               |
| Background              | `White (#FFFFFF)`                       | `White (#FFFFFF)` with 1px left inset gradient     |
| Border                  | 1px solid `Border (#D1CCC4)`           | 1px solid fantasy layer color at 40% opacity       |
| Title prefix            | None                                    | None (badge handles identification)                |
| Fantasy badge           | Not present                             | Pill badge: "Fantasy" in caption style             |
| Corner treatment        | border-radius 8px                       | border-radius 8px (same)                           |
| Hover elevation         | `--shadow-md`                           | `--shadow-md` with faint color tint                |

The left indicator stripe pattern for fantasy cards:

```css
.entry-card.fantasy .card-indicator {
  background: repeating-linear-gradient(
    -45deg,
    var(--fantasy-layer-color),
    var(--fantasy-layer-color) 3px,
    transparent 3px,
    transparent 6px
  );
}
```

Fantasy badge specification:

| Property        | Value                                              |
|-----------------|-----------------------------------------------------|
| Text            | "Fantasy"                                            |
| Font            | Caption style (12px, 500 weight, Body font)          |
| Letter spacing  | 0.04em                                               |
| Text color      | `Amethyst (#7B4BAA)`                                 |
| Background      | `Pale Orchid (#F3EBF9)`                              |
| Border          | 1px solid `Amethyst` at 30% opacity                  |
| Padding         | 2px 8px                                              |
| Border radius   | 10px (pill)                                          |
| Position        | Inline after layer badge in the card header          |

#### 9.3.4 Detail Panel

When a fantasy entry is selected and displayed in the detail panel:

| Property                | Historical                              | Fantasy                                            |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Header background       | `Panel BG (#3A3835)`                    | `Fantasy Panel Header (#2E2840)`                   |
| Layer overline color    | Historical layer color                  | Fantasy layer color                                |
| Overline text           | "EVENT" / "PERSON" / etc.              | "FANTASY EVENT" / "FANTASY PERSON" / etc.          |
| Title font              | Merriweather 700                        | Merriweather 700 Italic                            |
| Source section heading  | "SOURCES"                               | "NARRATIVE SOURCES" (to distinguish from citations) |
| Cross-reference chips   | Standard compact cards                  | Chips with diamond icon prefix for fantasy refs    |
| Relationship section    | "CROSS-REFERENCES"                      | "CONNECTIONS" (includes both historical and fantasy)|

The italic title treatment for fantasy entries in the detail panel provides a subtle typographic signal. Combined with the overline prefix and header color shift, it creates a clear "this is fiction" signal without being heavy-handed.

#### 9.3.5 Filter Panel

Fantasy layers appear as a second row of toggle chips below the historical layer toggles, visually grouped under a "Fantasy Layers" subheading.

```
LAYERS
[● Events] [● People] [● Places] [● Env]

FANTASY LAYERS
[◆ F-Events] [◆ F-People] [◆ F-Places] [◆ F-Env]
```

| Property                | Historical Chip                         | Fantasy Chip                                       |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Dot shape               | Circle (8px)                            | Diamond (8px, rotated 45deg)                       |
| Active background       | Layer color at 15%                      | Fantasy layer color at 15%                         |
| Border style            | Solid                                   | Dashed (1px)                                       |
| Label                   | "Events" / "People" / etc.             | "F-Events" / "F-People" / etc.                     |

The dashed border on fantasy filter chips echoes the dashed divider on the timeline and the stripe pattern on cards, building a consistent "fantasy = non-solid" visual vocabulary.

#### 9.3.6 Search Results

In the search type-ahead dropdown:

| Property                | Historical                              | Fantasy                                            |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Left indicator          | Solid color bar (3px)                   | Diagonal stripe bar (3px)                          |
| Title treatment         | Normal weight                           | Normal weight + "Fantasy" pill badge after title   |
| Layer badge color       | Historical layer color                  | Fantasy layer color                                |
| Sort order              | Historical results first by default     | Fantasy results grouped below historical           |

When the user's search query matches both historical and fantasy entries, results are presented in two groups with a thin divider and group labels:

```
HISTORICAL MATCHES
  [result 1]
  [result 2]
------------------
FANTASY MATCHES
  [result 3]
```

### 9.4 Fantasy/Historical Toggle

#### 9.4.1 Master Toggle Design

The master "Fantasy Mode" toggle sits in the filter panel header, positioned to the right of the "Layers" label. It controls whether fantasy entries are visible system-wide.

```
LAYERS                                    [Fantasy ◆ ON/OFF]
[● Events] [● People] [● Places] [● Env]
```

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Type                    | Slide toggle with label                              |
| Width                   | 40px (track) + label                                 |
| Track height            | 22px                                                 |
| Track border-radius     | 11px                                                 |
| Track OFF color         | `Surface (#E8E4DD)`                                  |
| Track ON color          | `Amethyst (#7B4BAA)` at 30%                          |
| Thumb size              | 18px circle                                          |
| Thumb OFF color         | `Warm Gray (#6B6560)`                                |
| Thumb ON color          | `Amethyst (#7B4BAA)`                                 |
| Label text              | "Fantasy" in Caption style                           |
| Diamond icon            | 8px diamond before label, filled when ON             |
| Transition              | 200ms ease-out                                       |
| Keyboard                | Space to toggle, Tab to focus                        |
| ARIA                    | `role="switch"`, `aria-checked`, `aria-label="Toggle fantasy entries"` |

#### 9.4.2 Default State

Fantasy entries are **hidden by default**. The master toggle is OFF on initial load. This preserves the core experience for writers who are using the tool purely for historical research. The fantasy layer is an opt-in overlay.

Rationale: Historical accuracy is the primary value proposition. Fantasy content must never contaminate a researcher's view unless they explicitly request it. Defaulting to OFF also prevents confusion for new users who might not understand the distinction.

When the user activates the master toggle:
1. Fantasy layer chips appear (with a 200ms slide-down animation).
2. Fantasy markers appear on the timeline (with a 150ms fade-in).
3. Fantasy entries appear in the card list (inserted in chronological position with a 150ms fade-in).
4. The filter footer count updates to include fantasy entries.

When deactivated, the reverse: fantasy elements fade out and collapse, leaving the historical view intact.

#### 9.4.3 Mixed View Treatment

When both historical and fantasy entries are visible simultaneously:

**Timeline Track:**
- Historical markers appear in the upper lanes, fantasy markers in the lower lanes (separated by the dashed divider described in Section 9.3.2).
- The density strip at the bottom of the timeline uses a split-color approach: historical density in the standard layer colors, fantasy density in the fantasy layer colors, rendered as a stacked bar.

**Card List:**
- Cards are interleaved chronologically. Historical and fantasy cards at the same date appear adjacent, with historical cards first.
- The visual distinction signals (solid vs. stripe indicator, badge) are sufficient to differentiate at a glance.

**Overlap Regions:**
- Where a fantasy event is anchored to the same date as a historical event, the timeline shows both markers at the same horizontal position in their respective lanes.
- An optional "connection line" (1px dashed, `Amethyst` at 30%) can be drawn between a fantasy marker and the historical marker it references, visible on hover.

```css
.timeline-connection-line {
  position: absolute;
  border-left: 1px dashed rgba(123, 75, 170, 0.3);
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
}

.entry-marker.fantasy:hover ~ .timeline-connection-line,
.entry-marker.historical:hover ~ .timeline-connection-line {
  opacity: 1;
}
```

### 9.5 Fantasy Typography

#### Font Treatment

Fantasy entries do **not** use a different base font family. Introducing a display or script font for fantasy entries would violate the Minimal principle and create visual noise. Instead, the distinction is achieved through targeted style variations:

| Element                    | Historical Treatment                    | Fantasy Treatment                            |
|----------------------------|-----------------------------------------|----------------------------------------------|
| Card title (H4)           | Inter 600, normal                       | Inter 600, normal (same)                     |
| Detail panel title (H2)   | Merriweather 700, normal                | Merriweather 700, **italic**                 |
| Layer overline             | Uppercase, normal                       | Uppercase, normal + "FANTASY" prefix         |
| Date label                 | JetBrains Mono 400                      | JetBrains Mono 400 (same)                    |
| Description body           | Inter 400                               | Inter 400 (same)                             |
| Fantasy badge              | Inter 500, 12px, letter-spacing 0.04em  | (unique to fantasy)                          |

The italic Merriweather treatment on the detail panel title is the only typographic divergence, and it is intentionally restrained. Italic serif in a detail context reads as "literary" or "narrative" without introducing a separate design language.

### 9.6 Fantasy Iconography

All icons use Lucide Icons to maintain consistency with the existing system. Fantasy layer icons are distinct from their historical counterparts but follow the same stroke-based, 24px canvas, 1.5px stroke conventions.

#### Fantasy Layer Icons

| Layer              | Icon              | Lucide Name       | Description                                |
|--------------------|-------------------|--------------------|---------------------------------------------|
| Fantasy Events     | `sparkles`        | sparkles           | Three-star burst — magical occurrence       |
| Fantasy People     | `ghost`           | ghost              | Ghost silhouette — fictional character      |
| Fantasy Places     | `castle`          | castle             | Castle tower — fictional location           |
| Fantasy Environment| `flame`           | flame              | Flame — otherworldly landscape/element      |

These icons intentionally pair with the historical equivalents (`calendar`, `user`, `map-pin`, `leaf`) while signaling their fictional nature.

#### Additional Fantasy Icons

| Action             | Icon              | Lucide Name       | Usage                                      |
|--------------------|-------------------|--------------------|---------------------------------------------|
| Fantasy toggle     | `wand-2`          | wand-2             | Master fantasy toggle icon (optional)       |
| Fantasy badge      | `diamond`         | diamond            | Inline badge icon in fantasy pills          |
| Fantasy link       | `link-2`          | link-2             | Connection between fantasy and history      |
| Universe/campaign  | `book-open`       | book-open          | Universe or campaign selector               |

### 9.7 Fantasy CSS Custom Properties

```css
:root {
  /* Fantasy Layer Colors */
  --color-fantasy-events:       #7B4BAA;
  --color-fantasy-events-bg:    #F3EBF9;
  --color-fantasy-people:       #9E3A6E;
  --color-fantasy-people-bg:    #F9EBF2;
  --color-fantasy-places:       #2A6B7C;
  --color-fantasy-places-bg:    #E4F0F4;
  --color-fantasy-env:          #4A4E8C;
  --color-fantasy-env-bg:       #ECEDF5;

  /* Fantasy Core */
  --color-fantasy-primary:      #7B4BAA;
  --color-fantasy-accent:       #A67BC5;
  --color-fantasy-muted:        #8B7FA0;
  --color-fantasy-surface:      #F3EBF9;

  /* Fantasy Dark Panel */
  --color-fantasy-panel-header: #2E2840;
  --color-fantasy-panel-accent: #A67BC5;

  /* Fantasy Effects */
  --fantasy-glow-sm:  0 0 6px rgba(123, 75, 170, 0.25);
  --fantasy-glow-md:  0 0 10px rgba(123, 75, 170, 0.35);
  --fantasy-glow-lg:  0 0 16px rgba(123, 75, 170, 0.45);

  /* Fantasy Stripe Pattern (used in backgrounds) */
  --fantasy-stripe: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    rgba(123, 75, 170, 0.08) 3px,
    rgba(123, 75, 170, 0.08) 6px
  );
}
```

---

## 10. Regional Context Layers

Regional context layers display key events from surrounding areas (Seattle, Tacoma, United States) alongside Vashon Island entries. These provide temporal context — a writer can see that a Vashon event occurred during the same year as a major Seattle fire or a national policy change — without cluttering the primary research view.

### 10.1 Design Rationale

Regional context entries are **subordinate** to Vashon Island entries. They exist to provide temporal anchoring, not to be researched in their own right. The visual treatment must communicate this hierarchy: regional events are visible but visually lighter, occupying less visual weight than primary Vashon entries.

### 10.2 Regional Color Palette

Regional layers use a muted, desaturated color family that does not compete with either the historical or fantasy palettes:

| Region         | Name            | Hex       | Light Variant (bg) | Contrast vs White | Contrast vs Parchment | Usage                  |
|----------------|-----------------|-----------|---------------------|-------------------|------------------------|------------------------|
| Seattle        | Steel Gray      | `#5C6B78` | `#ECEEF0`           | 4.69:1            | 4.52:1                 | Seattle metro events   |
| Tacoma         | Slate Olive     | `#5E6B5C` | `#ECEFEB`           | 4.52:1            | 4.36:1                 | Tacoma area events     |
| United States  | Muted Navy      | `#4A5570` | `#EBEDF2`           | 5.24:1            | 5.05:1                 | National US events     |

These grayed-out tones intentionally lack the saturation of the Vashon layer colors. They read as "background context" rather than "primary data."

### 10.3 Visual Weight Hierarchy

The interface establishes a three-tier visual hierarchy:

```
TIER 1 (Full weight)  — Vashon Historical entries (existing)
TIER 2 (Medium weight) — Vashon Fantasy entries (Section 9)
TIER 3 (Low weight)    — Regional Context entries (this section)
```

#### Timeline Markers

| Property                | Vashon (Tier 1)                         | Regional (Tier 3)                                  |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Shape                   | Circle (10px) / Diamond (fantasy)       | Small circle (6px)                                 |
| Opacity                 | 100%                                    | 60%                                                |
| Vertical position       | Standard lanes                          | Dedicated "context lane" below all Vashon lanes    |
| Hover behavior          | Scale 1.4x, full tooltip               | Scale 1.3x, tooltip with region prefix             |
| Selected behavior       | Opens detail panel                      | Opens compact tooltip (not full detail panel)       |

#### Entry Cards

Regional context entries do **not** appear in the main card list by default. They are surfaced in two ways:

1. **Tooltip on timeline hover:** A compact tooltip showing title, date, and region tag.
2. **Context sidebar section:** When the detail panel is open for a Vashon entry, a "Regional Context" section at the bottom shows any regional events within +/- 5 years. These appear as minimal inline items (date + title), not full cards.

If the user explicitly opts to show regional cards in the list (via a settings toggle), they appear as compact, single-line entries with reduced visual weight:

| Property                | Vashon Card                             | Regional Card                                      |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Height                  | Auto (multi-line)                       | Single line, 40px fixed height                     |
| Left indicator          | 4px bar, layer color                    | 2px bar, regional color at 60%                     |
| Background              | `White (#FFFFFF)`                       | `Surface (#E8E4DD)`                                |
| Title style             | H4 (16px, 600)                          | Body Small (14px, 400)                             |
| Description             | Visible (2-line truncation)             | Hidden (tooltip on hover)                          |
| Region badge            | Not present                             | Pill: "Seattle" / "Tacoma" / "US" in regional color|

### 10.4 Regional Toggle UI

Regional layers are controlled by a collapsible "Context Layers" section in the filter panel, positioned below the fantasy toggles:

```
LAYERS
[● Events] [● People] [● Places] [● Env]

FANTASY LAYERS                            [Fantasy ◆ ON/OFF]
[◆ F-Events] [◆ F-People] [◆ F-Places] [◆ F-Env]

REGIONAL CONTEXT                          [Context ▸ ON/OFF]
[○ Seattle] [○ Tacoma] [○ US National]
```

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Toggle type             | Master toggle for all context + individual region toggles |
| Chip shape              | Pill, matching historical chip style                 |
| Chip dot                | Open circle (2px stroke, no fill) to signal "context" weight |
| Default state           | OFF (all regional layers hidden)                     |
| Collapse behavior       | Section header collapses/expands the chip row        |

### 10.5 Regional CSS Custom Properties

```css
:root {
  /* Regional Context Colors */
  --color-region-seattle:       #5C6B78;
  --color-region-seattle-bg:    #ECEEF0;
  --color-region-tacoma:        #5E6B5C;
  --color-region-tacoma-bg:     #ECEFEB;
  --color-region-us:            #4A5570;
  --color-region-us-bg:         #EBEDF2;

  /* Regional Visual Weight */
  --region-marker-size:         6px;
  --region-marker-opacity:      0.6;
  --region-card-height:         40px;
  --region-indicator-width:     2px;
}
```

---

## 11. Fantasy Entry Dialog

This section specifies the modifications to the AddEntryDialog component for creating fantasy entries.

### 11.1 Entry Type Selector

At the top of the dialog, before all other fields, a segmented control allows the user to select the entry type:

```
┌─────────────────────────────────────────┐
│  [  Historical  |  Fantasy  ]           │
│                                         │
│  Title *                                │
│  [________________________________]     │
│  ...                                    │
└─────────────────────────────────────────┘
```

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Type                    | Segmented control (two segments)                     |
| Width                   | 100% of dialog body                                  |
| Height                  | 40px                                                 |
| Border                  | 1px solid `Border (#D1CCC4)`                         |
| Border radius           | 8px                                                  |
| Segment radius          | 6px (inner)                                          |
| Historical active       | `Forest Green (#2D5F3E)` bg, white text              |
| Fantasy active          | `Amethyst (#7B4BAA)` bg, white text                  |
| Inactive                | Transparent bg, `Warm Gray (#6B6560)` text           |
| Transition              | Background 150ms ease                                |
| Default                 | "Historical" selected                                |

When the user selects "Fantasy":
1. The dialog header color shifts from `Forest Green` to `Amethyst`.
2. The layer picker shows fantasy layers instead of historical layers.
3. Additional fantasy-specific fields appear below the standard fields.
4. The submit button changes from `Forest Green` to `Amethyst`.

### 11.2 Fantasy-Specific Fields

These fields appear only when "Fantasy" is selected:

#### Universe / Campaign Name

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Label                   | "Universe / Campaign"                                |
| Type                    | Text input with autocomplete from existing universes |
| Placeholder             | "e.g., Ravenstone Chronicles, Vashon Dark"           |
| Required                | No (but strongly recommended)                        |
| Position                | Immediately after the Era selector                   |

#### Narrative Arc

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Label                   | "Narrative Arc"                                      |
| Type                    | Select dropdown                                      |
| Options                 | "Setup", "Rising Action", "Climax", "Falling Action", "Resolution", "Standalone" |
| Default                 | "Standalone"                                         |
| Required                | No                                                   |
| Position                | Below Universe/Campaign                              |

#### Historical Anchor

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Label                   | "Anchored to Historical Entry"                       |
| Type                    | Search input (autocomplete from existing entries)    |
| Placeholder             | "Search for a historical entry to anchor this to..." |
| Required                | No                                                   |
| Position                | Below Narrative Arc                                  |
| Purpose                 | Creates a visual connection line on the timeline     |

### 11.3 Visual Preview

The dialog includes a live preview strip at the bottom of the form (above the footer buttons) showing how the entry will appear:

```
┌─────────────────────────────────────────┐
│  PREVIEW                                │
│  ┌─────────────────────────────────┐    │
│  │▌▌ Title of Entry        Fantasy │    │
│  │▌▌ ~1890 · Fantasy Events        │    │
│  │▌▌ Description preview text...   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

The preview card uses the actual fantasy card styling (striped left indicator, fantasy badge, fantasy layer colors) so the user sees exactly how their entry will look in the interface before saving.

| Property                | Value                                                |
|-------------------------|------------------------------------------------------|
| Container background    | `Surface (#E8E4DD)`                                  |
| Container padding       | 16px                                                 |
| Container border-radius | 8px                                                  |
| Preview card            | Full EntryCard component in read-only mode           |
| Heading                 | "PREVIEW" in Overline style                          |
| Visibility              | Always visible; updates live as fields are filled    |
| Empty state             | Grayed-out placeholder card with "Fill in fields to see preview" |

### 11.4 Submit Button Variants

| State                   | Historical                              | Fantasy                                            |
|-------------------------|-----------------------------------------|----------------------------------------------------|
| Background              | `Forest Green (#2D5F3E)`                | `Amethyst (#7B4BAA)`                               |
| Hover background        | `#245232`                               | `#643A8C`                                          |
| Text                    | "Add Entry"                             | "Add Fantasy Entry"                                |
| Icon                    | None                                    | `sparkles` (16px) before text (optional)           |

### 11.5 Dialog CSS Custom Properties

```css
/* Fantasy dialog state — applied when .add-entry-dialog.fantasy */
.add-entry-dialog.fantasy .add-entry-header h2 {
  color: var(--color-fantasy-primary);
}

.add-entry-dialog.fantasy .add-entry-submit {
  background: var(--color-fantasy-primary);
}

.add-entry-dialog.fantasy .add-entry-submit:hover {
  background: #643A8C;
}

.add-entry-dialog.fantasy .field-input:focus,
.add-entry-dialog.fantasy .field-textarea:focus,
.add-entry-dialog.fantasy .field-select:focus {
  border-color: var(--color-fantasy-primary);
  box-shadow: 0 0 0 3px rgba(123, 75, 170, 0.15);
}
```

---

## Appendix B: Fantasy Feature ASCII Wireframe

### Desktop View with Fantasy Mode Active

```
+================================================================+===================+
|  Writer's Research Companion                [Fantasy (diamond) ON]                  |
+================================================================+                   |
|                                                                 |                   |
|  [Search entries...              (search)]                      |                   |
|                                                                 |                   |
|  LAYERS                                                         |  DETAIL PANEL     |
|  [* Events] [* People] [* Places] [* Env]                      |                   |
|                                                                 |  -- close [x] --  |
|  FANTASY LAYERS                                                 |                   |
|  [<> F-Events] [<> F-People] [<> F-Places] [<> F-Env]          |  <>FANTASY EVENT  |
|                                                                 |                   |
|  [Prehistory] [Indigenous] [Pioneer] [Modern] [All]             |  The Whispering   |
|  Date: [*================*]                                     |  Stones Appear    |
|                                                                 |                   |
+================================================================+  ~1890 (Fantasy)  |
|                                                                 |                   |
|  [+][-][fit]  Prehistory   | Indigenous | Pioneer  | Modern    |  ----------------  |
|  +------------------------------------------------------+      |                   |
|  |        o                |            |           |    |      |  In the Ravenstone|
|  |  o          o           |  o     o   | o  o  o   |    |      |  universe, the    |
|  |     A    A              |     A      |  A        |    |      |  ancient standing |
|  |............................FANTASY.LANE..........|....|      |  stones on the    |
|  |     <>       <>         |  <>   <>   | <>  <>    |    |      |  south bluff      |
|  |  <>      <>             |     <>     |  <>       |    |      |  begin to glow... |
|  |                         |       v    |           |    |      |                   |
|  +------------------------------------------------------+      |  ----------------  |
|  |  ::::##:::::::::::::::::::####:::::::########:::::::::|      |                   |
|  +------------------------------------------------------+      |  NARRATIVE SOURCES|
|                                                                 |  1. Ravenstone    |
+================================================================+     Campaign Bible |
|                                                                 |                   |
|  +--------------------+  +--------------------+                 |  ----------------  |
|  |/  Mosquito Fleet   |  |// Whispering Stones| Fantasy        |                   |
|  |/  c. 1890 . Event  |  |// ~1890 . F-Event  |                |  CONNECTIONS      |
|  |/  Network of small |  |// Ancient standing  |                |  -> Mosquito Fleet|
|  |/  steamboats...    |  |// stones begin...   |                |     (Historical)  |
|  +--------------------+  +--------------------+                 |  -> Burton Wharf  |
|                                                                 |     (Historical)  |
|  +--------------------+  +--------------------+                 |  -> The Keeper    |
|  |/  Vashon College   |  |// The Keeper       | Fantasy        |     (Fantasy)     |
|  |/  c. 1892 . Place  |  |// ~1892 . F-Person |                |                   |
|  |/  Short-lived      |  |// A mysterious     |                |                   |
|  |/  educational...   |  |// figure who...    |                |                   |
|  +--------------------+  +--------------------+                 |                   |
|                                                                 |                   |
+================================================================+===================+

LEGEND:
  o  = Historical event marker (circle)    A = Historical people marker (triangle)
  <> = Fantasy marker (diamond)            v = Playhead / scrub handle
  /  = Solid left indicator (historical)   // = Striped left indicator (fantasy)
  :  = Low density     # = High density
  .... = Fantasy lane divider (dashed)
```

---

## Appendix C: Complete Updated CSS Custom Properties

This appendix consolidates all CSS custom properties including the new fantasy and regional systems. It supersedes the original Appendix A for implementation reference.

```css
:root {
  /* ===== Core Colors ===== */
  --color-primary:        #2D5F3E;
  --color-secondary:      #4A6D8C;
  --color-accent:         #C8913A;
  --color-background:     #F5F0E8;
  --color-surface:        #E8E4DD;
  --color-text:           #2C2C2C;
  --color-text-muted:     #6B6560;
  --color-border:         #D1CCC4;

  /* ===== Historical Layer Colors ===== */
  --color-layer-events:       #C8913A;
  --color-layer-events-bg:    #FBF3E4;
  --color-layer-people:       #3A8C8C;
  --color-layer-people-bg:    #E4F3F3;
  --color-layer-places:       #2D5F3E;
  --color-layer-places-bg:    #E4F0E8;
  --color-layer-env:          #8C6B4A;
  --color-layer-env-bg:       #F0EBE4;

  /* ===== Fantasy Layer Colors ===== */
  --color-fantasy-events:       #7B4BAA;
  --color-fantasy-events-bg:    #F3EBF9;
  --color-fantasy-people:       #9E3A6E;
  --color-fantasy-people-bg:    #F9EBF2;
  --color-fantasy-places:       #2A6B7C;
  --color-fantasy-places-bg:    #E4F0F4;
  --color-fantasy-env:          #4A4E8C;
  --color-fantasy-env-bg:       #ECEDF5;

  /* ===== Fantasy Core ===== */
  --color-fantasy-primary:      #7B4BAA;
  --color-fantasy-accent:       #A67BC5;
  --color-fantasy-muted:        #8B7FA0;
  --color-fantasy-surface:      #F3EBF9;

  /* ===== Fantasy Dark Panel ===== */
  --color-fantasy-panel-header: #2E2840;
  --color-fantasy-panel-accent: #A67BC5;

  /* ===== Fantasy Effects ===== */
  --fantasy-glow-sm:  0 0 6px rgba(123, 75, 170, 0.25);
  --fantasy-glow-md:  0 0 10px rgba(123, 75, 170, 0.35);
  --fantasy-glow-lg:  0 0 16px rgba(123, 75, 170, 0.45);

  --fantasy-stripe: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    rgba(123, 75, 170, 0.08) 3px,
    rgba(123, 75, 170, 0.08) 6px
  );

  /* ===== Regional Context Colors ===== */
  --color-region-seattle:       #5C6B78;
  --color-region-seattle-bg:    #ECEEF0;
  --color-region-tacoma:        #5E6B5C;
  --color-region-tacoma-bg:     #ECEFEB;
  --color-region-us:            #4A5570;
  --color-region-us-bg:         #EBEDF2;

  /* ===== Regional Visual Weight ===== */
  --region-marker-size:         6px;
  --region-marker-opacity:      0.6;
  --region-card-height:         40px;
  --region-indicator-width:     2px;

  /* ===== Dark Panel ===== */
  --color-panel-bg:         #3A3835;
  --color-panel-surface:    #4A4744;
  --color-panel-text:       #F5F0E8;
  --color-panel-text-muted: #A8A29E;

  /* ===== Semantic ===== */
  --color-error:    #B84233;
  --color-warning:  #C8913A;
  --color-success:  #3E7A4F;
  --color-info:     #4A6D8C;

  /* ===== Typography ===== */
  --font-heading: 'Merriweather', Georgia, 'Times New Roman', serif;
  --font-body:    'Inter', -apple-system, 'Segoe UI', sans-serif;
  --font-mono:    'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace;

  /* ===== Spacing ===== */
  --space-xs:   4px;
  --space-sm:   8px;
  --space-md:   12px;
  --space-base: 16px;
  --space-lg:   24px;
  --space-xl:   32px;
  --space-2xl:  48px;
  --space-3xl:  64px;

  /* ===== Layout ===== */
  --content-max-width: 1280px;
  --detail-panel-width: 400px;
  --timeline-height: 120px;

  /* ===== Transitions ===== */
  --transition-fast:   150ms ease;
  --transition-normal: 200ms ease-out;
  --transition-slow:   300ms ease-in-out;

  /* ===== Elevation ===== */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md:  0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg:  0 4px 16px rgba(0, 0, 0, 0.12);

  /* ===== Border Radius ===== */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-full: 9999px;
}
```

---

*This document is the single source of truth for all visual and interaction design decisions in the Writer's Research Companion. All implementation should reference these specifications. Deviations require a decision log entry in `docs/coordination.md` with rationale.*
