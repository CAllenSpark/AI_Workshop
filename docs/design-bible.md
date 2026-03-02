# Design Bible — Writer's Research Companion

**Version:** 1.0
**Owner:** Designer, UI/UX
**Last updated:** 2026-03-02

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

*This document is the single source of truth for all visual and interaction design decisions in the Writer's Research Companion. All implementation should reference these specifications. Deviations require a decision log entry in `docs/coordination.md` with rationale.*
