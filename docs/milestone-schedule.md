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

**Status:** Not Started

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

**Status:** Not Started

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

**Status:** Not Started

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

**Status:** Not Started

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

**Status:** Not Started

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

**Status:** Not Started

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
```

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Insufficient historical sources for some eras | Gaps in timeline | Prioritize well-documented eras; mark gaps explicitly |
| Timeline rendering performance with many entries | Poor UX | Implement virtualization; test with 500+ entries early |
| JSON file size grows beyond 1MB | Slow initial load | Split by era; implement lazy loading |
| D3.js learning curve | Delayed M3 | Evaluate Vis-timeline as simpler alternative |
