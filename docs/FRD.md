# Functional Requirements Document: Writer's Research Companion

**Version:** 1.0
**Date:** 2026-03-02
**Owner:** Engineer
**Status:** Draft

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Data Model](#2-data-model)
3. [Timeline Engine](#3-timeline-engine)
4. [Search and Filter Specifications](#4-search-and-filter-specifications)
5. [Export Format](#5-export-format)
6. [Component Specifications](#6-component-specifications)
7. [Performance Requirements](#7-performance-requirements)
8. [Accessibility Requirements](#8-accessibility-requirements)

---

## 1. System Architecture Overview

The Writer's Research Companion is a client-side single-page application (SPA) built with React and TypeScript. It requires no backend server for the prototype phase. All data is stored in JSON flat files that are loaded at application startup, parsed, and held in an in-memory store for the duration of the session.

### 1.1 Architecture Principles

- **Zero-backend prototype.** The application runs entirely in the browser. No server, database, or API is required. This keeps deployment trivial and ensures the project remains portable.
- **Data as flat files.** All research content lives in version-controlled JSON files that can be hand-edited, diffed, and merged with standard Git tooling.
- **Client-side computation.** Search indexing, filtering, and timeline rendering all happen in the browser. The data set for a single setting (target: under 500 entries) is small enough that this approach is performant without optimization.
- **Export-first design.** The internal data model is structured so that a complete, self-contained JSON export can be generated at any time for consumption by AI narrators or other downstream tools.

### 1.2 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Application Startup                          │
└─────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   JSON Files    │────▶│   Data Loader    │────▶│ In-Memory Store  │
│                 │     │                  │     │                  │
│ - timeline.json │     │ - Fetch files    │     │ - Parsed entities│
│ - people.json   │     │ - Validate shape │     │ - Cross-reference│
│ - places.json   │     │ - Parse dates    │     │   index          │
│ - events.json   │     │ - Build indices  │     │ - Search index   │
│ - environ.json  │     │                  │     │   (Fuse.js/Lunr) │
└─────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                          │
                           ┌──────────────────────────────┤
                           │                              │
                           ▼                              ▼
                  ┌─────────────────┐          ┌──────────────────┐
                  │  UI Components  │          │  Export Engine    │
                  │                 │          │                  │
                  │ - TimelineTrack │          │ - AI Narrator    │
                  │ - EntryCard     │          │   JSON format    │
                  │ - DetailPanel   │          │ - Flat structure  │
                  │ - SearchBar     │          │ - Context         │
                  │ - FilterPanel   │          │   summaries      │
                  └─────────────────┘          └──────────────────┘
```

### 1.3 Technology Choices

| Concern | Technology | Rationale |
|---------|-----------|-----------|
| UI framework | React 18+ with TypeScript | Component model fits the panel-based UI; TypeScript enforces data model contracts |
| Timeline rendering | D3.js or Vis-timeline | D3.js offers full control over custom timeline visuals; Vis-timeline provides a faster path to a working prototype. Final choice deferred to implementation spike. |
| Client-side search | Fuse.js or Lunr.js | Both provide full-text search without a server. Fuse.js supports fuzzy matching; Lunr.js supports TF-IDF ranking. Final choice deferred to implementation spike. |
| Build tooling | Vite | Fast HMR, native TypeScript support, minimal configuration |
| Data format | JSON flat files | Human-readable, version-controllable, portable, no database overhead |

### 1.4 File Organization

All data files for a given setting reside under `research/<setting-name>/`. For the prototype:

```
research/
└── vashon-island/
    ├── timeline.json
    ├── people.json
    ├── places.json
    ├── events.json
    └── environment.json
```

Each file contains an array of entities conforming to the schemas defined in Section 2.

---

## 2. Data Model

All entities use string UUIDs as primary keys. Cross-references between entities use these IDs. Dates follow ISO 8601 where possible; approximate or prehistoric dates use descriptive strings prefixed with `~` (e.g., `"~10000 BCE"`).

### 2.1 TimelineEntry

The `TimelineEntry` is the core entity. It represents any item that appears on the timeline, regardless of type.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID v4) |
| `title` | string | Yes | Short display title (max 120 characters) |
| `date_start` | string | Yes | Start date in ISO 8601 or approximate format |
| `date_end` | string | No | End date. If omitted, entry is treated as a point event. |
| `era` | string | Yes | Era key referencing a defined era (see Section 3.1) |
| `layers` | string[] | Yes | One or more layer tags: `"event"`, `"person"`, `"place"`, `"environment"` |
| `description` | string | Yes | Summary text (1-3 sentences) for card display |
| `details` | string | No | Extended narrative text with full context |
| `people` | string[] | No | Array of Person IDs related to this entry |
| `places` | string[] | No | Array of Place IDs related to this entry |
| `sources` | Source[] | No | Array of source citation objects (see Section 2.6) |
| `tags` | string[] | No | Freeform tags for additional categorization |

### 2.2 Person

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID v4) |
| `name` | string | Yes | Full display name |
| `birth_year` | string | No | Birth year in ISO 8601 or approximate format |
| `death_year` | string | No | Death year in ISO 8601 or approximate format |
| `description` | string | Yes | Biographical summary (1-3 sentences) |
| `role` | string | Yes | Primary role or significance (e.g., `"homesteader"`, `"chief"`, `"naturalist"`) |
| `related_entries` | string[] | No | Array of TimelineEntry IDs this person appears in |

### 2.3 Place

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID v4) |
| `name` | string | Yes | Display name of the place |
| `type` | string | Yes | One of: `"landmark"`, `"area"`, `"building"`, `"waterway"`, `"road"`, `"region"` |
| `coordinates` | object | No | Geographic coordinates: `{ "lat": number, "lng": number }` |
| `description` | string | Yes | Description of the place and its significance |
| `related_entries` | string[] | No | Array of TimelineEntry IDs associated with this place |

### 2.4 Event

The `Event` entity provides a structured view of discrete historical occurrences. Events differ from generic TimelineEntries in that they carry explicit significance ratings and formal cross-references to people and places.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID v4) |
| `title` | string | Yes | Event title |
| `date` | string | Yes | Date in ISO 8601 or approximate format |
| `era` | string | Yes | Era key referencing a defined era |
| `description` | string | Yes | What happened (1-3 sentences) |
| `significance` | string | Yes | Why this event matters to the setting's history |
| `related_people` | string[] | No | Array of Person IDs involved in this event |
| `related_places` | string[] | No | Array of Place IDs where this event occurred |

### 2.5 EnvironmentFeature

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID v4) |
| `name` | string | Yes | Feature name (e.g., `"Glacial till deposits"`, `"Old-growth Douglas fir forest"`) |
| `type` | string | Yes | One of: `"geology"`, `"ecology"`, `"climate"`, `"hydrology"`, `"soil"` |
| `description` | string | Yes | Description of the feature and its characteristics |
| `time_relevance` | string | Yes | When this feature is/was relevant (e.g., `"~15000 BCE to present"`, `"1890-1950"`) |

### 2.6 Source (Embedded Object)

Sources are embedded within other entities rather than stored as standalone records.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Source title or description |
| `url` | string | No | URL if the source is available online |
| `type` | string | Yes | One of: `"primary"`, `"secondary"`, `"tertiary"` |
| `accessed` | string | No | Date the source was last accessed (ISO 8601) |

### 2.7 Cross-Reference Integrity

The data loader must validate referential integrity at startup:

- All IDs referenced in `people[]`, `places[]`, `related_entries[]`, `related_people[]`, and `related_places[]` fields must resolve to existing entities.
- Broken references should be logged as warnings to the browser console but should not prevent the application from loading.
- Bidirectional references (e.g., a Person's `related_entries` and a TimelineEntry's `people`) should be consistent. The data loader should reconcile any one-directional references by populating the missing back-reference in memory.

---

## 3. Timeline Engine

The timeline engine is the primary interaction surface. It renders a horizontal, scrollable timeline with markers for each entry, supports multiple zoom levels, and provides scrubbing controls for navigating through time.

### 3.1 Era Definitions

Eras provide the top-level temporal structure. Each era has a key, display name, date range, and optional color for visual distinction.

| Era Key | Display Name | Start | End | Notes |
|---------|-------------|-------|-----|-------|
| `prehistory` | Prehistory | ~15000 BCE | ~1750 CE | Glacial retreat, geological formation, pre-contact indigenous habitation |
| `indigenous` | Indigenous Peoples | ~10000 BCE | ~1850 CE | Sustained indigenous presence, s'Homamish and other Coast Salish peoples |
| `exploration` | Exploration | 1790 | 1850 | European exploration of Puget Sound, first documented contacts |
| `pioneer` | Pioneer Settlement | 1850 | 1900 | Homesteading, early Euro-American settlement, logging |
| `early_modern` | Early Modern | 1900 | 1945 | Ferry service, agriculture, rural community development |
| `postwar` | Postwar | 1945 | 1980 | Suburbanization, counterculture, environmental awareness |
| `contemporary` | Contemporary | 1980 | present | Modern community, conservation efforts, arts community |

Eras may overlap. A single TimelineEntry belongs to exactly one era (its primary era), but the timeline visualization may display entries across overlapping era boundaries.

### 3.2 Zoom Levels

The timeline supports four discrete zoom levels. The user transitions between levels using scroll-wheel zoom, pinch-to-zoom on touch devices, or dedicated zoom controls.

| Zoom Level | Name | Time Span Visible | Marker Style | Use Case |
|------------|------|-------------------|-------------|----------|
| 1 | Era View | Full range (~15000 BCE to present) | Era bands with entry count badges | Orientation, big-picture overview |
| 2 | Century View | ~200-500 years | Decade clusters with summary dots | Navigating within a broad period |
| 3 | Decade View | ~20-50 years | Individual year markers with entry previews | Exploring a specific period |
| 4 | Year View | ~1-5 years | Full entry markers with title labels | Reading individual entries |

**Zoom behavior:**

- Zooming in centers on the current cursor/touch position.
- Zooming out maintains the center of the current viewport.
- At Era View (zoom level 1), entry markers are replaced by density indicators showing the count of entries per era.
- At Year View (zoom level 4), all entry markers are individually visible with their titles.

### 3.3 Scrubbing

Scrubbing is the primary navigation mechanism within a zoom level.

- **Horizontal drag:** Click and drag (or touch and drag) on the timeline track to scroll through time. The timeline pans in the direction of the drag.
- **Slider control:** A secondary slider below the main timeline provides a minimap of the full time range. The slider thumb represents the current viewport. Dragging the thumb scrolls the main timeline.
- **Keyboard navigation:** Left/Right arrow keys move the viewport by one unit appropriate to the current zoom level (one era at level 1, one decade at level 2, one year at level 3, one month at level 4).

### 3.4 Snap-to-Era Behavior

At zoom levels 1 and 2, the timeline snaps to era boundaries when the user stops scrolling:

- When the user releases a drag or stops a scroll gesture, the viewport animates to center on the nearest era boundary.
- The snap animation uses an ease-out curve with a duration of 200ms.
- Snap behavior is disabled at zoom levels 3 and 4 to allow fine-grained navigation.

### 3.5 Entry Density Indicator

At zoom levels where individual entries are not visible, a density indicator communicates data richness:

- Displayed as a heat bar along the bottom of the timeline track.
- Color intensity scales linearly from the minimum entry count to the maximum entry count within the visible range.
- On hover, a tooltip shows the exact entry count and date range for the hovered segment.
- Density granularity adapts to zoom level: per-era at level 1, per-decade at level 2.

### 3.6 Marker Interaction

- **Hover:** Displays a tooltip with the entry title and date range.
- **Click:** Opens the EntryCard for the selected entry in a side panel.
- **Clustered markers:** When multiple entries overlap at the current zoom level, they are grouped into a cluster marker showing the count. Clicking a cluster zooms in to resolve individual entries.

---

## 4. Search and Filter Specifications

### 4.1 Full-Text Search

The application provides full-text search across all entity fields using a client-side search library (Fuse.js or Lunr.js).

**Indexed fields (by entity type):**

| Entity | Indexed Fields |
|--------|---------------|
| TimelineEntry | `title`, `description`, `details`, `tags` |
| Person | `name`, `description`, `role` |
| Place | `name`, `description`, `type` |
| Event | `title`, `description`, `significance` |
| EnvironmentFeature | `name`, `description`, `type` |

**Search behavior:**

- Search is triggered on each keystroke after a minimum of 2 characters.
- Input is debounced at 150ms to avoid excessive re-indexing during fast typing.
- Results are ranked by relevance score (as computed by the search library), with ties broken by chronological order (earliest first).
- Empty search input clears all search filtering and restores the full dataset.
- Search terms are highlighted in result text using `<mark>` elements.

### 4.2 Layer Filters

Layer filters allow the user to show or hide entries by type. Each layer corresponds to a value in the TimelineEntry `layers` field.

| Layer | Label | Default State |
|-------|-------|---------------|
| `event` | Events | Visible |
| `person` | People | Visible |
| `place` | Places | Visible |
| `environment` | Environment | Visible |

- Layers are toggled via checkbox or toggle button controls in the FilterPanel.
- When a layer is hidden, all entries with that layer (and only that layer) in their `layers` array are removed from the timeline and search results.
- Entries that belong to multiple layers remain visible as long as at least one of their layers is active.

### 4.3 Era Filter

- A dropdown or segmented control allows the user to select one or more eras.
- When an era filter is active, only entries belonging to the selected eras are displayed.
- "All Eras" is the default selection.

### 4.4 Date Range Filter

- A dual-handle range slider allows the user to define a custom time window.
- The range slider spans the full data range (earliest `date_start` to latest `date_end`).
- Entries are included if any part of their date range overlaps with the selected window.
- The range slider updates the timeline viewport to match the selected window.

### 4.5 Combined Filter Logic

All active filters are combined using AND logic:

```
visible_entries = entries
  .filter(entry => matchesSearch(entry, searchQuery))
  .filter(entry => matchesLayerFilter(entry, activeLayers))
  .filter(entry => matchesEraFilter(entry, selectedEras))
  .filter(entry => matchesDateRange(entry, dateRangeStart, dateRangeEnd))
```

- The entry count updates in real time as filters change.
- A "Clear All Filters" button resets all filters to their default state.
- The active filter state is reflected in the URL query string so that filter configurations can be shared via URL.

---

## 5. Export Format

### 5.1 Purpose

The export function generates a self-contained JSON file designed for consumption by AI narrators, language models, and other automated systems. The format prioritizes flat structure, completeness, and narrative grounding over compactness.

### 5.2 AI Narrator JSON Format

```json
{
  "export_metadata": {
    "setting": "Vashon Island, WA",
    "generated_at": "2026-03-02T12:00:00Z",
    "entry_count": 247,
    "version": "1.0"
  },
  "eras": [
    {
      "key": "pioneer",
      "name": "Pioneer Settlement",
      "start": "1850",
      "end": "1900",
      "context_summary": "A narrative paragraph summarizing this era's significance to the setting, key themes, and notable developments. Written in a neutral, informative tone suitable for grounding an AI narrator."
    }
  ],
  "entries": [
    {
      "id": "uuid-string",
      "title": "Entry Title",
      "date_start": "1892",
      "date_end": "1895",
      "era": "pioneer",
      "layers": ["event", "person"],
      "description": "Summary text.",
      "details": "Extended narrative text.",
      "tags": ["logging", "settlement"],
      "people": [
        {
          "id": "person-uuid",
          "name": "Person Name",
          "role": "homesteader",
          "description": "Brief biographical note."
        }
      ],
      "places": [
        {
          "id": "place-uuid",
          "name": "Place Name",
          "type": "landmark",
          "coordinates": { "lat": 47.4473, "lng": -122.4635 },
          "description": "Brief place description."
        }
      ],
      "sources": [
        {
          "title": "Source Title",
          "url": "https://example.com/source",
          "type": "secondary"
        }
      ]
    }
  ],
  "people": [
    {
      "id": "person-uuid",
      "name": "Person Name",
      "birth_year": "1845",
      "death_year": "1920",
      "description": "Full biographical description.",
      "role": "homesteader",
      "related_entry_ids": ["uuid-1", "uuid-2"]
    }
  ],
  "places": [
    {
      "id": "place-uuid",
      "name": "Place Name",
      "type": "landmark",
      "coordinates": { "lat": 47.4473, "lng": -122.4635 },
      "description": "Full place description.",
      "related_entry_ids": ["uuid-1", "uuid-3"]
    }
  ],
  "environment_features": [
    {
      "id": "env-uuid",
      "name": "Feature Name",
      "type": "geology",
      "description": "Full feature description.",
      "time_relevance": "~15000 BCE to present"
    }
  ]
}
```

### 5.3 Export Design Principles

- **Flat structure.** All cross-references are resolved inline within entries. An AI narrator consuming the export does not need to perform lookups; each entry contains the full text of its related people and places.
- **Redundancy is acceptable.** The same Person or Place object may appear inline within multiple entries and also in the top-level `people` and `places` arrays. This redundancy is intentional: it allows an LLM to understand any single entry without requiring access to the full file.
- **Context summaries.** Each era includes a `context_summary` field containing a 2-5 sentence narrative overview. These summaries provide grounding for AI narrators that need to establish setting context before improvising within a scene.
- **Source preservation.** All source citations from the original data are included in the export. This allows downstream systems to verify claims or provide attribution.

### 5.4 Export Options

The ExportDialog provides the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| Format | select | AI Narrator JSON | Currently the only format. Future: CSV, Markdown. |
| Scope | select | All Entries | Options: All Entries, Current Filter Results, Selected Era |
| Include Details | checkbox | true | Whether to include the `details` field (extended text) |
| Include Sources | checkbox | true | Whether to include source citations |
| Include Coordinates | checkbox | true | Whether to include geographic coordinates |

---

## 6. Component Specifications

### 6.1 TimelineTrack

The primary visualization component. Renders a horizontal scrollable timeline with entry markers.

**Responsibilities:**
- Render era bands as colored horizontal regions.
- Place entry markers at their correct temporal positions.
- Handle zoom level transitions with smooth animations.
- Handle drag-to-scroll and slider-based navigation.
- Display density indicators at low zoom levels.
- Cluster overlapping markers and show cluster counts.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `entries` | TimelineEntry[] | Filtered entries to display |
| `eras` | Era[] | Era definitions with date ranges and colors |
| `zoomLevel` | number (1-4) | Current zoom level |
| `viewportCenter` | Date | Center date of the current viewport |
| `onEntrySelect` | (id: string) => void | Callback when an entry marker is clicked |
| `onViewportChange` | (center: Date, zoom: number) => void | Callback when viewport changes |

**Dimensions:**
- Minimum height: 200px.
- Full available width of the main content area.
- Markers are positioned vertically by layer to avoid overlap within the same zoom level.

### 6.2 EntryCard

A compact card displaying summary information for a single timeline entry. Used in search results and as a hover preview.

**Responsibilities:**
- Display entry title, date range, era badge, and layer icons.
- Show the description text (truncated to 2 lines with ellipsis if necessary).
- Show count badges for related people, places, and sources.
- Handle click to open the DetailPanel.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `entry` | TimelineEntry | The entry to display |
| `isSelected` | boolean | Whether this card is currently selected |
| `onClick` | () => void | Callback when the card is clicked |

**Dimensions:**
- Width: 100% of the parent container.
- Minimum height: 80px; maximum height: 120px.

### 6.3 DetailPanel

A slide-in panel showing the full content of a selected entry, including all cross-references and sources.

**Responsibilities:**
- Display all fields of the selected entry.
- Render related people as linked items that can be clicked to view Person details.
- Render related places as linked items with optional map coordinates.
- List all sources with clickable URLs.
- Show tags as interactive chips that apply a search filter when clicked.
- Provide a close button and support the Escape key to dismiss.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `entry` | TimelineEntry | The entry to display in full |
| `people` | Person[] | Resolved person records for this entry |
| `places` | Place[] | Resolved place records for this entry |
| `onClose` | () => void | Callback to close the panel |
| `onPersonClick` | (id: string) => void | Callback when a person link is clicked |
| `onPlaceClick` | (id: string) => void | Callback when a place link is clicked |
| `onTagClick` | (tag: string) => void | Callback when a tag chip is clicked |

**Behavior:**
- Slides in from the right side of the viewport.
- Width: 400px on desktop, full width on mobile (breakpoint: 768px).
- Scrollable if content exceeds viewport height.

### 6.4 SearchBar

A text input with type-ahead suggestions for full-text search.

**Responsibilities:**
- Accept text input and trigger search on each keystroke (debounced at 150ms).
- Display a dropdown of up to 8 type-ahead suggestions showing entry titles and types.
- Allow selection of a suggestion via click or keyboard (arrow keys + Enter).
- Show a clear button when the input is non-empty.
- Display the count of matching results.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `onSearch` | (query: string) => void | Callback with the current search query |
| `onSelect` | (id: string) => void | Callback when a suggestion is selected |
| `resultCount` | number | Number of matching results to display |
| `suggestions` | SearchSuggestion[] | Type-ahead suggestions |

**Keyboard shortcuts:**
- `/` (forward slash): Focus the search bar from anywhere in the application.
- `Escape`: Clear the search input and close suggestions.

### 6.5 FilterPanel

A collapsible panel containing all filter controls: layer toggles, era selector, and date range slider.

**Responsibilities:**
- Render toggle controls for each layer.
- Render an era selector (multi-select dropdown or segmented control).
- Render a dual-handle date range slider.
- Display the count of currently visible entries.
- Provide a "Clear All Filters" button.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `activeLayers` | string[] | Currently active layer keys |
| `selectedEras` | string[] | Currently selected era keys |
| `dateRange` | [Date, Date] | Current date range filter bounds |
| `totalCount` | number | Total entry count (unfiltered) |
| `filteredCount` | number | Current filtered entry count |
| `onLayerToggle` | (layer: string) => void | Callback when a layer toggle changes |
| `onEraChange` | (eras: string[]) => void | Callback when era selection changes |
| `onDateRangeChange` | (range: [Date, Date]) => void | Callback when date range changes |
| `onClearAll` | () => void | Callback to reset all filters |

**Behavior:**
- Collapsed by default on mobile; expanded on desktop.
- Toggle button to expand/collapse on all screen sizes.

### 6.6 ExportDialog

A modal dialog for configuring and triggering a JSON export.

**Responsibilities:**
- Present export options (format, scope, inclusion toggles).
- Generate the export JSON based on current data and selected options.
- Provide a download button that triggers a file download.
- Show a progress indicator during generation for large datasets.
- Display the estimated file size before download.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `entries` | TimelineEntry[] | All entries (or filtered, depending on scope) |
| `people` | Person[] | All person records |
| `places` | Place[] | All place records |
| `events` | Event[] | All event records |
| `environmentFeatures` | EnvironmentFeature[] | All environment features |
| `eras` | Era[] | Era definitions with context summaries |
| `onClose` | () => void | Callback to close the dialog |

**Behavior:**
- Opened via an "Export" button in the application header.
- Modal overlay with focus trap for accessibility.
- Downloads a file named `<setting>-export-<date>.json` (e.g., `vashon-island-export-2026-03-02.json`).

---

## 7. Performance Requirements

### 7.1 Load Time

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial page load (empty cache) | Under 2 seconds | Time from navigation start to first interactive timeline render, measured on a mid-range device over a broadband connection |
| Data file fetch and parse | Under 500ms | Time to fetch all JSON files and populate the in-memory store, for up to 500 entries |
| Search index build | Under 200ms | Time to build the full-text search index after data load |

### 7.2 Runtime Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Timeline scrubbing frame rate | 60fps | No dropped frames during continuous drag-to-scroll |
| Zoom level transition | Under 300ms | Time from zoom gesture to completed render at the new zoom level |
| Search result update | Under 100ms | Time from keystroke to rendered search results |
| Filter application | Under 50ms | Time from filter toggle to updated timeline and result count |

### 7.3 Data Size Constraints

| Constraint | Limit | Rationale |
|------------|-------|-----------|
| JSON file size per setting | Under 1MB total | Ensures fast loading on mobile connections |
| Maximum entries per setting | 500 (prototype target) | Keeps client-side computation and rendering performant |
| Export file size | Under 2MB | Practical limit for LLM context window consumption |

### 7.4 Browser Support

The application must function correctly in the following browsers:

- Chrome 100+
- Firefox 100+
- Safari 16+
- Edge 100+

Mobile browsers (Chrome for Android, Safari for iOS) are supported at reduced functionality: touch-based scrubbing replaces drag, and the DetailPanel opens full-screen.

---

## 8. Accessibility Requirements

### 8.1 Compliance Standard

The application must conform to WCAG 2.1 Level AA. All interactive elements, data displays, and navigation patterns must meet or exceed AA criteria.

### 8.2 Keyboard Navigation

| Action | Key(s) | Context |
|--------|--------|---------|
| Move viewport left | Left Arrow | Timeline focused |
| Move viewport right | Right Arrow | Timeline focused |
| Zoom in | `+` or `=` | Timeline focused |
| Zoom out | `-` | Timeline focused |
| Select next entry | Tab | Timeline focused |
| Select previous entry | Shift+Tab | Timeline focused |
| Open selected entry | Enter | Entry marker focused |
| Close DetailPanel | Escape | DetailPanel open |
| Focus search bar | `/` | Global |
| Clear search | Escape | SearchBar focused |
| Navigate suggestions | Up/Down Arrow | SearchBar focused with suggestions |
| Select suggestion | Enter | SearchBar suggestion focused |

All keyboard shortcuts must be documented in an accessible help dialog opened by pressing `?`.

### 8.3 Screen Reader Support

- All timeline entries must have descriptive `aria-label` attributes that include the title, date, and entry type.
- Era bands must be announced with their name and date range.
- The density indicator must provide a text alternative (e.g., "45 entries in the Pioneer era, 1850 to 1900").
- Dynamic content updates (search results, filter changes) must use `aria-live` regions with `polite` priority.
- The DetailPanel must announce its opening and set focus to the panel heading.
- Cluster markers must announce the count and date range (e.g., "Cluster of 5 entries near 1892").

### 8.4 Visual Accessibility

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Color contrast (text) | 4.5:1 minimum ratio | All text on all backgrounds meets AA ratio |
| Color contrast (large text) | 3:1 minimum ratio | Headings and UI labels meet AA ratio |
| Color contrast (UI components) | 3:1 minimum ratio | Buttons, inputs, and interactive elements meet AA ratio |
| Non-color indicators | Required | All information conveyed by color must also be conveyed by shape, pattern, or text. Era bands use both color and label. Layer icons use both color and distinct icons. |
| Focus indicators | Visible and high-contrast | All focusable elements display a visible focus ring. Focus ring meets 3:1 contrast ratio against adjacent colors. |
| Text resizing | Up to 200% | Layout remains functional when text is resized to 200% via browser settings |
| Reduced motion | Supported | When `prefers-reduced-motion` is set to `reduce`, all animations are disabled (snap, zoom transitions, panel slide). |

### 8.5 Semantic HTML

- Use `<nav>` for the filter and search area.
- Use `<main>` for the timeline and content area.
- Use `<article>` for EntryCard and DetailPanel content.
- Use `<aside>` for the DetailPanel container.
- Use heading hierarchy (`<h1>` through `<h4>`) consistently: page title as `<h1>`, section headers as `<h2>`, entry titles within panels as `<h3>`.

---

*End of Functional Requirements Document.*
