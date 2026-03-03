# Fantasy Expansion Proposal: Planning & Research Sprint

**Version:** 1.0 Draft
**Date:** 2026-03-03
**Sprint Type:** Planning & Research
**Status:** Team Review
**Prepared by:** Full Team (PM, Engineer, Designer, AI Narrator, Researcher, DB Engineer, Tester, UI/UX)

---

## Executive Summary

This proposal outlines a phased plan to expand the Writer's Research Companion with three major capabilities:

1. **Fantasy Layer** — First-class support for fictional/fantasy entries that coexist with historical data, visually distinguished and independently filterable
2. **Regional Context Layers** — Toggleable layers for Seattle, Tacoma, and US national events that provide broader historical context
3. **Narrative Tools** — Features that help writers and AI narrators review story flow, track narrative arcs, and bridge fantasy with history

These features transform the application from a pure historical research tool into a **world-building platform** where writers can layer fictional narratives onto real history and AI adventure hosts can seamlessly blend fact with fiction.

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Feature Specifications](#2-feature-specifications)
3. [Data Model Changes](#3-data-model-changes)
4. [Visual Design Specification](#4-visual-design-specification)
5. [AI Narrator Integration](#5-ai-narrator-integration)
6. [Milestone Plan](#6-milestone-plan)
7. [Risk Assessment](#7-risk-assessment)
8. [Team Assignments](#8-team-assignments)
9. [Open Questions](#9-open-questions)

---

## 1. Current State Assessment

### What We Have (M0–M6 Complete)

| Asset | Count | Status |
|-------|-------|--------|
| Timeline entries | 111 | All validated, 0 warnings |
| People records | 117 | All cross-referenced, 0 orphans |
| Places records | 67 | All cross-referenced |
| Environment features | 12 | Cross-refs fixed |
| Test suite | 122 tests | All green |
| Production build | 252KB JS, 29KB CSS | Clean TypeScript |

### Key Architecture Points Affecting This Expansion

- **Name-based references:** Entries reference people/places by name string, not ID. Fantasy entries will follow the same pattern.
- **Layer-based filtering:** Current layers are `event`, `person`, `place`, `environment`. Fantasy needs new layer variants or a separate axis.
- **Era-based organization:** Fantasy entries may not fit neatly into historical eras; they need flexible temporal placement.
- **Client-side only:** All data is JSON flat files loaded into browser memory. Fantasy data follows the same pattern.
- **Export-first design:** The narrator export already has a `fantasy_layer` section with temporal anomalies, liminal spaces, and historical gaps. This expansion makes fantasy a first-class citizen.

---

## 2. Feature Specifications

### 2.1 Fantasy Entry System

#### Core Concept

Fantasy entries are timeline entries that represent **fictional events, characters, places, and environmental features** created by writers or AI narrators. They coexist with historical entries on the same timeline but are visually distinguished and independently filterable.

#### Entry Type Classification

Every entry gains a new `entry_type` field:

| Type | Description | Example |
|------|-------------|---------|
| `historical` | Verified historical fact with source citations | "Captain Vancouver Names Vashon Island" |
| `fantasy` | Purely fictional content created for a narrative | "The Tidewalker Emerges from Quartermaster Harbor" |
| `speculative` | Historical gaps filled with plausible fiction | "A Secret Meeting of Smugglers at Dockton, 1895" |

#### Universe/Campaign System

Fantasy entries belong to a **universe** (also called a campaign). This allows multiple writers or campaigns to coexist on the same dataset without collision.

```json
{
  "universe_id": "whisper-tides",
  "universe_name": "The Whisper Tides Campaign",
  "universe_description": "A dark fantasy where ancient spirits tied to the island's glacial past resurface through historical trauma points.",
  "genre": "dark fantasy",
  "themes": ["memory", "displacement", "ecological revenge"]
}
```

Multiple universes can be active simultaneously, each toggled independently.

#### Fantasy Tag System

All fantasy entries carry a `fantasy` tag in their `tags[]` array for simple identification. Additional structured tags:

| Tag Pattern | Purpose | Example |
|-------------|---------|---------|
| `fantasy` | Master fantasy identifier | Always present on fantasy entries |
| `universe:<id>` | Campaign membership | `universe:whisper-tides` |
| `arc:<name>` | Narrative arc grouping | `arc:tidewalker-awakening` |
| `beat:<type>` | Story beat classification | `beat:inciting-incident`, `beat:climax` |
| `anchor:<entry-id>` | Links to historical anchor | `anchor:pre-001` (tied to glacial retreat) |

### 2.2 Regional Context Layers

#### Layer Definition

Three new geographic scope layers provide broader historical context:

| Layer Key | Label | Scope | Visual Weight |
|-----------|-------|-------|---------------|
| `seattle` | Seattle Area | Key events from Seattle/King County | Subtle — secondary to Vashon entries |
| `tacoma` | Tacoma Area | Key events from Tacoma/Pierce County | Subtle — secondary to Vashon entries |
| `national` | United States | Major national events with local impact | Subtle — tertiary context |

#### Data Structure

Regional entries follow the same `TimelineEntry` schema but with added `scope` field:

```json
{
  "id": "sea-001",
  "title": "Great Seattle Fire",
  "date_start": "1889-06-06",
  "era": "growth-industry",
  "layers": ["event"],
  "scope": "seattle",
  "description": "A massive fire destroyed 25 blocks of downtown Seattle, reshaping the city's infrastructure and increasing demand for island timber and brick.",
  "tags": ["fire", "urban", "seattle", "regional-context"],
  "sources": [{"title": "Great Fire of 1889 — HistoryLink", "type": "secondary"}]
}
```

#### Toggle Behavior

- Regional layers appear in a new **"Context Layers"** section of the FilterPanel, separate from the data layer toggles
- All regional layers are **off by default** — users opt in
- When enabled, regional entries appear as smaller, muted markers on the timeline
- Regional entries are searchable when their layer is active
- Regional entries can be included/excluded from exports

#### Starter Content (Research Targets)

**Seattle Area (~20 entries):**
- Great Seattle Fire (1889), Klondike Gold Rush (1897), Pike Place Market opens (1907), Boeing founded (1916), General Strike (1919), World's Fair/Century 21 (1962), Microsoft/tech boom (1975+), WTO protests (1999), Amazon HQ growth (2010s)

**Tacoma Area (~15 entries):**
- Northern Pacific Railroad terminus (1873), Tacoma Narrows Bridge collapse (1940), Fort Lewis establishment, Tacoma Smelter (ASARCO), Port of Tacoma growth, Tacoma Dome (1983)

**National (~15 entries):**
- Civil War (1861–1865), Transcontinental Railroad (1869), Chinese Exclusion Act (1882), Spanish-American War (1898), WWI entry (1917), Great Depression (1929), Pearl Harbor (1941), Civil Rights Act (1964), Moon landing (1969), 9/11 (2001)

### 2.3 Narrative Flow Tools

#### Story Arc Visualization

A new **Narrative Arc Panel** overlays story beats on the timeline:

- Fantasy entries tagged with `beat:*` tags are connected by arc lines
- Visual representation: a curve overlaid on the timeline connecting story beats
- Arc types: setup → rising action → climax → falling action → resolution
- Multiple arcs can be displayed simultaneously (one per universe or named arc)

#### Narrative Review Mode

A dedicated view mode for reviewing story flow:

- Filters to show only fantasy entries (with optional historical anchors)
- Entries displayed in narrative order (may differ from chronological order)
- Gap detection: highlights time periods where the narrative has no beats
- Density analysis: warns about pacing issues (too many events clustered, or long gaps)

#### Historical Anchor Points

Fantasy entries can declare **anchor relationships** to historical entries:

```json
{
  "anchors": [
    {
      "entry_id": "ww2-001",
      "relationship": "divergence_point",
      "description": "The internment creates a trauma echo that the Tidewalker feeds on"
    }
  ]
}
```

Relationship types: `divergence_point`, `parallel_event`, `consequence_of`, `backdrop`, `inspired_by`, `contradiction`

---

## 3. Data Model Changes

### 3.1 Schema Updates

#### timeline-entry.schema.json v2

New fields added to the existing schema:

```json
{
  "entry_type": {
    "type": "string",
    "enum": ["historical", "fantasy", "speculative"],
    "default": "historical",
    "description": "Classification of entry factuality"
  },
  "scope": {
    "type": "string",
    "enum": ["vashon", "seattle", "tacoma", "national"],
    "default": "vashon",
    "description": "Geographic scope of this entry"
  },
  "universe_id": {
    "type": "string",
    "description": "Fantasy universe/campaign identifier (only for fantasy/speculative entries)"
  },
  "narrative": {
    "type": "object",
    "description": "Narrative metadata for fantasy entries",
    "properties": {
      "arc": { "type": "string", "description": "Named narrative arc this entry belongs to" },
      "beat": {
        "type": "string",
        "enum": ["setup", "inciting-incident", "rising-action", "midpoint", "climax", "falling-action", "resolution", "epilogue", "foreshadowing"],
        "description": "Story beat classification"
      },
      "anchors": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "entry_id": { "type": "string" },
            "relationship": {
              "type": "string",
              "enum": ["divergence_point", "parallel_event", "consequence_of", "backdrop", "inspired_by", "contradiction"]
            },
            "description": { "type": "string" }
          }
        }
      }
    }
  }
}
```

#### New: universe.schema.json

```json
{
  "id": "string (pattern: ^univ-[a-z0-9-]+$)",
  "name": "string",
  "description": "string",
  "genre": "string",
  "themes": "string[]",
  "created_by": "string",
  "created_at": "ISO 8601 date"
}
```

#### person.schema.json v2

New optional fields:

```json
{
  "entry_type": {
    "type": "string",
    "enum": ["historical", "fantasy"],
    "default": "historical"
  },
  "universe_id": { "type": "string" },
  "personality": { "type": "string" },
  "motivation": { "type": "string" },
  "speech_style": { "type": "string" }
}
```

### 3.2 TypeScript Type Updates

```typescript
// New entry type classification
type EntryType = 'historical' | 'fantasy' | 'speculative';

// New geographic scope
type ScopeKey = 'vashon' | 'seattle' | 'tacoma' | 'national';

// Narrative beat types
type NarrativeBeat = 'setup' | 'inciting-incident' | 'rising-action' | 'midpoint' |
  'climax' | 'falling-action' | 'resolution' | 'epilogue' | 'foreshadowing';

// Anchor relationship types
type AnchorRelationship = 'divergence_point' | 'parallel_event' | 'consequence_of' |
  'backdrop' | 'inspired_by' | 'contradiction';

// Extended TimelineEntry
interface TimelineEntry {
  // ... existing fields ...
  entry_type?: EntryType;      // defaults to 'historical'
  scope?: ScopeKey;            // defaults to 'vashon'
  universe_id?: string;        // only for fantasy/speculative
  narrative?: {
    arc?: string;
    beat?: NarrativeBeat;
    anchors?: Array<{
      entry_id: string;
      relationship: AnchorRelationship;
      description?: string;
    }>;
  };
}

// Universe/Campaign definition
interface Universe {
  id: string;
  name: string;
  description: string;
  genre?: string;
  themes?: string[];
  created_by?: string;
  created_at?: string;
}
```

### 3.3 Data File Changes

| File | Change | Impact |
|------|--------|--------|
| `timeline.json` | Add `entry_type: "historical"` to all 111 existing entries | Backward compatible (default) |
| `timeline.json` | Add `scope: "vashon"` to all 111 existing entries | Backward compatible (default) |
| `people.json` | Add `entry_type: "historical"` to all 117 existing records | Backward compatible |
| New: `universes.json` | Universe/campaign definitions | New file |
| New: `regional/seattle.json` | Seattle area timeline entries | New file |
| New: `regional/tacoma.json` | Tacoma area timeline entries | New file |
| New: `regional/national.json` | US national timeline entries | New file |

### 3.4 Backward Compatibility

All new fields use optional types with sensible defaults:
- `entry_type` defaults to `"historical"` — existing data is unchanged
- `scope` defaults to `"vashon"` — existing entries remain Vashon-scoped
- `universe_id` is undefined for historical entries
- `narrative` is undefined for non-fantasy entries

The data loader will handle missing fields gracefully, applying defaults during validation.

---

## 4. Visual Design Specification

### 4.1 Fantasy Color Palette

*Designed by the Designer agent. Full specification in Design Bible Sections 9-11.*

The fantasy palette uses the **purple/violet/magenta family** — a color wheel region with zero overlap to the existing PNW-grounded historical palette (greens, blues, ambers, earth tones).

#### Fantasy Layer Colors

| Layer | Name | Hex | Light BG | Contrast vs Parchment | WCAG AA |
|-------|------|-----|----------|----------------------|---------|
| Fantasy Events | Amethyst | `#7B4BAA` | `#F3EBF9` | 4.51:1 | Pass |
| Fantasy People | Deep Rose | `#9E3A6E` | `#F9EBF2` | 5.51:1 | Pass |
| Fantasy Places | Mystic Teal | `#2A6B7C` | `#E4F0F4` | 4.89:1 | Pass |
| Fantasy Environment | Twilight Indigo | `#4A4E8C` | `#ECEDF5` | 5.90:1 | Pass |

#### Fantasy Core & Accent Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Fantasy Primary | Amethyst | `#7B4BAA` | Primary UI accents, header highlights |
| Fantasy Accent | Soft Violet | `#A67BC5` | Glow effects, decorative accents |
| Fantasy Muted | Dusty Lavender | `#8B7FA0` | Metadata text, muted labels |
| Fantasy Surface | Pale Orchid | `#F3EBF9` | Card backgrounds in fantasy mode |
| Panel Header | Night Purple | `#2E2840` | Detail panel header for fantasy entries |

#### Regional Context Colors (Desaturated Gray Family)

| Scope | Name | Hex | Treatment |
|-------|------|-----|-----------|
| Seattle | Steel Gray | `#5C6B78` | 6px markers, 60% opacity |
| Tacoma | Slate Olive | `#5E6B5C` | 6px markers, 60% opacity |
| National | Muted Navy | `#4A5570` | 6px markers, 60% opacity |

### 4.2 Visual Distinction System (Four-Signal Approach)

*Per Designer specification: distinction uses **color + shape + texture + badge** so no single signal bears full responsibility.*

#### Timeline Track Markers

| Entry Type | Shape | Border | Effect |
|------------|-------|--------|--------|
| Historical | Circle (10px, filled) | None | None (current) |
| Fantasy | Diamond (10px, rotated 45deg) | 1px solid, fantasy color | Subtle outer glow (`0 0 6px {color}40`) |
| Speculative | Circle (filled) | 2px **dashed**, speculative color | None |
| Regional | Small circle (6px) | 1px solid, scope color | 60% opacity |

Fantasy and historical markers occupy **separate lanes** on the timeline, separated by a 1px dashed divider. On hover, dashed connection lines (Amethyst at 30%) link fantasy markers to their historical anchors.

#### Entry Cards

| Entry Type | Card Treatment |
|------------|---------------|
| Historical | Current design (no change) |
| Fantasy | Left indicator: 4px diagonal stripe pattern; border: 1px solid fantasy color at 40%; "Fantasy" pill badge in Amethyst |
| Speculative | Left border dashed in faded gold; italic title treatment |
| Regional | Smaller card height (60px vs 80px); muted text color; scope badge (SEA/TAC/US) |

#### Detail Panel (Fantasy)

| Property | Historical | Fantasy |
|----------|-----------|---------|
| Header BG | `#3A3835` (Panel BG) | `#2E2840` (Night Purple) |
| Title font | Merriweather 700 | Merriweather 700 **Italic** |
| Overline text | "EVENT" / "PERSON" | "FANTASY EVENT" / "FANTASY PERSON" |
| Source heading | "SOURCES" | "NARRATIVE SOURCES" |

#### Fantasy Mode Toggle

A slide toggle in the filter panel header (fantasy is **hidden by default**):

```
[≡ Filters]                   [◇ Fantasy: OFF]
```

When toggled ON: fantasy layer chips slide in (200ms), fantasy markers fade in (150ms), fantasy cards appear in chronological position.

#### Fantasy Icons (Lucide Icon Set)

| Layer | Icon | Fallback |
|-------|------|----------|
| Fantasy Events | `sparkles` | `✦` |
| Fantasy People | `ghost` | `👤` |
| Fantasy Places | `castle` | `🏰` |
| Fantasy Environment | `flame` | `🔥` |

### 4.3 Typography for Fantasy

| Element | Historical | Fantasy |
|---------|-----------|---------|
| Entry title (card) | Merriweather 700 | Merriweather 700 (same — color + badge distinguish) |
| Entry title (detail) | Merriweather 700 | Merriweather 700 **Italic** (literary signal) |
| Description | Inter 400 | Inter 400, `color: #4A3560` |
| Date display | JetBrains Mono 400 | JetBrains Mono 400, `color: #7B4BAA` |
| Fantasy badge | N/A | "Fantasy" pill: 12px, 500wt, Amethyst text on Pale Orchid bg |

---

## 5. AI Narrator Integration

### 5.1 Enhanced Narrator Export Format

The narrator export gains new sections for fantasy content:

```json
{
  "export_metadata": {
    "setting": "Vashon Island, WA",
    "includes_fantasy": true,
    "universes": ["whisper-tides"],
    "entry_count": { "historical": 111, "fantasy": 24, "speculative": 5, "regional": 50 }
  },
  "universes": [
    {
      "id": "whisper-tides",
      "name": "The Whisper Tides Campaign",
      "genre": "dark fantasy",
      "themes": ["memory", "displacement"],
      "narrator_instructions": "Blend historical facts seamlessly with fantasy elements. Never break character by acknowledging the fictional nature of fantasy entries. Treat anchored historical events as immutable truths that fantasy builds upon."
    }
  ],
  "entries": [
    {
      "id": "fan-001",
      "entry_type": "fantasy",
      "universe_id": "whisper-tides",
      "canonicity": "fiction",
      "narrator_notes": "This is a fictional event. Ground it in the real geography of Quartermaster Harbor but treat the supernatural elements as real within the narrative.",
      "narrative": {
        "arc": "tidewalker-awakening",
        "beat": "inciting-incident",
        "anchors": [
          { "entry_id": "pre-001", "relationship": "consequence_of" }
        ]
      }
    }
  ],
  "fantasy_layer": {
    "temporal_anomalies": [...],
    "liminal_spaces": [...],
    "narrative_arcs": [
      {
        "name": "tidewalker-awakening",
        "universe_id": "whisper-tides",
        "beats": ["fan-001", "fan-003", "fan-007", "fan-012"],
        "tone": "dread building to confrontation",
        "themes": ["ecological memory", "indigenous connection"]
      }
    ]
  }
}
```

### 5.2 Canonicity Signal

Every entry in the narrator export carries a `canonicity` field so the AI narrator knows how to treat it:

| Value | Meaning | Narrator Behavior |
|-------|---------|-------------------|
| `verified` | Sourced historical fact | Present as absolute truth; cite if challenged |
| `probable` | Reasonable historical inference | Present confidently but acknowledge uncertainty if pressed |
| `speculative` | Plausible fiction filling a historical gap | Treat as "local legend" or "rumored" |
| `fiction` | Pure fantasy content | Treat as narratively real within the universe |

### 5.3 World-Building Data for AI Hosts

Fantasy person records gain additional fields useful for AI narration:

```json
{
  "id": "fperson-001",
  "name": "The Tidewalker",
  "entry_type": "fantasy",
  "universe_id": "whisper-tides",
  "personality": "Ancient and patient. Speaks in tidal metaphors. Mourns what humans have forgotten.",
  "motivation": "Restore the ecological memory of the island by awakening sleeping spirits in glacial deposits.",
  "speech_style": "Archaic, rhythmic, like waves. Uses 'we' instead of 'I'. Pauses mid-sentence as if listening.",
  "adventure_role": "antagonist",
  "secrets": "Was once human — a S'Homamish elder who merged with the tidal spirits during the Medicine Creek Treaty displacement."
}
```

### 5.4 Regional Context for Storytelling

The AI narrator can use regional entries as contextual bridges:

- **"Meanwhile in Seattle..."** — When a player asks about the broader world, regional entries provide period-accurate context
- **National events as backdrop** — "As the nation enters the Great Depression, Vashon's strawberry farmers feel the squeeze..."
- **Trade and connection** — Seattle/Tacoma entries show the economic and cultural connections to island life

---

## 6. Milestone Plan

### Phase 1: M7 — Fantasy Data Model (Schema & Data Foundation)

**Goal:** Extend the data model to support fantasy entries, regional layers, and universe management

**Deliverables:**
- Updated `timeline-entry.schema.json` v2 with `entry_type`, `scope`, `universe_id`, `narrative` fields
- New `universe.schema.json`
- Updated `person.schema.json` v2 with fantasy fields
- Updated TypeScript types (`src/types/index.ts`)
- Backward-compatible migration of all 111 existing entries (add `entry_type: "historical"`, `scope: "vashon"`)
- Updated data loader with new field validation
- Updated test fixtures with fantasy and regional sample entries
- Unit tests for new schema validation rules

**Responsible:** Engineer (lead), DB Engineer (data migration), Tester (validation)

**Quality Gate:** All existing 122 tests still pass. New schema validation catches invalid fantasy entries. TypeScript compiles cleanly.

**Estimated Effort:** 1 sprint

---

### Phase 2: M8 — Regional Context Research & Data

**Goal:** Research and populate Seattle, Tacoma, and national context layers

**Deliverables:**
- `research/vashon-island/regional/seattle.json` (~20 entries, sourced)
- `research/vashon-island/regional/tacoma.json` (~15 entries, sourced)
- `research/vashon-island/regional/national.json` (~15 entries, sourced)
- Regional entries integrated into data loader
- Updated search index with regional entries
- Updated narrator export with regional section
- Regional entries cross-referenced with relevant Vashon entries

**Responsible:** Researcher (lead), Engineer (data integration), DB Engineer (indexing)

**Quality Gate:** All regional entries have source citations. Cross-references validate. Search index includes regional content.

**Estimated Effort:** 1 sprint

---

### Phase 3: M9 — Fantasy Visual Design & UI

**Goal:** Implement the fantasy color palette, visual distinction system, and updated UI controls

**Deliverables:**
- Fantasy color palette integrated into `eras.ts` and component styles
- Diamond markers for fantasy entries on timeline
- Fantasy/Historical/Both mode toggle in header
- Regional context toggles in FilterPanel (separate section)
- Entry cards with fantasy visual treatment (purple accent, gradient, badges)
- DetailPanel updates for fantasy metadata display (universe, arc, beat, anchors)
- Scope badges on regional entry cards (SEA/TAC/US)
- Updated keyboard shortcut: `F` to toggle fantasy mode

**Responsible:** Designer (visual specs), Engineer (implementation), UI/UX (interaction design)

**Quality Gate:** WCAG AA contrast verified for all new colors. Fantasy entries visually distinct at all zoom levels. Component tests updated.

**Estimated Effort:** 1 sprint

---

### Phase 4: M10 — Add Fantasy Entry & Universe Management

**Goal:** Update the AddEntryDialog to support fantasy entries and universe creation

**Deliverables:**
- Entry type selector in AddEntryDialog (Historical / Fantasy / Speculative)
- Universe picker/creator (select existing or create new)
- Narrative metadata fields (arc name, story beat, anchor entry selector)
- Fantasy-specific validation (universe required for fantasy entries)
- Live preview showing fantasy visual styling before save
- Universe management panel (list, edit, delete universes)
- Fantasy person creation with personality, motivation, speech style fields

**Responsible:** Engineer (lead), UI/UX (form design), Designer (preview styling)

**Quality Gate:** New entries validate against v2 schema. Universe CRUD works. Form accessibility verified.

**Estimated Effort:** 1 sprint

---

### Phase 5: M11 — Narrative Flow Tools

**Goal:** Build the narrative arc visualization and story review features

**Deliverables:**
- Narrative Arc Panel: visual overlay connecting story beats on timeline
- Arc line rendering (curved connections between beats with labels)
- Narrative Review Mode: filtered view showing only story flow
- Gap detection: highlights time periods without narrative beats
- Pacing analysis: density warnings for clustered/sparse sections
- Anchor visualization: dashed lines connecting fantasy entries to historical anchors
- Export updates: narrative arcs included in narrator export

**Responsible:** Engineer (lead), Designer (arc visualization), AI Narrator (review)

**Quality Gate:** Arc visualization renders correctly for multi-arc scenarios. Gap detection catches obvious issues. Export includes narrative data.

**Estimated Effort:** 1 sprint

---

### Phase 6: M12 — Integration Testing & Polish

**Goal:** Full integration testing, performance validation, and polish

**Deliverables:**
- Integration tests: fantasy + historical filter combinations
- Integration tests: regional layer toggle behavior
- Integration tests: fantasy entry CRUD with universe management
- Integration tests: narrator export with fantasy content
- Performance testing with 200+ entries (111 historical + 50 regional + 50 fantasy)
- Accessibility audit of all new UI components
- Documentation updates: PRD v2, FRD v2, Design Bible v2
- Dashboard and coordination board updated

**Responsible:** Tester (lead), all agents (fixes and review)

**Quality Gate:** All tests pass. Performance targets met. WCAG AA verified. Documentation current.

**Estimated Effort:** 1 sprint

---

### Milestone Dependency Graph

```
M7 (Fantasy Data Model)
  ├──> M8 (Regional Research)     [can run in parallel with M9]
  ├──> M9 (Fantasy Visual Design) [can run in parallel with M8]
  └──> M10 (Add Entry & Universe Mgmt)
         └──> M11 (Narrative Flow Tools)
                └──> M12 (Integration & Polish)
```

**Critical Path:** M7 → M9 → M10 → M11 → M12
**Parallel Track:** M8 (Regional Research) runs alongside M9

---

## 7. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Fantasy entries create visual clutter | Confusing UX | Medium | Strong visual distinction; default-off fantasy mode; universe filtering |
| Regional data bloats JSON files past 1MB | Slow load times | Low | Regional data in separate files; lazy load by scope |
| Multiple universes create complex filter states | UX confusion | Medium | Clear universe selector; limit to 1 active universe view at a time |
| Narrative arc visualization performance | Jank at scale | Low | Limit arc rendering to visible viewport; virtualize |
| Fantasy/historical anchor relationships create circular references | Data integrity | Low | Validation rule: anchors must point to different entry_type |
| Test suite expansion required | Slowed development | Medium | Incremental test additions per milestone; reuse fixtures |

---

## 8. Team Assignments

| Agent | M7 | M8 | M9 | M10 | M11 | M12 |
|-------|----|----|-----|-----|-----|-----|
| **Product Manager** | Review schemas | Review research | Review UX | Review flows | Review narrative tools | Final sign-off |
| **Engineer** | Lead: schemas, types, loader | Data integration | Lead: components | Lead: AddEntry, Universe | Lead: arc viz | Bug fixes |
| **DB Engineer** | Data migration, indexing | Search index update | — | Universe storage | — | Performance testing |
| **Researcher** | — | Lead: regional research | — | — | — | Fact-check |
| **Designer** | — | — | Lead: visual specs | Preview styling | Arc visualization | Accessibility audit |
| **Tester** | Schema validation tests | Regional data tests | Component tests | Form tests | Narrative tests | Lead: full integration |
| **UI/UX** | — | — | Interaction review | Form design | Narrative UX | Accessibility |
| **AI Narrator** | Export format review | Regional context review | — | — | Review narrative tools | Export integration test |

---

## 9. Open Questions

| # | Question | Owner | Priority |
|---|----------|-------|----------|
| 1 | Should speculative entries require a universe_id, or can they exist independently? | PM + Engineer | High |
| 2 | Maximum number of concurrent universes before UX degrades? | UI/UX | Medium |
| 3 | Should regional entries support fantasy content (e.g., "A dragon attacks Seattle in 1889")? | PM + AI Narrator | Medium |
| 4 | How should the search ranking weight fantasy vs. historical results? | DB Engineer | Medium |
| 5 | Should narrative arcs be exportable as standalone documents (for writers)? | PM + AI Narrator | Low |
| 6 | Font treatment for fantasy: use a different display font, or rely on color/shape only? | Designer | Low |
| 7 | Should regional entries have their own people/places records, or share the main dataset? | Engineer + Researcher | High |

---

## Appendix A: Example Fantasy Entry

```json
{
  "id": "fan-001",
  "title": "The Tidewalker Emerges from Quartermaster Harbor",
  "date_start": "1942-03-30",
  "era": "wwii",
  "layers": ["event", "person", "environment"],
  "entry_type": "fantasy",
  "scope": "vashon",
  "universe_id": "whisper-tides",
  "description": "On the night the last Japanese American family leaves Vashon, an ancient spirit rises from the harbor's deep sediments — the Tidewalker, a being of glacial memory and tidal wrath.",
  "details": "The Tidewalker is a spirit entity tied to the island's oldest geological strata. It has slept since the glaciers retreated 12,000 years ago, its consciousness woven into the tidal patterns of Quartermaster Harbor. The forced removal of the island's Japanese American community — farmers who had tended the land for decades — creates a wound in the island's living memory that wakes the Tidewalker. It manifests as an impossibly tall figure made of dark water and glacial silt, walking the low-tide flats at night.",
  "people": ["The Tidewalker"],
  "places": ["Quartermaster Harbor", "Vashon Island"],
  "sources": [],
  "tags": ["fantasy", "universe:whisper-tides", "arc:tidewalker-awakening", "beat:inciting-incident", "anchor:ww2-001"],
  "narrative": {
    "arc": "tidewalker-awakening",
    "beat": "inciting-incident",
    "anchors": [
      {
        "entry_id": "ww2-001",
        "relationship": "consequence_of",
        "description": "The internment displacement creates the trauma echo that awakens the Tidewalker"
      },
      {
        "entry_id": "pre-001",
        "relationship": "inspired_by",
        "description": "The Tidewalker's essence dates to the glacial retreat that formed the island"
      }
    ]
  }
}
```

## Appendix B: Example Regional Entry

```json
{
  "id": "sea-001",
  "title": "Great Seattle Fire Destroys Downtown",
  "date_start": "1889-06-06",
  "era": "growth-industry",
  "layers": ["event"],
  "entry_type": "historical",
  "scope": "seattle",
  "description": "A massive fire destroyed 25 blocks of downtown Seattle, leading to reconstruction in brick and stone. The rebuilding effort increased demand for Vashon Island brick, boosting the island's kiln industry.",
  "people": [],
  "places": ["Seattle"],
  "sources": [
    {
      "title": "Seattle Fire of 1889 — HistoryLink.org",
      "url": "https://www.historylink.org/File/715",
      "type": "secondary"
    }
  ],
  "tags": ["fire", "urban", "seattle", "regional-context", "brick-demand"]
}
```

---

*This proposal is submitted for team review. All agents should review their sections and provide feedback via the coordination board. Upon approval, work begins with M7 (Fantasy Data Model).*
