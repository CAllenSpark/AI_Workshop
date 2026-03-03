# Milestone Schedule

## Writer's Research Companion

### Overview

This schedule defines the phased delivery plan from project scaffolding through validated prototype. Each milestone has defined deliverables, responsible agents, and quality gates.

---

## M0 — Foundation

**Goal:** Project scaffolding, team setup, and initial research seed

**Deliverables:**
- Project directory structure
- 6 agent personas configured and operational
- CLAUDE.md project configuration
- PRD, FRD, Design Bible, Test Plan (initial versions)
- Coordination board established
- Vashon Island research skeleton (10-20 timeline entries)
- Timeline entry JSON schema

**Responsible:** All agents

**Quality Gate:** All docs exist and are internally consistent. JSON data validates against schema. Team coordination board is populated.

**Status:** Complete (2026-03-02)

---

## M1 — Research

**Goal:** Complete the Vashon Island knowledge base with validated sources

**Deliverables:**
- Comprehensive timeline entries for all 10 eras (target: 80-120 entries)
- People directory with key historical figures
- Places directory with locations and landmarks
- Environment file with geography, ecology, climate data
- Complete bibliography with source ranking
- Cross-reference validation (all people/place/event links are bidirectional)

**Responsible:** Researcher (lead), Tester (validation), PM (coverage review)

**Quality Gate:** 100% of entries have at least one source citation. No orphaned cross-references. All eras have minimum 5 entries.

**Status:** Complete (2026-03-02) — 93 entries, 85 people, 67 places, 137 sources, all quality gates passed

---

## M2 — Data Model

**Goal:** Finalize schemas and build data import pipeline

**Deliverables:**
- Finalized JSON schemas for all entity types
- Data validation script
- Import/transform utilities for raw research into structured JSON
- Indexed search data structure
- Sample export in AI narrator format

**Responsible:** Engineer (lead), Researcher (data), Tester (validation)

**Quality Gate:** Schema validation passes on all data. Import pipeline runs without errors. Export format matches specification.

**Status:** Complete (2026-03-02) — 4 schemas, transform pipeline, validation script, search index (264 records), narrator export (350KB)

---

## M3 — Core UI

**Goal:** Build the timeline component with basic scrubbing and data display

**Deliverables:**
- React application scaffold (Vite + TypeScript)
- Timeline track component with era markers
- Scrubbing interaction (drag/slider)
- Zoom levels (era, century, decade, year)
- Entry card component
- Detail panel component
- Data loading from JSON files

**Responsible:** Engineer (lead), Designer (visual specs), UI/UX (interaction review)

**Quality Gate:** Timeline renders with real data. Scrubbing is smooth (60fps). All unit tests pass. Basic E2E smoke test passes.

**Status:** Complete (2026-03-02) — React 18 + TypeScript + Vite. TimelineTrack with era bands, entry markers, drag scrubbing, 4 zoom levels, minimap, era quick-jump. EntryCard with layer badges. DetailPanel with cross-references and source links. 481KB production build.

---

## M4 — Search & Filter

**Goal:** Add search, filtering, and layer toggling

**Deliverables:**
- Full-text search with Fuse.js integration
- Search results display with relevance ranking
- Layer toggle controls (events, people, places, environment)
- Date range filter (time window selection)
- Era quick-select
- Combined filter logic (AND)
- Search results under 100ms

**Responsible:** Engineer (lead), UI/UX (interaction design), Tester (performance)

**Quality Gate:** Search returns accurate results under 100ms. All filter combinations work correctly. Layer toggles update timeline and cards.

**Status:** Complete (2026-03-02) — Fuse.js full-text search (<100ms). FilterPanel with layer toggles, era chips, dual-handle date range slider. Combined AND filter logic (search + layers + eras + date range). Empty state UX. 228KB JS production build.

---

## M5 — Polish & Export

**Goal:** Refine the interface and build the AI narrator export

**Deliverables:**
- AI narrator JSON export functionality
- Reference link display in detail panel
- Responsive layout (desktop, tablet, mobile)
- Visual polish per Design Bible specifications
- Keyboard navigation
- Screen reader support
- Color contrast audit

**Responsible:** Engineer (export), Designer (polish), UI/UX (accessibility), Tester (audit)

**Quality Gate:** Export validates against schema. Accessibility audit passes WCAG 2.1 AA. Responsive breakpoints work correctly.

**Status:** Complete (2026-03-02) — ExportDialog with 3 scope options (all/filtered/era), include toggles (details, sources, coordinates), file download. WCAG AA color contrast audit: 5 failures fixed (warm-amber, stone, teal, era labels, inactive toggles). Skip link, aria-live regions, focus trap in modals. KeyboardHelp dialog (? key). Responsive mobile improvements. 237KB JS production build.

---

## M6 — Validation

**Goal:** End-to-end testing, user testing, and refinement

**Deliverables:**
- Full E2E test suite passing
- Accessibility audit results (axe-core + manual)
- Performance benchmarks documented
- User testing feedback (if applicable)
- Bug fixes and refinements
- Final documentation update

**Responsible:** Tester (lead), all agents (fixes and review)

**Quality Gate:** All test categories green. No critical or high-severity bugs open. Documentation is current.

**Status:** Complete (2026-03-02) — 122 tests across 10 test files. Unit tests: parseDate, eras, CRUD, DataStore indexes, EntryCard, FilterPanel, DetailPanel, ErrorBoundary, useSearch. Integration tests: filter pipeline, export generation, data validation. TypeScript clean. Production build: 252KB JS, 29KB CSS.

---

## M7 — Fantasy Data Model

**Goal:** Extend the data model to support creative/fantasy content alongside historical facts

**Deliverables:**
- Schemas v2: entry_type, scope, universe_id, narrative metadata
- Universe schema and management
- TypeScript types: EntryType, ScopeKey, NarrativeBeat, AnchorRelationship, Universe
- Backward-compatible data loader with fantasy validation

**Status:** Complete (2026-03-03) — 142 tests, 10 files, all green. 4 schemas v2.

---

## M8 — Creative Layer UI

**Goal:** Visual design system for creative content — colors, markers, toggles, people timeline

**Deliverables:**
- ViewModeToggle (Historical/Creative/All)
- TabNav with Timeline, People, Narrative tabs
- PeopleTimeline with lifespan bars
- Creative entry visual treatment (dashed borders, diamond markers, badges)

**Status:** Complete (2026-03-03) — 172 tests, 14 files, all green. 264KB JS, 37KB CSS.

---

## M9 — Multi-Setting + Narrative Dashboard

**Goal:** Multiple geographic scopes and narrative arc visualization

**Deliverables:**
- Scope filtering (Vashon/Seattle/Tacoma/National)
- NarrativeDashboard with arc breakdown, beat track, historical connections
- 30 regional context entries (15 Seattle, 15 Tacoma)

**Status:** Complete (2026-03-03) — 197 tests, 15 files, all green. 141 entries.

---

## M10 — Writer Export + Multi-Project

**Goal:** Writer-focused export formats and multi-project isolation

**Deliverables:**
- Character Dossiers, Location Guides, Props Catalog, Combined Writer Export
- NarrativeProp type (10 function categories)
- Multi-project management with localStorage isolation
- ProjectSelector component (create/import/delete)
- Multi-book/season support with NarrativeDashboard filter

**Status:** Complete (2026-03-03) — 268 tests, 18 files, all green. 285KB JS, 47KB CSS.

---

## M11 — Creative Layer Validation

**Goal:** End-to-end validation of the complete creative layer, multi-project system, and narrator integration

**Deliverables:**
- Multi-project integration tests (isolation, switching, data integrity, book management)
- Writer export integration tests (all 4 formats validated)
- Worldbuilding workflow walkthrough (Room 33 end-to-end scenario)
- Cross-reference integrity tests (narrative anchors, prop references)
- Narrator system prompt template (context-aware, project-specific)
- Performance benchmarks documented

**Responsible:** Tester (lead), all agents (fixes and review)

**Quality Gate:** All test categories green. Worldbuilding workflow completes without errors. No critical bugs. Documentation current.

**Status:** Complete (2026-03-03) — 315 tests, 22 files, all green. TypeScript clean. Build: 285KB JS, 47KB CSS (87KB gzipped).

---

## Dependency Graph

```
M0 (Foundation) --> M1 (Research)
M0 (Foundation) --> M2 (Data Model)
M1 (Research) --> M2 (Data Model)
M2 (Data Model) --> M3 (Core UI)
M3 (Core UI) --> M4 (Search & Filter)
M4 (Search & Filter) --> M5 (Polish & Export)
M5 (Polish & Export) --> M6 (Validation)
M6 (Validation) --> M7 (Fantasy Data Model)
M7 (Fantasy Data) --> M8 (Creative Layer UI)
M8 (Creative UI) --> M9 (Multi-Setting + Narrative Dashboard)
M9 (Multi-Setting) --> M10 (Writer Export + Multi-Project)
M10 (Writer Export) --> M11 (Creative Layer Validation)
```

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Insufficient historical sources for some eras | Gaps in timeline | Prioritize well-documented eras; mark gaps explicitly |
| Timeline rendering performance with many entries | Poor UX | Implement virtualization; test with 500+ entries early |
| JSON file size grows beyond 1MB | Slow initial load | Split by era; implement lazy loading |
| D3.js learning curve | Delayed M3 | Evaluate Vis-timeline as simpler alternative |
