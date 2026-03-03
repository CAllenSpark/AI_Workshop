# Visual Design Strategy: Creative/Fictional Layer

**Version:** 1.0
**Owner:** Designer
**Date:** 2026-03-03
**Status:** Proposal
**Depends on:** Design Bible v1.0, FRD v1.0, PRD v1.0

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Classification Visual Language](#2-classification-visual-language)
3. [Color Palette Extension](#3-color-palette-extension)
4. [Timeline Layering](#4-timeline-layering)
5. [People Timeline Design](#5-people-timeline-design)
6. [Narrative Dashboard](#6-narrative-dashboard)
7. [Card Design Evolution](#7-card-design-evolution)
8. [Iconography Extension](#8-iconography-extension)
9. [CSS Custom Properties Extension](#9-css-custom-properties-extension)
10. [Implementation Notes](#10-implementation-notes)

---

## 1. Design Philosophy

### The Core Tension

The Writer's Research Companion currently serves one kind of truth: historical fact. Adding a creative layer introduces a second kind of truth: narrative invention. The central design challenge is that both must coexist in the same interface without the user ever confusing one for the other, yet both must feel like they belong to the same system.

This is not two apps stitched together. It is one knowledge base with two registers of authority.

### Extended Principles

The existing four principles (Minimal, Layered, Temporal, Grounded) remain unchanged. The creative layer introduces one refinement to each:

| Principle | Historical Register | Creative Register |
|-----------|-------------------|-------------------|
| **Minimal** | Every element earns its place through factual utility. | Creative elements earn their place through narrative utility. Decoration that does not serve the writer's story is removed. |
| **Layered** | Four data layers (Events, People, Places, Environment) distinguished by color and icon. | A fifth dimension -- provenance -- is added. Every entry now carries a classification: historical, creative, or hybrid. This is orthogonal to the four data layers, not a replacement. |
| **Temporal** | Time is the primary axis, anchored to real chronology. | Creative entries anchor to the same real chronology. A fictional character born in 1920 occupies the same temporal space as real events of 1920. The timeline does not split into two tracks -- it deepens. |
| **Grounded** | Pacific Northwest field notebook aesthetic. | Creative entries use the same notebook aesthetic but with a subtle visual shift -- as if the writer has picked up a different pen. The metaphor is ink color, not a different notebook. |

### The "Different Pen" Metaphor

The governing metaphor for the entire creative layer is this: a researcher's field notebook where factual observations are written in standard ink, and the writer's imaginative additions are written in a second, distinguishable ink -- visible, intentional, but clearly the work of a different mode of thought.

This metaphor informs every decision below. Historical entries use the existing solid, grounded visual treatments. Creative entries use a visual language that is slightly more open, slightly less anchored: dashed lines instead of solid, a cooler palette with violet tones instead of earth tones, and subtle texture where the historical layer is clean.

---

## 2. Classification Visual Language

### 2.1 The Three Classifications

Every entry in the knowledge base carries exactly one provenance classification:

| Classification | Definition | Example |
|---------------|-----------|---------|
| **Historical** | Grounded in documented fact. Supported by at least one cited source. | "Mosquito Fleet steamboat service, c. 1890-1920" |
| **Creative** | Invented by the writer. No factual basis required. Exists only within the narrative. | "Elara Whitfield, fictional lighthouse keeper, b. 1895" |
| **Hybrid** | A fictional element that intersects with or depends on a real historical fact. | "Elara Whitfield witnesses the 1918 influenza outbreak on the island" |

Classification is orthogonal to layer type. A creative entry can be an Event, a Person, a Place, or an Environment feature. The four layer colors (Amber, Teal, Forest Green, Earth Brown) remain unchanged. Classification is communicated through a separate, additive set of visual cues applied on top of the layer color.

### 2.2 Visual Cue System

The classification system uses four simultaneous signals. No single signal carries the full burden of distinction -- they reinforce each other so that the classification is perceptible through color alone, shape alone, pattern alone, or label alone.

#### Signal 1: Border Treatment

| Classification | Border Style | Rationale |
|---------------|-------------|-----------|
| Historical | **Solid** 1px border, existing `Border (#D1CCC4)` | The default. Unchanged from the current system. Solid = established, factual. |
| Creative | **Dashed** 2px border, `Twilight Violet (#7B5EA7)` | Dashed = imagined, not yet fixed. The slightly thicker stroke compensates for the visual weight lost by dashing. |
| Hybrid | **Dot-dash** 2px border, alternating solid and dashed segments, `Dusk Purple (#6B5B8A)` | The alternation represents the blend of factual and fictional. |

The left-side layer color indicator (the 4px vertical bar on cards) remains unchanged for all three classifications. Classification modifies the surrounding border, not the layer indicator.

#### Signal 2: Background Tint

| Classification | Card Background | Rationale |
|---------------|----------------|-----------|
| Historical | `White (#FFFFFF)` | Clean, unadorned. The existing treatment. |
| Creative | `Creative Violet BG (#F0EBF5)` -- a barely-there lavender tint | Shifts the card into a cooler tone without competing with layer colors. Subtle enough to not overwhelm; visible enough to register in peripheral vision. |
| Hybrid | `Hybrid Warm BG (#F5EDE4)` -- a very faint warm cream, slightly darker than Parchment | Bridges between the clean white of historical and the cool tint of creative. Warm because hybrid entries are anchored in real history. |

#### Signal 3: Provenance Badge

A small classification badge appears in the top-right corner of every card, using the Caption typographic style (12px, 500 weight, 0.02em tracking, uppercase).

| Classification | Badge Text | Badge Color | Badge Background |
|---------------|-----------|-------------|-----------------|
| Historical | `HIST` | `Charcoal (#2C2C2C)` | `Surface (#E8E4DD)` |
| Creative | `FICTION` | `Twilight Violet (#7B5EA7)` | `Creative Violet BG (#F0EBF5)` |
| Hybrid | `HYBRID` | `Dusk Purple (#6B5B8A)` | `Hybrid Warm BG (#F5EDE4)` |

Badge dimensions: height 20px, padding 4px 8px, border-radius 4px. The badge is always visible and does not require hover to discover.

#### Signal 4: Subtle Texture (Creative and Hybrid Only)

Creative and hybrid cards receive a barely-perceptible diagonal line pattern in their background. This is the visual equivalent of notebook paper with a different ruling -- the same notebook, a different section.

| Property | Value |
|----------|-------|
| Pattern | 45-degree diagonal lines |
| Line color | `rgba(123, 94, 167, 0.04)` for creative; `rgba(107, 91, 138, 0.04)` for hybrid |
| Line width | 1px |
| Line spacing | 12px |
| Rendering | CSS `repeating-linear-gradient`, no image assets |

This texture is intentionally very faint. It should be noticeable when comparing a historical card directly next to a creative card, but not distracting when viewing creative cards in isolation.

### 2.3 Summary Matrix

```
                  Historical          Creative              Hybrid
                  ──────────          ────────              ──────
Border:           solid 1px gray      dashed 2px violet     dot-dash 2px purple
Background:       white               lavender tint         warm cream tint
Badge:            HIST (gray)         FICTION (violet)      HYBRID (purple)
Texture:          none                diagonal lines        diagonal lines
Left bar:         layer color         layer color           layer color
Layer icon:       standard            standard + feather    standard + link icon
Timeline marker:  filled shape        outlined shape        half-filled shape
```

---

## 3. Color Palette Extension

### 3.1 New Colors

The creative palette draws from the Pacific Northwest twilight -- the transition from day into evening, when the landscape shifts from green and brown certainties into violet and blue-gray ambiguities. This is the imaginative hour, where the grounded world softens into possibility.

| Role | Name | Hex | Contrast vs Parchment | Contrast vs White | WCAG AA | Usage |
|------|------|-----|----------------------|-------------------|---------|-------|
| Creative Primary | Twilight Violet | `#7B5EA7` | 4.63:1 | 5.25:1 | Pass (normal text) | Primary creative indicator, creative card borders, creative filter chip, fiction badge text |
| Creative Accent | Narrative Rose | `#944F6B` | 5.16:1 | 5.85:1 | Pass (normal text) | Creative entry highlights, selected creative states, narrative dashboard accents |
| Creative Secondary | Dusk Purple | `#6B5B8A` | 5.31:1 | 6.02:1 | Pass (normal text) | Hybrid indicators, secondary creative UI, muted creative labels |
| Creative BG | Violet Wash | `#F0EBF5` | -- | -- | -- (surface only) | Creative card background tint, creative panel areas |
| Creative BG Alt | Rose Wash | `#F5EBF0` | -- | -- | -- (surface only) | Narrative dashboard surface, creative detail panel areas |
| Hybrid BG | Warm Mist | `#F5EDE4` | -- | -- | -- (surface only) | Hybrid card background, transitional surfaces |

All text-carrying creative colors pass WCAG AA at 4.5:1 contrast ratio against Parchment (#F5F0E8). All pass at even higher ratios against White (#FFFFFF).

### 3.2 Palette Relationship Diagram

```
HISTORICAL PALETTE (existing)            CREATIVE PALETTE (new)
earth, water, forest                     twilight, dusk, imagination
─────────────────────                    ─────────────────────────

  Forest Green #2D5F3E ─────────────────── Dusk Purple  #6B5B8A
  (grounded, factual)                      (blended, transitional)
                            \
  Warm Amber   #C8913A ──────────────────── Narrative Rose #944F6B
  (highlight, warmth)                       (creative highlight)
                            \
  Slate Blue   #4A6D8C ──────────────────── Twilight Violet #7B5EA7
  (secondary, cool)                         (creative primary)

  Parchment    #F5F0E8 ──────────────────── Violet Wash  #F0EBF5
  (historical surface)                      (creative surface)

  SHARED: Charcoal (#2C2C2C) for all primary text
  SHARED: All layer colors (Amber, Teal, Forest, Brown) unchanged
```

### 3.3 Design Rationale

Why violet/purple and not, for example, blue or red?

1. **Distinctness from existing layers.** The four layer colors occupy amber, teal, green, and brown -- collectively covering the warm-to-cool-to-earth spectrum. Violet sits in the one unused region of the color wheel relative to these four.

2. **Cultural association.** Violet and purple carry longstanding associations with imagination, creativity, and the liminal -- appropriate for fictional content. They do not carry the warning connotations of red or the factual/informational connotations of blue (which would conflict with Slate Blue).

3. **PNW coherence.** The Pacific Northwest twilight sky frequently presents deep violets and rose tones. These colors are native to the setting's visual world, not imported from an alien palette.

4. **Reduced saturation.** All three creative colors are muted (low chroma). They do not scream; they quietly distinguish. This preserves the field-notebook aesthetic.

---

## 4. Timeline Layering

### 4.1 Vertical Strategy

The timeline track currently uses horizontal lanes for the four data layers. The creative/historical distinction is not represented as a separate lane. Instead, it modifies the markers within existing lanes.

**Rationale:** Adding separate lanes for "historical Events" and "creative Events" would double the vertical space requirement and break the spatial relationship between events that share a time period. The user's stated goal -- "see on the timeline how characters and narrative events sit on top of the historical ones" -- is better served by visual differentiation within shared lanes, with a stacking order that places creative markers above historical ones.

### 4.2 Marker Differentiation

| Classification | Marker Shape | Marker Fill | Marker Border |
|---------------|-------------|-------------|---------------|
| Historical | Filled shape (existing: circle, triangle, square, diamond) | Solid layer color, 100% opacity | None |
| Creative | **Outlined** shape (same geometry, hollow center) | White or Parchment fill | 2px stroke in layer color |
| Hybrid | **Half-filled** shape (left half solid, right half outlined) | Half layer color, half white | 1px stroke in layer color |

This creates an immediate visual distinction: filled markers are facts, outlined markers are fiction, half-filled markers are where fiction meets fact.

### 4.3 Stacking and Z-Order

When historical and creative markers occupy the same temporal position:

```
  Historical eras and labels (unchanged)
  ├────────────────────────────────────────────────────────┤

  Creative markers     ○   ○          ○    △        ○      ← z-index: 2 (on top)
  Historical markers   ●       ●  ●     ▲    ●  ●     ●   ← z-index: 1 (below)

  Density strip        ░░░░░░████░░░░░░░░░██████░░░░░░░░░
```

Creative markers render on top of historical markers. When they overlap, the outlined (creative) marker sits above the filled (historical) marker, allowing both to remain partially visible. The hollow center of the creative marker lets the historical marker show through underneath.

### 4.4 Density Strip Extension

The density strip at the bottom of the timeline gains a layered visualization:

| Layer | Rendering |
|-------|-----------|
| Historical density | Existing behavior: layer color at 20/50/80% opacity |
| Creative density | Same layer color but rendered as a **hatched** pattern (diagonal lines) at 20/50/80% opacity |
| Combined | Historical solid bar on bottom, creative hatched bar stacked on top |

This allows the user to see at a glance where creative content has been added relative to historical content density.

### 4.5 Toggle Behavior

The filter bar gains a new control group for provenance filtering:

```
  [● Events] [● People] [● Places] [● Env]    |    [■ Historical] [□ Creative] [◧ Hybrid]
```

The provenance toggles are visually separated from the layer toggles by a vertical divider. They use the same pill-chip style but with the creative palette colors.

| Toggle | Active State | Inactive State |
|--------|-------------|----------------|
| Historical | `Surface (#E8E4DD)` bg, `Charcoal` text, filled square icon | `Surface` bg, `Warm Gray` text |
| Creative | `Violet Wash (#F0EBF5)` bg, `Twilight Violet` text, outlined square icon | `Surface` bg, `Warm Gray` text |
| Hybrid | `Warm Mist (#F5EDE4)` bg, `Dusk Purple` text, half-filled square icon | `Surface` bg, `Warm Gray` text |

**Default state:** All three provenance toggles are active. The user opts out of classifications they want to hide, not opts in.

**Interaction with layer toggles:** Provenance and layer toggles are independent filters that combine with AND logic. Toggling off "Creative" hides all creative entries regardless of layer. Toggling off "Events" hides all events regardless of provenance. Toggling off both "Creative" and "Events" means: show only historical and hybrid entries that are not events.

### 4.6 View Mode Shortcuts

For common use cases, the filter bar includes two quick-access view modes:

| Mode | Label | Behavior |
|------|-------|----------|
| Research Mode | `Research` | Shows only Historical entries. Equivalent to toggling off Creative and Hybrid. |
| Story Mode | `Story` | Shows all three classifications. The default. |

These are mutually exclusive radio-style buttons positioned to the right of the provenance toggles. They do not replace the individual toggles; they are shortcuts that set toggle states in bulk.

---

## 5. People Timeline Design

### 5.1 Overview

The People Timeline is a new view that shows lifespans as horizontal bars, allowing the writer to see who was alive at any given time and which real and fictional characters are contemporaries.

This view is accessed via a tab or toggle at the top of the main content area:

```
  [Timeline View]   [People View]   [Narrative Dashboard]
```

### 5.2 Lifespan Bar Specifications

Each person is represented as a horizontal bar spanning from birth year to death year (or to the present, if still living or if death year is unknown).

| Property | Value |
|----------|-------|
| Bar height | 24px |
| Bar spacing (vertical gap) | 4px between bars |
| Bar border-radius | 4px (slightly rounded) |
| Bar fill -- historical person | Solid `People Teal (#3A8C8C)` at 80% opacity |
| Bar fill -- creative person | `Twilight Violet (#7B5EA7)` at 60% opacity with diagonal line texture (2px lines, 8px spacing, white at 30% opacity) |
| Bar fill -- hybrid person | Linear gradient from `People Teal` (left) to `Twilight Violet` (right) at 70% opacity |
| Bar border -- historical | None |
| Bar border -- creative | 1.5px dashed `Twilight Violet (#7B5EA7)` |
| Bar border -- hybrid | 1.5px dot-dash `Dusk Purple (#6B5B8A)` |
| Label | Person's name, Body Small (14px), positioned inside the bar if it fits, otherwise to the right of the bar |
| Label color | `Charcoal (#2C2C2C)` on light bars; `White (#FFFFFF)` on dark bars |

### 5.3 Sorting and Grouping

The vertical axis sorts people by birth year (earliest at top). Within the same birth year, historical people sort above creative people.

Optional grouping modes accessible via a dropdown:

| Mode | Behavior |
|------|----------|
| **Chronological** (default) | Sorted by birth year, all people intermixed |
| **By Classification** | Two swim lanes -- "Historical Figures" above, "Fictional Characters" below, separated by a labeled divider |
| **By Role** | Grouped by role tag (e.g., "Homesteaders," "Government Officials," "Fictional Protagonists") |
| **By Narrative** | Grouped by story/project association (for writers tracking multiple narratives) |

### 5.4 Contemporaries at a Glance

When the user positions the playhead (vertical scrubber line) at a specific date, the bars that span that date are highlighted and all others are dimmed.

| State | Bar opacity | Label treatment |
|-------|------------|-----------------|
| Active (alive at playhead date) | 100% opacity, full color | Bold weight (600), full Charcoal |
| Inactive (not alive at playhead date) | 30% opacity | Regular weight (400), `Warm Gray (#6B6560)` |
| Hovered | 100% opacity + glow shadow: `0 0 8px rgba(58, 140, 140, 0.3)` for historical, `0 0 8px rgba(123, 94, 167, 0.3)` for creative | Bold weight, underline |

### 5.5 Interaction Design

| Interaction | Behavior |
|-------------|----------|
| **Hover** on bar | Tooltip appears showing: name, birth-death years, role, classification badge (HIST/FICTION/HYBRID). Tooltip uses the standard dark surface style. |
| **Click** on bar | Opens person's detail panel on the right. The detail panel shows full biographical information, related timeline entries, and (for creative characters) narrative notes. |
| **Drag playhead** | Vertical line moves horizontally. Active/inactive states update in real time. A count badge appears at the top of the playhead: "12 people alive" (updates as playhead moves). |
| **Scroll** | Vertical scroll when there are more people than fit in the viewport. The horizontal time axis and playhead remain fixed at the top. |
| **Zoom** | Same zoom controls as the main timeline. Zooming in expands the horizontal time scale, making bars wider and date labels more granular. |

### 5.6 ASCII Wireframe -- People Timeline View

```
+============================================================================+
|  Writer's Research Companion                                               |
|============================================================================|
|                                                                            |
|  [Search entries...              ]   [Hist] [Fict] [Hybr]                  |
|                                                                            |
|  [Timeline View]   [*People View*]   [Narrative Dashboard]                 |
|                                                                            |
|  Sort: [Chronological v]                     Zoom: [+][-][fit]             |
|                                                                            |
|  -------- 1800 --------- 1850 --------- 1900 --------- 1950 ---- 2000 -  |
|           :              :              :      |        :          :       |
|  HISTORICAL FIGURES                            |                           |
|           :              :              :      |        :          :       |
|  S'Homamish Chief ===    :              :      |        :          :       |
|           :  Alvin Crosby ===============      |        :          :       |
|           :              :  Lucy Gerand ====== |===     :          :       |
|           :              :    Magnus Anderson =|=====   :          :       |
|           :              : Takeo Mukai   ======|============      :       |
|           :              :              :  B.MacDonald ==|====    :       |
|           :              :              :      |     Bruce Haulman =====  |
|           :              :              :      |        :          :       |
|  FICTIONAL CHARACTERS ........................................    [FICT]   |
|           :              :              :      |        :          :       |
|  - - Elara Whitfield - - - - - - -===========- - -     :          :       |
|           :              :     - - Jack Mercer - -==- - -          :       |
|           :              :              :      |- -Yuki Tanaka = - :       |
|           :              :              :      |        :          :       |
|           :              :              :      |        :          :       |
|  -------- 1800 --------- 1850 --------- 1900 -+------- 1950 ---- 2000 -  |
|                                                |                           |
|                                         PLAYHEAD                           |
|                                         1932                               |
|                                         7 people alive                     |
|                                                                            |
+============================================================================+

LEGEND:
  ========   Historical lifespan bar (solid teal)
  = = = =    Creative lifespan bar (dashed violet, textured fill)
  ........   Classification divider (only in "By Classification" sort mode)
     |       Playhead (vertical scrubber, amber accent)
```

### 5.7 Detail Panel for People View

When a person bar is clicked, the detail panel opens with the following structure:

```
+------------------------------------+
|  [x close]                         |
|                                    |
|  [HIST] or [FICTION] or [HYBRID]   |
|  PERSON                            |
|                                    |
|  Full Name                         |
|  b. 1895 -- d. 1962               |
|  Role: Lighthouse Keeper           |
|                                    |
|  ---------------------------------|
|                                    |
|  BIOGRAPHY / CHARACTER NOTES       |
|  Full biographical text or         |
|  character description with        |
|  narrative context...              |
|                                    |
|  ---------------------------------|
|                                    |
|  CONTEMPORARIES (alive at same     |
|  time as this person)              |
|  [bar] Magnus Anderson (HIST)      |
|  [bar] Takeo Mukai (HIST)          |
|  [bar] Jack Mercer (FICTION)       |
|                                    |
|  ---------------------------------|
|                                    |
|  RELATED TIMELINE ENTRIES          |
|  [card] 1918 Influenza Outbreak    |
|  [card] Lighthouse Construction    |
|                                    |
|  ---------------------------------|
|                                    |
|  SOURCES  (historical only)        |
|  1. Vashon Heritage Museum         |
|  2. King County Records            |
|                                    |
|  NARRATIVE NOTES (creative only)   |
|  Story: "Keeper of the Light"      |
|  Arc: Protagonist                  |
|  First appears: Chapter 3          |
|                                    |
+------------------------------------+
```

The "Contemporaries" section is unique to the People view detail panel. It lists other people (both historical and creative) whose lifespans overlap with the selected person, sorted by overlap duration (most overlap first). Each entry is clickable and navigates to that person's detail.

---

## 6. Narrative Dashboard

### 6.1 Purpose

The Narrative Dashboard is a writer-focused view that surfaces the structure of the creative layer: character arcs, plot threads, and how the fictional narrative weaves through real history. It is not a replacement for the timeline -- it is a companion that provides a story-level overview.

### 6.2 Information Architecture

The dashboard surfaces four categories of information:

| Section | What It Shows | Why It Matters |
|---------|--------------|----------------|
| **Character Registry** | All creative and hybrid people, with role, lifespan, and narrative association | Quick reference for the writer's cast of characters |
| **Plot Thread Tracker** | Named narrative threads (e.g., "The Lighthouse Mystery," "Immigration Story") with their associated entries listed chronologically | Helps the writer see the shape of each storyline against real history |
| **Historical Anchors** | Historical entries that hybrid entries depend on, grouped by plot thread | Shows the writer exactly which real facts their fiction relies upon |
| **Coverage Gaps** | Eras or date ranges where the writer has historical content but no creative entries, or creative entries with no historical grounding | Identifies where the story might need more research or more invention |

### 6.3 Layout

The dashboard uses a two-column layout on desktop (reversing to single-column stacked on tablet and mobile).

### 6.4 ASCII Wireframe -- Narrative Dashboard

```
+============================================================================+
|  Writer's Research Companion                                               |
|============================================================================|
|                                                                            |
|  [Timeline View]   [People View]   [*Narrative Dashboard*]                 |
|                                                                            |
+======================================+=====================================+
|                                      |                                     |
|  CHARACTER REGISTRY                  |  PLOT THREADS                       |
|  ──────────────────                  |  ────────────                       |
|                                      |                                     |
|  Sort: [Name v]  Filter: [All v]     |  + Add Thread                       |
|                                      |                                     |
|  ┌────────────────────────────────┐  |  ┌─────────────────────────────────┐|
|  | [FICT] Elara Whitfield         |  |  | The Lighthouse Mystery          ||
|  | b.1895 d.1962 | Protagonist    |  |  | ──────────────────              ||
|  | Threads: Lighthouse, Community |  |  |                                 ||
|  | 5 entries | 3 hybrid           |  |  | 1895  Elara born         [FICT] ||
|  └────────────────────────────────┘  |  | 1912  Lighthouse built   [HIST] ||
|                                      |  | 1915  Elara arrives      [HYBR] ||
|  ┌────────────────────────────────┐  |  | 1918  Influenza          [HYBR] ||
|  | [FICT] Jack Mercer             |  |  | 1923  Storm damage       [HIST] ||
|  | b.1890 d.1945 | Antagonist     |  |  | 1924  Elara's discovery  [FICT] ||
|  | Threads: Lighthouse            |  |  | 1932  Jack confrontation [FICT] ||
|  | 3 entries | 1 hybrid           |  |  |                                 ||
|  └────────────────────────────────┘  |  | Historical anchors: 2           ||
|                                      |  | Creative entries: 5             ||
|  ┌────────────────────────────────┐  |  | Era coverage: Pioneer, Early-   ||
|  | [HYBR] Yuki Tanaka             |  |  |   20th-Century                  ||
|  | b.1920 d.-- | Supporting       |  |  └─────────────────────────────────┘|
|  | Threads: Community             |  |                                     |
|  | 2 entries | 2 hybrid           |  |  ┌─────────────────────────────────┐|
|  └────────────────────────────────┘  |  | Community Roots                  ||
|                                      |  | ──────────────────               ||
|                                      |  |                                  ||
|  ──────────────────────────────────  |  | 1920  Yuki born          [FICT] ||
|                                      |  | 1925  Mukai Orchard      [HIST] ||
|  COVERAGE GAPS                       |  | 1930  Yuki at school     [HYBR] ||
|  ──────────────                      |  | 1942  Internment         [HIST] ||
|                                      |  | 1942  Yuki's departure   [HYBR] ||
|  [!] Pioneer Era (1865-1893)         |  |                                  ||
|      3 historical entries            |  | Historical anchors: 2            ||
|      0 creative entries              |  | Creative entries: 3              ||
|      Consider adding characters      |  └─────────────────────────────────┘|
|      for this period.                |                                     |
|                                      |                                     |
|  [!] Modern Era (1960-present)       |  HISTORICAL ANCHORS                 |
|      8 historical entries            |  ───────────────────                |
|      0 creative entries              |                                     |
|      Rich historical context         |  Entries that fiction depends on:   |
|      available for story use.        |                                     |
|                                      |  [card] Lighthouse Construction     |
|  [ ] WWII Era (1940-1945)            |         Used by: Lighthouse (3x)    |
|      Good coverage: 4 hist, 2 cre   |                                     |
|                                      |  [card] 1918 Influenza Outbreak     |
|                                      |         Used by: Lighthouse (1x)    |
|                                      |                                     |
|                                      |  [card] Mukai Orchard Operations    |
|                                      |         Used by: Community (1x)     |
|                                      |                                     |
|                                      |  [card] Japanese-American Internment|
|                                      |         Used by: Community (1x)     |
|                                      |                                     |
+======================================+=====================================+
```

### 6.5 Character Registry Card

The character registry card is a compact variant of the entry card, tailored for the narrative context.

| Property | Value |
|----------|-------|
| Width | Fill column (min 280px) |
| Padding | 12px |
| Background | `Violet Wash (#F0EBF5)` for fiction, `Warm Mist (#F5EDE4)` for hybrid |
| Border | 1px dashed `Twilight Violet` for fiction, dot-dash `Dusk Purple` for hybrid |
| Border-radius | 8px |
| Badge | Classification badge, top-right, same spec as Section 2 |
| Name | H4 style (16px, 600 weight) |
| Dates + Role | Data Label style, on one line, separated by pipe |
| Thread list | Caption style, `Twilight Violet` text |
| Entry count | Caption style, `Warm Gray` text |
| Click action | Opens person detail panel |

### 6.6 Plot Thread Card

| Property | Value |
|----------|-------|
| Width | Fill column (min 320px) |
| Padding | 16px |
| Background | `White (#FFFFFF)` |
| Border | 1px `Border (#D1CCC4)` |
| Border-radius | 8px |
| Title | H3 style (20px, Merriweather, 700) |
| Entry list | Vertical timeline with date, title, and classification badge for each entry. Entries are listed chronologically. |
| Entry date | Data Label style (mono, 13px) |
| Entry title | Body Small (14px), clickable (opens detail) |
| Entry badge | Inline pill: HIST, FICT, or HYBR in classification colors |
| Statistics | Caption style, bottom of card. Shows counts of historical anchors, creative entries, and era coverage. |

### 6.7 Coverage Gap Indicators

Coverage gaps use the Warning semantic color (`#C8913A`) and the `alert-triangle` Lucide icon. They are displayed in a stack below the character registry.

| Severity | Style | Criteria |
|----------|-------|----------|
| Active gap | Amber left border (4px), amber icon, Body Small text | Era has 3+ historical entries and 0 creative entries |
| Soft gap | Warm Gray left border (4px), info icon, Body Small text | Era has historical entries but creative entries do not reference any of them as hybrid |
| Good coverage | Green left border (4px), check icon, Caption text | Era has both historical and creative entries with at least one hybrid link |

---

## 7. Card Design Evolution

### 7.1 Historical Entry Card (Minimal Changes)

The existing entry card receives only the addition of the provenance badge. All other styling remains unchanged.

```
  ┌──────────────────────────────────────────┐
  │▌ Title of Entry                    [HIST]│
  │▌ c. 1890 . Events                        │
  │▌ Brief one-line description of the       │
  │▌ entry content, truncated if needed...   │
  └──────────────────────────────────────────┘

  Border:      1px solid #D1CCC4 (unchanged)
  Background:  #FFFFFF (unchanged)
  Left bar:    Layer color (unchanged)
  New element: [HIST] badge, top-right corner
```

The badge is the only addition to historical cards. This preserves backward compatibility and avoids visual regression for users who are only working with historical data.

### 7.2 Creative Entry Card

```
  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  ▌ Title of Entry                   [FICTION]
  ▌ c. 1920 . People       ✦ Lighthouse Story
  ▌ Brief one-line description of the
  ▌ fictional entry content...
  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘

  Border:      2px dashed #7B5EA7
  Background:  #F0EBF5 + diagonal line texture
  Left bar:    Layer color (same system as historical)
  Badge:       [FICTION] in Twilight Violet on Violet Wash bg
  Thread tag:  ✦ followed by thread name, Narrative Rose, Caption style
  Hover:       Shadow uses violet tint: 0 2px 8px rgba(123, 94, 167, 0.12)
```

The creative card introduces three new visual elements:
1. Dashed border in Twilight Violet
2. Lavender background tint with subtle diagonal texture
3. Thread tag showing which narrative thread this entry belongs to (preceded by a small diamond character)

### 7.3 Hybrid Entry Card

```
  ┌─ . ─ . ─ . ─ . ─ . ─ . ─ . ─ . ─ . ─ .┐
  │▌ Title of Entry                  [HYBRID]│
  │▌ c. 1918 . Events       ✦ Lighthouse     │
  │▌ Fictional character witnesses a real     │
  │▌ historical event...                      │
  │                                           │
  │  Anchored to: 1918 Influenza Outbreak     │
  └─ . ─ . ─ . ─ . ─ . ─ . ─ . ─ . ─ . ─ .─┘

  Border:      2px dot-dash #6B5B8A
  Background:  #F5EDE4 + diagonal line texture (fainter)
  Left bar:    Layer color (same system)
  Badge:       [HYBRID] in Dusk Purple on Warm Mist bg
  Thread tag:  ✦ followed by thread name, Narrative Rose, Caption style
  Anchor link: "Anchored to:" label + clickable historical entry reference
  Hover:       Shadow uses dusk tint: 0 2px 8px rgba(107, 91, 138, 0.12)
```

The hybrid card has one unique element: the "Anchored to:" reference at the bottom, which shows which historical entry this hybrid entry is grounded in. This is clickable and navigates to the historical entry's detail view.

### 7.4 Side-by-Side Comparison

```
  HISTORICAL                      CREATIVE                        HYBRID
  ────────────────────────        ────────────────────────        ────────────────────────
  ┌──────────────────────┐        ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐        ┌─ . ─ . ─ . ─ . ─ . ┐
  │▌ Mosquito Fleet      │        ▌ Elara Whitfield      │        │▌ Elara Witnesses     │
  │▌ [HIST]              │        ▌ [FICTION]             │        │▌ [HYBRID]            │
  │▌                     │        ▌                       │        │▌                     │
  │▌ c. 1890 . Event     │        ▌ b. 1895 . Person     │        │▌ 1918 . Event        │
  │▌                     │        ▌ ✦ Lighthouse          │        │▌ ✦ Lighthouse        │
  │▌ A network of small  │        ▌ Fictional lighthouse  │        │▌ Elara experiences   │
  │▌ steamboats serving  │        ▌ keeper, Pt Robinson   │        │▌ the 1918 influenza  │
  │▌ the island...       │        ▌ station. Protagonist. │        │▌ outbreak firsthand  │
  │                      │                                │        │                      │
  │                      │                                │        │  Anchor: Influenza   │
  └──────────────────────┘        └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘        └─ . ─ . ─ . ─ . ─ .─┘

  Solid border                    Dashed violet border             Dot-dash purple border
  White background                Lavender tint + texture          Warm cream tint + texture
  No thread tag                   Thread tag present               Thread tag + anchor link
```

### 7.5 Detail Panel Evolution

The detail panel (right side, 400px) gains new sections for creative and hybrid entries:

**New sections for Creative entries:**

| Section | Content |
|---------|---------|
| NARRATIVE CONTEXT | Which plot thread(s) this entry belongs to, the character's role in the story, and any writer notes. |
| CHARACTER RELATIONSHIPS | For people: links to other creative and hybrid characters they interact with. |

**New sections for Hybrid entries:**

| Section | Content |
|---------|---------|
| HISTORICAL BASIS | The historical entry or entries this hybrid entry is anchored to, displayed as clickable cross-reference cards with the HIST badge. |
| NARRATIVE CONTEXT | Same as creative entries. |
| FACT vs. FICTION | A brief note (written by the author) explaining what is factual and what is invented in this entry. This is optional but strongly encouraged for hybrid entries. |

**Section ordering in detail panel:**

```
  Historical:   Header > Description > Sources > Cross-References
  Creative:     Header > Description > Narrative Context > Character Relationships > Cross-References
  Hybrid:       Header > Description > Historical Basis > Fact vs. Fiction > Narrative Context > Sources > Cross-References
```

The header area uses the classification badge prominently (larger, 24px height instead of 20px) and the background tint of the detail panel shifts to match the classification: standard dark or white for historical, with a subtle violet cast for creative (panel bg shifts from `#3A3835` to `#3D3840` on dark theme), and a subtle warm cast for hybrid (`#3D3937`).

---

## 8. Iconography Extension

### 8.1 New Icons

All new icons use the same Lucide base library and style guidelines (1.5px stroke, rounded caps, 24px canvas).

| Element | Icon | Description | Usage |
|---------|------|-------------|-------|
| Creative indicator | `feather` | A writing feather -- the writer's tool | Appears next to the layer icon on creative entries to indicate provenance. Also used in the creative filter chip. |
| Hybrid indicator | `link-2` | Two interlocking chain links | Represents the connection between fact and fiction. Appears next to the layer icon on hybrid entries. |
| Historical indicator | `book-open` | An open book | Represents documented sources. Used in the historical filter chip. Not shown on cards (historical is the default; only creative and hybrid need positive indicators). |
| Plot thread | `git-branch` | A branching line | Represents narrative threads in the dashboard. |
| Narrative dashboard | `pen-tool` | A pen nib | Used for the Narrative Dashboard tab/navigation icon. |
| People view | `users` | Multiple person silhouettes | Used for the People View tab/navigation icon. |
| Add character | `user-plus` | Person silhouette with plus sign | Used in the Narrative Dashboard for adding a new creative character. |
| Coverage gap | `alert-triangle` | Warning triangle | Used in Coverage Gaps section of the dashboard. |

### 8.2 Compound Icon Pattern

On entry cards, the classification is indicated by a compound icon: the layer icon plus a small (12px) classification icon in the bottom-right corner.

```
  Historical Event:    [calendar]           (layer icon only, no overlay)
  Creative Event:      [calendar][feather]  (layer icon + feather badge)
  Hybrid Event:        [calendar][link-2]   (layer icon + link badge)
```

The classification overlay icon is rendered at 12px on a 16px inset circle, positioned at the bottom-right of the 24px layer icon canvas. It uses the classification color (Twilight Violet for creative, Dusk Purple for hybrid).

---

## 9. CSS Custom Properties Extension

The following custom properties extend the existing design token set defined in the Design Bible appendix.

```css
:root {
  /* Creative Classification Colors */
  --color-creative-primary:     #7B5EA7;
  --color-creative-accent:      #944F6B;
  --color-creative-secondary:   #6B5B8A;
  --color-creative-bg:          #F0EBF5;
  --color-creative-bg-alt:      #F5EBF0;
  --color-hybrid-bg:            #F5EDE4;

  /* Creative Dark Panel Variants */
  --color-panel-bg-creative:    #3D3840;
  --color-panel-bg-hybrid:      #3D3937;

  /* Creative Shadows */
  --shadow-creative:  0 2px 8px rgba(123, 94, 167, 0.12);
  --shadow-hybrid:    0 2px 8px rgba(107, 91, 138, 0.12);

  /* Creative Textures (diagonal lines as CSS gradients) */
  --texture-creative: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 11px,
    rgba(123, 94, 167, 0.04) 11px,
    rgba(123, 94, 167, 0.04) 12px
  );
  --texture-hybrid: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 11px,
    rgba(107, 91, 138, 0.04) 11px,
    rgba(107, 91, 138, 0.04) 12px
  );

  /* People Timeline */
  --people-bar-height:    24px;
  --people-bar-gap:       4px;
  --people-bar-radius:    4px;

  /* Lifespan bar colors */
  --color-lifespan-historical: rgba(58, 140, 140, 0.80);
  --color-lifespan-creative:   rgba(123, 94, 167, 0.60);
  --color-lifespan-hybrid-start: #3A8C8C;
  --color-lifespan-hybrid-end:   #7B5EA7;

  /* Classification badge dimensions */
  --badge-height:         20px;
  --badge-height-detail:  24px;
  --badge-padding:        4px 8px;
  --badge-radius:         4px;

  /* Transitions (creative entries use slightly longer transitions
     for a softer, more considered feel) */
  --transition-creative:  250ms ease-out;
}
```

---

## 10. Implementation Notes

### 10.1 Data Model Impact

The creative layer requires additions to the existing data schemas. These are recommendations for the Engineer to evaluate:

**TimelineEntry schema additions:**

| Field | Type | Description |
|-------|------|-------------|
| `classification` | `enum: ["historical", "creative", "hybrid"]` | Required. Defaults to `"historical"` for backward compatibility with existing entries. |
| `narrative_thread` | `string` or `string[]` | Optional. Name(s) of the plot thread(s) this entry belongs to. Only relevant for creative and hybrid entries. |
| `anchored_to` | `string[]` | Optional. Array of entry IDs that this hybrid entry is grounded in. Only relevant for hybrid entries. |
| `fact_vs_fiction` | `string` | Optional. Writer's note explaining what is real and what is invented. Recommended for hybrid entries. |

**Person schema additions:**

| Field | Type | Description |
|-------|------|-------------|
| `classification` | `enum: ["historical", "creative", "hybrid"]` | Required. Defaults to `"historical"`. |
| `narrative_thread` | `string` or `string[]` | Optional. Plot thread association. |
| `character_role` | `string` | Optional. Narrative role (e.g., "protagonist," "antagonist," "supporting"). Only for creative/hybrid. |
| `character_notes` | `string` | Optional. Freeform writer notes about this character. |

### 10.2 Migration Strategy

Existing entries require no migration. The `classification` field defaults to `"historical"` when absent. The UI should treat any entry without a `classification` field as historical. This ensures the creative layer is purely additive and does not break backward compatibility.

### 10.3 Performance Considerations

- The diagonal line texture is implemented as a CSS gradient, not a raster image. This has zero network cost and minimal rendering overhead.
- The People Timeline view may render 100+ lifespan bars. Virtualization (rendering only visible bars) should be used if performance degrades beyond 200 entries.
- Provenance filtering adds one additional filter predicate to the existing filter pipeline. This is an O(n) operation on the already-filtered set and should not impact performance.

### 10.4 Accessibility

- Classification must not rely solely on color. The badge text (HIST, FICTION, HYBRID), the border pattern (solid, dashed, dot-dash), and the compound icon all provide redundant non-color signals.
- The diagonal line texture is decorative only and does not convey information. It reinforces the classification but is not the sole indicator.
- In the People Timeline, the lifespan bar labels must meet WCAG AA contrast. Labels inside bars should switch between Charcoal and White depending on bar luminance, using the same algorithm already employed for layer color contrast in the existing system.
- Screen readers should announce classification as part of the entry's accessible name: "Fiction. Elara Whitfield. Person. Born 1895."
- Keyboard navigation in the People Timeline: arrow keys move between bars (up/down for people, left/right for time), Enter opens the detail panel, Escape closes it.

### 10.5 Phased Rollout

This strategy is designed for incremental implementation:

| Phase | Scope | Dependencies |
|-------|-------|-------------|
| Phase 1 | Classification field in data model. Provenance badge on cards. Filter toggles. | Schema update, filter pipeline extension |
| Phase 2 | Full card visual treatments (borders, backgrounds, textures). Timeline marker differentiation. | Phase 1 |
| Phase 3 | People Timeline view. | Phase 1, person schema extension |
| Phase 4 | Narrative Dashboard. | Phase 1, Phase 3, narrative_thread field |

---

*This document is a design strategy proposal. It extends the Design Bible (docs/design-bible.md) but does not replace it. Once approved, the relevant sections will be incorporated into the Design Bible as canonical specifications. Implementation details are recommendations for the Engineer; final technical decisions remain with the engineering team.*
