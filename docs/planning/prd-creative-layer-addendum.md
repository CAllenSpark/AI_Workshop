# PRD Addendum: Creative Layer Evolution

**Version:** 0.1 (Planning Draft)
**Date:** 2026-03-03
**Author:** Product Manager
**Status:** Planning Sprint
**Extends:** PRD v1.0 (2026-03-02)

---

## Table of Contents

1. [Updated Vision](#1-updated-vision)
2. [New and Updated Personas](#2-new-and-updated-personas)
3. [New User Stories](#3-new-user-stories)
4. [Feature Prioritization](#4-feature-prioritization)
5. [Data Model Changes](#5-data-model-changes)
6. [Milestone Proposals](#6-milestone-proposals)
7. [Success Metrics](#7-success-metrics)
8. [Risks and Open Questions](#8-risks-and-open-questions)
9. [Coordination Notes](#9-coordination-notes)

---

## 1. Updated Vision

### Current Vision (PRD v1.0)

The Writer's Research Companion is a minimal, elegant interface that consolidates historical and geographical research into a timeline-scrubable knowledge base. Writers and AI narrators can explore events, people, places, and environmental features across time for a given setting.

### Expanded Vision

The Writer's Research Companion evolves from a **research tool** into a **worldbuilding platform** that interleaves real history with creative narrative content. Writers can layer fictional characters, invented events, and narrative plot points on top of a historically grounded knowledge base, seeing at a glance how their creative work sits within and alongside the real historical record. AI narrators and AI writing collaborators can use the same platform to generate insights, surface connections between real and fictional elements, and produce richer storytelling grounded in verified fact.

The platform maintains an absolute separation between **historical fact** and **creative content** at the data level, while providing unified views that show both together. This distinction is the product's core integrity guarantee: a writer or AI narrator can always trust which information is historically sourced and which is invented for narrative purposes.

### What Changes

| Dimension | Before (v1.0) | After (Creative Layer) |
|-----------|---------------|----------------------|
| **Content type** | Historical entries only | Historical + creative/fictional entries, clearly classified |
| **People** | Real historical figures only | Historical figures + fictional characters, with lifespan overlap views |
| **Settings** | Single setting (Vashon Island) | Primary setting + regional context settings (Seattle, Tacoma, etc.) |
| **Timeline** | Historical events only | Historical events + narrative events/plot points, visually layered |
| **Dashboard** | Research coverage metrics | Research metrics + narrative dashboard (characters, arcs, themes) |
| **Export** | AI narrator JSON (factual grounding) | AI narrator JSON + creative worldbuilding export (facts + fiction) |
| **Filtering** | By layer, era, date range | All of the above + by content classification (historical/creative/combined) |

### What Does Not Change

- The commitment to source citations for all historical content.
- The timeline as the primary navigation axis.
- The layered data model (events, people, places, environment).
- The JSON flat-file data architecture.
- Client-side, zero-backend operation.
- WCAG 2.1 AA accessibility compliance.

---

## 2. New and Updated Personas

### Updated Persona 1: Clara, the Historical Fiction Writer (now "Worldbuilder Clara")

The original Clara persona described a writer who reads historical data. The updated Clara also writes into the system: she creates fictional characters, places them in real historical contexts, and uses the platform to track how her narrative intersects with the historical record.

- **Age:** 42
- **Occupation:** Freelance novelist
- **Technical comfort:** Moderate; comfortable with web applications and basic research databases
- **Updated context:** Clara is writing a novel set on Vashon Island during the 1920s-1930s. She has created three fictional characters: a Japanese-American strawberry farmer's daughter, a Scandinavian boat builder at Dockton, and a schoolteacher who arrives from Seattle. She needs to see how these fictional characters overlap temporally with real historical figures and events. When she checks her timeline, she wants to see that her boat builder character is working at Dockton during the same years the Martinolich shipyard was historically active, and that her schoolteacher arrives the same year the Chautauqua Assembly was drawing cultural events to the island.
- **New pain points:** Clara currently tracks her fictional characters in a separate spreadsheet. She has no way to see them on the same timeline as the historical data. She sometimes accidentally places a character at a location that did not yet exist, or creates events that conflict with real history, because her research tool and her creative workspace are separate systems.
- **Updated goal:** Use a single interface to browse historical data and her own creative content together, with clear visual distinction between fact and fiction. See a lifespan view that shows her fictional characters alongside real historical figures to verify temporal consistency.

### Updated Persona 2: Marcus, the Adventure Game Designer (now "World-Runner Marcus")

Marcus now needs the platform to support not just factual export but also the creative content layer -- fictional characters, narrative arcs, and invented events that his game weaves through real history.

- **Age:** 34
- **Occupation:** Independent game developer
- **Technical comfort:** High; comfortable with JSON, APIs, and data pipelines
- **Updated context:** Marcus is building a time-travel adventure game set on Vashon Island. He has created a cast of original characters who recur across eras, several invented locations (a hidden cove, a secret room in a historical building), and a set of narrative quests that thread through real events. He needs to export the full knowledge base -- historical and creative -- as structured JSON, with each entry clearly tagged so his game engine knows which facts are real (and should be treated as canonical) and which are his invention (and can be modified by player choices).
- **New pain points:** Marcus currently maintains his fictional game content in a separate wiki. Cross-referencing it with the historical data requires manual work. When he adds a new historical era, he has to manually check whether any of his fictional characters or events need updating.
- **Updated goal:** Export a combined knowledge base where every entry carries a classification field. His game engine uses this to enforce the rule that historical facts are immutable while creative content can branch based on player decisions.

### Updated Persona 3: The Narrator (AI Host System)

The Narrator now has access to both historical grounding and creative content, and must respect the boundary between them.

- **Updated context:** The Narrator hosts an adventure game that includes both historically accurate scenarios and fictional narrative arcs. When a player interacts with a real historical figure, the Narrator draws from sourced historical data. When a player interacts with a fictional character, the Narrator draws from the creative content layer with more improvisational freedom, while still grounding the scene in historically accurate environmental and temporal context.
- **Updated goal:** Query the knowledge base with awareness of content classification. Use historical data as immutable ground truth. Use creative data as narrative scaffolding that can be adapted and expanded during play.

### New Persona 4: Eliot, the World Creator

- **Age:** 38
- **Occupation:** Writer, game designer, and creative director
- **Technical comfort:** High; comfortable with structured data, AI tools, and creative workflows
- **Context:** Eliot is the creative architect of a historical fiction narrative set in the Puget Sound region. He uses real history as the foundation for a multi-character, multi-era story that spans Vashon Island, Seattle, and Tacoma. He does not just research settings; he actively builds a narrative world by threading fictional characters and invented events through the historical record. He wants to see his entire world -- real history and creative additions -- in a single view, with the ability to zoom in on any era and see exactly how his fiction sits on top of the facts.
- **Pain points:** Eliot's creative world exists across multiple documents, spreadsheets, and mental models. He has no single view that shows him the full picture: which eras are covered by both history and narrative, which characters are contemporaries of which historical figures, which narrative events are anchored to real events and which float free. He also wants to develop regional context -- high-level timelines for Seattle and Tacoma -- so that his characters can plausibly travel between settings.
- **Goal:** Use the platform as a worldbuilding command center. Add fictional characters and narrative events, see them layered on the historical timeline, review a narrative dashboard that summarizes his creative world's structure, and export the combined knowledge base for use by AI narrators and writing collaborators.

### New Persona 5: The Writer's AI Collaborator

- **Age:** N/A (AI system)
- **Occupation:** AI writing assistant integrated with the worldbuilding platform
- **Technical comfort:** Consumes structured JSON; generates structured JSON and narrative prose
- **Context:** The AI Collaborator is an AI system that works alongside Eliot (or Clara, or Marcus) during the creative process. It reads the combined historical + creative knowledge base and generates suggestions: "Your character Elena arrives in Seattle in 1918 -- that's the year of the Spanish Flu pandemic and the Seattle General Strike. How do these real events affect her story?" It can propose new fictional characters, suggest narrative connections between existing characters and real events, and flag inconsistencies between creative content and the historical record.
- **Pain points:** Without structured, classified data, the AI Collaborator cannot distinguish between fact and fiction and therefore cannot reliably generate suggestions that respect the boundary. It needs the content classification field to function correctly.
- **Goal:** Read the combined knowledge base, generate narrative suggestions grounded in historical context, and write new creative entries back into the system using the correct schema and classification.

---

## 3. New User Stories

### P0 -- Must Have for Creative Layer MVP

**US-CL-01: Classify entries as historical or creative**

> As a world creator, I want every entry in the knowledge base to carry a classification indicating whether it is historically sourced or creatively authored, so that I can always trust which information is fact and which is fiction.

Acceptance criteria:
- Every entry (timeline entry, person, place, environment feature) includes a `content_class` field.
- Valid values are: `historical`, `creative`, and `historical-inspired` (creative content directly inspired by or extrapolated from a specific historical source).
- Existing historical entries default to `historical`.
- The classification is visible in the entry card and detail panel.
- The classification is included in all exports.
- The classification cannot be blank; it is a required field.

**US-CL-02: Add fictional characters alongside historical people**

> As a fiction writer, I want to add fictional characters to the knowledge base and see them displayed alongside historical figures, so that I can verify that my characters exist in the correct time period and interact with the right historical context.

Acceptance criteria:
- A fictional character can be added with all the fields of a Person record, plus: `content_class: "creative"`, an optional `creative_property` field (e.g., "Vashon Chronicles"), and an optional `narrative_role` field (e.g., "protagonist", "antagonist", "supporting").
- Fictional characters appear in the same people directory and timeline as historical figures.
- Fictional characters are visually distinct from historical figures (different border style, badge, or indicator -- specifics deferred to Designer).
- Fictional characters can be cross-referenced to historical entries (e.g., "Elena witnesses the 1918 General Strike").

**US-CL-03: Add narrative events layered on the historical timeline**

> As a world creator, I want to add narrative events and plot points to the timeline and see them layered on top of historical events, so that I can see how my story's pacing and structure relate to real history.

Acceptance criteria:
- A narrative event can be added with all the fields of a TimelineEntry, plus: `content_class: "creative"`, an optional `creative_property` field, and an optional `narrative_type` field (e.g., "plot_point", "character_event", "world_event", "backstory").
- Narrative events appear on the timeline with a visually distinct treatment (e.g., different marker shape, dashed border, hatched fill -- specifics deferred to Designer).
- Narrative events can reference both historical and fictional people and places.
- Narrative events do not appear in search results when the user has filtered to "historical only."

**US-CL-04: Toggle between historical, creative, and combined views**

> As a writer, I want to toggle the timeline between three view modes -- historical only, creative only, and combined -- so that I can focus on pure research, pure narrative planning, or the full integrated picture as needed.

Acceptance criteria:
- A view mode selector is accessible from the main interface (above or alongside the existing layer toggles).
- "Historical" mode shows only entries with `content_class: "historical"` or `"historical-inspired"`.
- "Creative" mode shows only entries with `content_class: "creative"` or `"historical-inspired"`.
- "Combined" mode (default) shows all entries.
- The view mode interacts with existing layer and era filters using AND logic.
- The entry count updates to reflect the active view mode.
- The view mode is reflected in the URL query string.

**US-CL-05: View a people timeline showing lifespans**

> As a fiction writer, I want to see a visual timeline of people showing when they were alive -- both real historical figures and my fictional characters -- so that I can identify who is contemporary with whom and ensure my characters interact with the right people for their era.

Acceptance criteria:
- A "People Timeline" view is accessible from the main interface (as a view mode or tab).
- Each person is represented as a horizontal bar spanning their birth year to death year (or present, if still living or death year is unknown).
- Historical figures and fictional characters are visually distinguished (color, pattern, or border treatment).
- The people timeline is filterable by era, by content classification (historical/creative/combined), and by search query.
- Hovering or clicking a person bar shows their name, role, lifespan, and a link to their full profile.
- People with unknown birth or death years display a faded or partial bar with an indicator that the dates are approximate.

### P1 -- Should Have

**US-CL-06: Multi-setting support with regional context**

> As a world creator, I want to add high-level timelines for settings adjacent to my primary setting (e.g., Seattle and Tacoma alongside Vashon Island), so that I can understand the regional context my characters move through and see how events in neighboring cities affect the island.

Acceptance criteria:
- The system supports multiple named settings, each with its own collection of timeline entries, people, places, and environment features.
- One setting is designated as the "primary" setting (e.g., Vashon Island); others are "context" settings with lighter-weight data.
- Context settings can have their own era definitions or inherit from the primary setting.
- A setting selector allows the user to view a single setting or overlay multiple settings on the same timeline.
- When overlaid, entries from different settings are visually distinguished (by color band, label, or grouping).
- Cross-setting references are supported (e.g., a person who lives on Vashon but works in Seattle can appear in both settings' timelines).
- Each setting stores its data in its own directory under `research/` (e.g., `research/seattle/`, `research/tacoma/`).

**US-CL-07: Narrative dashboard view**

> As a world creator, I want a narrative dashboard that summarizes the creative content in my worldbuilding project -- character roster, narrative arc structure, plot point distribution across eras, and theme tracking -- so that I can see the shape of my narrative world at a glance without scrubbing through the entire timeline.

Acceptance criteria:
- A "Narrative Dashboard" view is accessible from the main navigation.
- The dashboard displays:
  - **Character roster:** All fictional characters grouped by creative property, with role, era of activity, and status (active/inactive/deceased in narrative).
  - **Narrative arc summary:** Creative entries grouped by narrative arc or creative property, displayed as a simplified timeline showing the span and density of each arc.
  - **Era coverage:** A matrix showing which eras have creative content and which are historical-only, highlighting gaps where narrative opportunities exist.
  - **People overlap:** A summary of which fictional characters are contemporaries of which historical figures.
  - **Plot point distribution:** A count or density visualization of creative entries per era, helping the writer see whether their narrative is concentrated in one period or spread across the timeline.
- The dashboard updates dynamically as creative content is added or modified.
- Each item on the dashboard links to the relevant entry, person, or timeline position.

**US-CL-08: Creative property grouping**

> As a world creator, I want to tag creative entries with a "creative property" name (e.g., "Vashon Chronicles" or "The Mosquito Fleet Mystery"), so that I can manage multiple creative projects within the same knowledge base and filter by project.

Acceptance criteria:
- All creative entries (timeline entries, people, places) support an optional `creative_property` field.
- A creative property filter is available in the FilterPanel, allowing the user to show entries from one or more creative properties.
- Creative properties are displayed as a grouped list in the narrative dashboard.
- Entries with no creative property are treated as "unassigned" and still appear in creative-mode views.

**US-CL-09: Narrative connection insights**

> As a world creator, I want the system to surface connections between my creative content and the historical record -- such as "Your character Elena is on Vashon Island during the 1922 wildfire -- have you considered how this affects her story?" -- so that I can discover narrative opportunities I might have missed.

Acceptance criteria:
- The system identifies temporal and geographic overlaps between creative and historical entries.
- Insights are presented in a dedicated panel or as annotations on the timeline.
- Each insight includes: the creative entry, the overlapping historical entry, the nature of the connection (temporal, geographic, thematic), and a brief suggestion.
- Insights can be dismissed or saved as notes.
- The insight engine runs client-side using the existing in-memory data store.

### P2 -- Nice to Have

**US-CL-10: AI-assisted worldbuilding suggestions**

> As a world creator, I want the system to suggest fictional characters, narrative events, or plot points based on gaps and opportunities in the historical record, so that I can discover starting points for new creative content.

Acceptance criteria:
- The system analyzes the historical data for "narrative fertile" patterns: dramatic events, unresolved mysteries, periods of social tension, transitions between eras.
- Suggestions are presented with a brief rationale and links to the relevant historical entries.
- The user can accept a suggestion (creating a draft creative entry) or dismiss it.
- Suggestions respect the content classification boundary: they are always marked as `creative`.

**US-CL-11: Character relationship map**

> As a fiction writer, I want to see a visual map of relationships between my fictional characters and historical figures, so that I can understand the social network of my narrative world.

Acceptance criteria:
- A network/graph visualization shows people (historical and fictional) as nodes and relationships as edges.
- Nodes are color-coded by content classification.
- Edges are labeled with relationship type (family, colleague, adversary, etc.).
- The graph is filterable by era, content classification, and creative property.
- Clicking a node navigates to that person's detail view.

**US-CL-12: Multi-setting map with character movement**

> As a world creator, I want to see a regional map showing Vashon Island, Seattle, Tacoma, and surrounding areas, with the ability to trace a character's movement between settings over time.

Acceptance criteria:
- A map view displays the Puget Sound region with setting boundaries marked.
- Places from all settings are plotted on the map.
- A character's geographic trajectory can be displayed as a path on the map, with waypoints labeled by date.
- The map is synchronized with the timeline: scrubbing the timeline updates which portion of a character's path is highlighted.

**US-CL-13: Export combined worldbuilding package**

> As a game designer, I want to export the full worldbuilding package -- historical data, creative content, narrative dashboard summary, and relationship data -- as a single structured JSON file for consumption by my game engine or an AI narrator.

Acceptance criteria:
- The export includes all data from the current export format, plus: creative entries with their classification, fictional characters with narrative roles, creative properties, and a narrative structure summary.
- Each entry in the export carries its `content_class` field.
- The export schema is documented.
- The AI narrator system prompt included in the export is updated to describe how to handle creative vs. historical content.

---

## 4. Feature Prioritization

### P0 -- Must Have (Creative Layer MVP)

These features define the minimum viable creative layer. Without them, the system cannot distinguish between fact and fiction, which is the fundamental capability.

| ID | Feature | Rationale |
|----|---------|-----------|
| US-CL-01 | Content classification field | Foundation for the entire creative layer. Without this, no other creative feature can function correctly. |
| US-CL-02 | Fictional character support | Core worldbuilding need. Writers must be able to add characters and see them in context. |
| US-CL-03 | Narrative event support | Core worldbuilding need. Writers must be able to add plot points and see them on the timeline. |
| US-CL-04 | View mode toggle (historical/creative/combined) | Without this, the visual distinction between fact and fiction is not actionable. Users must be able to isolate each content class. |
| US-CL-05 | People timeline (lifespan view) | Explicitly requested by the user. High-value for verifying temporal consistency of characters. |

### P1 -- Should Have

These features significantly extend the worldbuilding capability and address the user's vision for regional context and narrative management.

| ID | Feature | Rationale |
|----|---------|-----------|
| US-CL-06 | Multi-setting support | Explicitly requested by the user (Seattle, Tacoma context). Required for stories where characters move between locations. |
| US-CL-07 | Narrative dashboard | Explicitly requested by the user. Provides the "command center" view of the creative world. |
| US-CL-08 | Creative property grouping | Necessary for managing multiple creative projects. Low implementation cost relative to organizational value. |
| US-CL-09 | Narrative connection insights | High value for the AI-assisted worldbuilding workflow. Bridges the gap between research and creative work. |

### P2 -- Nice to Have

These features represent the full vision but are not required for the creative layer to be usable.

| ID | Feature | Rationale |
|----|---------|-----------|
| US-CL-10 | AI-assisted worldbuilding suggestions | Depends on connection insights (CL-09). High value but complex to implement well. |
| US-CL-11 | Character relationship map | Visual network graph. High design and engineering cost. Can be approximated by cross-references in the interim. |
| US-CL-12 | Multi-setting map with character movement | Depends on multi-setting support (CL-06) and map view (existing P2). |
| US-CL-13 | Combined worldbuilding export | Depends on all creative layer data model changes being stable. Should be the capstone feature. |

---

## 5. Data Model Changes

### 5.1 New Fields on Existing Entities

The following fields are added to all entity types (TimelineEntry, Person, Place, EnvironmentFeature).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content_class` | string enum | Yes | `"historical"`, `"creative"`, or `"historical-inspired"`. Defaults to `"historical"` for all existing data. |
| `creative_property` | string | No | Name of the creative project this entry belongs to (e.g., "Vashon Chronicles"). Only applicable when `content_class` is `"creative"` or `"historical-inspired"`. |

### 5.2 New Fields on Person

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `narrative_role` | string enum | No | `"protagonist"`, `"antagonist"`, `"supporting"`, `"minor"`, `"mentioned"`. Only applicable when `content_class` is `"creative"`. |
| `narrative_status` | string enum | No | `"active"`, `"inactive"`, `"deceased"`. Tracks the character's current state in the narrative. |

### 5.3 New Fields on TimelineEntry

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `narrative_type` | string enum | No | `"plot_point"`, `"character_event"`, `"world_event"`, `"backstory"`. Only applicable when `content_class` is `"creative"`. |
| `narrative_arc` | string | No | Name of the narrative arc this entry belongs to. |

### 5.4 New Field: Setting

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `setting` | string | Yes | The setting this entry belongs to (e.g., `"vashon-island"`, `"seattle"`, `"tacoma"`). Defaults to the primary setting for all existing data. |

### 5.5 New Entity: Setting Configuration

A new top-level entity that defines a setting.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique setting identifier (e.g., `"vashon-island"`) |
| `name` | string | Yes | Display name (e.g., `"Vashon Island, WA"`) |
| `type` | string enum | Yes | `"primary"` or `"context"` |
| `region` | string | No | Region grouping (e.g., `"puget-sound"`) |
| `coordinates` | object | No | Geographic center: `{ lat, lng }` |
| `era_definitions` | array | No | Setting-specific era definitions, or null to inherit from primary |

### 5.6 Schema Migration Strategy

All existing data retains full backward compatibility.

- Existing entries gain `content_class: "historical"` and `setting: "vashon-island"` as defaults.
- No existing field is removed or renamed.
- New fields are added as optional (except `content_class`, which becomes required and defaults to `"historical"`).
- A migration script auto-populates the new fields for existing data.
- The validation script is updated to check the new fields.

---

## 6. Milestone Proposals

### M7 -- Creative Data Model (Estimated: 1 sprint)

**Goal:** Extend the data model to support creative content classification, fictional entities, and multi-setting structure.

**Deliverables:**
- Updated JSON schemas for all entity types with new fields (content_class, creative_property, narrative_role, narrative_type, setting)
- New Setting Configuration schema
- Migration script for existing data (add defaults)
- Updated validation script
- Updated search index to include content_class as a facet
- Sample creative entries (5-10 fictional characters, 5-10 narrative events) for testing
- Updated data loader with content classification awareness

**Responsible:** Engineer (lead), Database Engineer (indexing), Researcher (sample creative data), PM (acceptance)

**Quality Gate:** All existing data validates against updated schemas. New creative entries validate. Search index includes content_class facet. No regression in existing tests.

**Dependencies:** None (extends M2 output)

---

### M8 -- Creative Layer UI (Estimated: 1 sprint)

**Goal:** Build the visual distinction between historical and creative content, the view mode toggle, and the people timeline.

**Deliverables:**
- Visual treatment for creative entries (distinct marker style, card border, badge) per Design Bible extension
- View mode toggle component (historical / creative / combined)
- Content classification badge in EntryCard and DetailPanel
- People Timeline view (lifespan bars for historical + fictional people)
- Updated FilterPanel with view mode integration
- Updated URL query string to include view mode

**Responsible:** Engineer (lead), Designer (creative visual treatment), UI/UX (people timeline interaction design)

**Quality Gate:** Creative entries are visually distinguishable from historical entries at a glance. View mode toggle correctly filters all views. People timeline renders lifespans for both historical and fictional characters. All existing tests pass plus new tests for creative layer components.

**Dependencies:** M7 (data model must be in place)

---

### M9 -- Multi-Setting and Narrative Dashboard (Estimated: 1 sprint)

**Goal:** Add multi-setting support with regional context and the narrative dashboard view.

**Deliverables:**
- Setting selector in the UI
- Data loading for multiple settings (each setting in its own directory)
- Setting overlay on timeline (visual distinction between settings)
- Cross-setting references
- Skeleton data for Seattle and Tacoma (20-30 high-level entries each)
- Narrative dashboard view:
  - Character roster panel
  - Narrative arc summary
  - Era coverage matrix
  - People overlap summary
  - Plot point distribution visualization

**Responsible:** Engineer (lead), Researcher (Seattle/Tacoma skeleton data), Designer (dashboard layout), PM (dashboard requirements)

**Quality Gate:** Multiple settings load and display correctly. Setting overlay on timeline is readable. Narrative dashboard displays all five panels with real and sample data. Performance remains within M7 targets with 3 settings loaded.

**Dependencies:** M8 (creative layer UI must be in place)

---

### M10 -- Creative Layer Polish and Export (Estimated: 1 sprint)

**Goal:** Refine the creative layer experience, add narrative connection insights, and update the export to include creative content.

**Deliverables:**
- Creative property filter in FilterPanel
- Narrative connection insights engine (temporal/geographic overlap detection)
- Insights panel or annotation layer
- Updated export dialog with creative content options
- Updated export schema to include content_class, creative properties, narrative structure
- Updated AI narrator system prompt (handling of creative vs. historical content)
- Creative layer accessibility audit
- Creative layer test suite

**Responsible:** Engineer (lead), AI Narrator (system prompt update), Tester (audit and tests), UI/UX (insights interaction)

**Quality Gate:** Connection insights surface at least 5 overlaps in the sample dataset. Export includes creative content with correct classification. Narrator system prompt handles fact/fiction boundary. All tests pass. Accessibility audit passes.

**Dependencies:** M9 (multi-setting and dashboard must be in place)

---

### M11 -- Creative Layer Validation (Estimated: 1 sprint)

**Goal:** End-to-end validation of the complete creative layer, including user testing with the worldbuilding workflow.

**Deliverables:**
- Full E2E test suite for creative layer features
- Worldbuilding workflow walkthrough (add characters, add narrative events, view people timeline, review narrative dashboard, export)
- Performance benchmarks with creative + historical data combined
- User testing feedback
- Bug fixes and refinements
- Updated documentation (PRD, FRD, Design Bible, Test Plan)

**Responsible:** Tester (lead), all agents (fixes and review)

**Quality Gate:** All test categories green. Worldbuilding workflow completes without errors. No critical or high-severity bugs open. Documentation reflects the creative layer in full.

**Dependencies:** M10

---

### Proposed Milestone Dependency Graph

```
Existing:
M0 --> M1 --> M2 --> M3 --> M4 --> M5 --> M6 (all complete)

Creative Layer:
M6 --> M7 (Creative Data Model)
M7 --> M8 (Creative Layer UI)
M8 --> M9 (Multi-Setting + Narrative Dashboard)
M9 --> M10 (Polish + Export)
M10 --> M11 (Validation)
```

---

## 7. Success Metrics

### Primary Metrics -- Creative Layer

| Metric | Description | Target |
|--------|-------------|--------|
| **Content classification accuracy** | Percentage of entries with a correct, non-default content_class value after the writer has used the system | 100% of creative entries correctly classified. 100% of historical entries retain their classification. |
| **Visual distinction clarity** | User can correctly identify whether an entry is historical or creative from the timeline view alone (without opening the detail panel), measured in usability testing | 95% accuracy in a 20-entry identification task. |
| **People timeline utility** | Percentage of worldbuilding sessions where the user consults the people timeline at least once | 60% or higher. |
| **Temporal consistency errors caught** | Number of temporal inconsistencies (fictional character placed in wrong era, narrative event conflicts with historical record) that the system helps the user identify during worldbuilding | At least 3 issues surfaced per worldbuilding session in usability testing. |
| **Export classification integrity** | Percentage of exported entries that carry the correct content_class field | 100%. |

### Secondary Metrics -- Creative Layer

| Metric | Description | Target |
|--------|-------------|--------|
| **Multi-setting adoption** | Percentage of users who create or load at least one context setting beyond the primary setting | 40% or higher. |
| **Narrative dashboard engagement** | Average time spent on the narrative dashboard per session | At least 2 minutes per session (indicating the dashboard provides value, not just a glance). |
| **Connection insights acceptance** | Percentage of surfaced narrative connection insights that the user marks as useful or saves | 30% or higher (given that many insights will be obvious or irrelevant, this threshold indicates the engine is generating non-trivial suggestions). |
| **Creative entries per session** | Average number of creative entries (characters, narrative events) added per worldbuilding session | 3 or more per session. |
| **Combined view usage** | Percentage of session time spent in "combined" view mode (vs. historical-only or creative-only) | 50% or higher, indicating the integrated view is the primary working mode. |

---

## 8. Risks and Open Questions

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Visual clutter with two content classes on timeline** | Creative + historical entries together may overwhelm the timeline at dense eras | High | Design must emphasize visual hierarchy: historical entries as the solid "ground layer," creative entries as the lighter "overlay." Provide strong view-mode controls so the user can isolate each class. |
| **Data model complexity increases schema fragility** | Adding content_class, setting, narrative fields to every entity increases the surface area for schema validation errors | Medium | Strict schema validation. Migration script with dry-run mode. Automated tests for all new fields. |
| **Multi-setting data maintenance burden** | Seattle and Tacoma context settings require research that is outside the Vashon Island specialization | Medium | Context settings are explicitly lighter-weight: 20-30 high-level entries, not 100+ detailed entries. They provide timeline context, not deep research. |
| **Narrative connection insights generate noise** | If the insight engine produces too many obvious or irrelevant suggestions, users will ignore it | Medium | Start with a conservative algorithm (only surface overlaps where temporal AND geographic proximity occur). Add user feedback (dismiss/save) to tune relevance. |
| **Performance degradation with multiple settings** | Loading 3 settings with creative content could push JSON file size beyond the 1MB prototype target | Low | Each setting in its own file. Lazy-load context settings. Monitor total payload size. |
| **Scope creep into full authoring tool** | The creative layer could expand into a full content management system, which is out of scope | High | The creative layer supports adding and classifying entries. It does not support rich text editing, revision history, or collaborative workflows. Authoring remains lightweight. |

### Open Questions

| Question | Owner | Status |
|----------|-------|--------|
| What visual treatment best distinguishes creative from historical entries on the timeline? Options include: dashed borders, different marker shapes, translucent fill, hatched patterns, a dedicated "creative lane" above the historical lane. | Designer + UI/UX | Open -- to be resolved in M8 |
| Should historical-inspired entries (`content_class: "historical-inspired"`) appear in both historical-only and creative-only views, or only in combined view? | PM | Open -- proposed answer: they appear in both, since they bridge the two categories |
| How should the people timeline handle characters whose lifespans span multiple eras? Horizontal bar spanning all eras, or segmented by era? | UI/UX | Open -- to be resolved in M8 |
| Should context settings (Seattle, Tacoma) support creative content, or only historical entries? | PM | Open -- proposed answer: both, since characters travel between settings |
| What is the maximum number of settings the system should support before performance becomes a concern? | Engineer + DB Engineer | Open -- to be evaluated in M9 |
| Should the narrative dashboard be a separate route/page, or a panel within the main timeline view? | UI/UX + Designer | Open -- to be resolved in M9 |
| How does the AI narrator system prompt handle the boundary between historical and creative content during gameplay? (e.g., can the narrator modify creative content in response to player actions?) | AI Narrator | Open -- to be resolved in M10 |

---

## 9. Coordination Notes

### Agents Affected by This Addendum

| Agent | Impact | Action Required |
|-------|--------|----------------|
| **Product Manager** | Primary author of this addendum. Owns feature scope, acceptance criteria, and milestone schedule for the creative layer. | Finalize this addendum based on team feedback. Update PRD main document to reference the addendum. |
| **Engineer** | Major implementation work across data model, UI, multi-setting, and export. | Review data model changes (Section 5). Estimate implementation effort for M7-M11. Flag feasibility concerns. |
| **Database Engineer** | Indexing and search must support content_class as a filter facet. Multi-setting loading affects the data layer. | Review data model changes. Plan search index updates. Evaluate performance impact of multi-setting loading. |
| **Researcher** | Skeleton data needed for Seattle and Tacoma context settings. Sample creative entries needed for testing. | Begin high-level Seattle and Tacoma research. Provide 20-30 entries per setting. |
| **Designer** | Visual treatment for creative vs. historical entries. Narrative dashboard layout. People timeline design. | Propose creative entry visual treatment. Design narrative dashboard wireframes. Extend Design Bible. |
| **UI/UX** | People timeline interaction design. Narrative dashboard interaction. View mode toggle placement. | Design people timeline interaction model. Plan narrative dashboard navigation. |
| **Tester** | New test cases for content classification, view mode toggling, people timeline, multi-setting, and creative export. | Extend test plan with creative layer test cases. |
| **AI Narrator** | Updated system prompt. Handling of creative vs. historical content in narration. Export schema changes. | Review updated export requirements. Draft system prompt changes for fact/fiction boundary. Evaluate creative content handling. |

### Cross-Agent Dependencies

```
PM (this addendum) --> all agents (review and feedback)
Engineer (M7 schemas) --> DB Engineer (indexing), Researcher (sample data)
Designer (creative visual treatment) --> Engineer (M8 implementation)
Researcher (Seattle/Tacoma data) --> Engineer (M9 multi-setting)
AI Narrator (system prompt) --> Engineer (M10 export)
Tester (test plan update) --> Engineer (M11 validation)
```

### Decision Authority

Per the existing coordination protocol, the following decisions rest with the Product Manager:

- Feature scope and priority for the creative layer (Sections 3 and 4 of this addendum).
- Acceptance criteria for all creative layer user stories.
- Milestone scope and release readiness for M7-M11.
- Scope trade-offs if the creative layer timeline is at risk (e.g., deferring P2 features, reducing context setting depth).

Technical decisions (data model implementation, visual treatment specifics, performance optimization) rest with the Engineer, Designer, and Database Engineer per their existing decision authority.

---

*End of PRD Addendum: Creative Layer Evolution.*
