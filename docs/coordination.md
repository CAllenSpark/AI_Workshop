# Team Coordination Board

## Current Sprint: M7 Fantasy Data Model — Complete

| Agent | Status | Current Task | Blockers |
|-------|--------|-------------|----------|
| Product Manager | Active | M7 complete; M8 Regional Research sprint ready | None |
| Engineer | Complete | M7 schema v2, TypeScript types, data loader, AddEntryDialog, eras colors — all implemented | None |
| Database Engineer | Complete | New indexes (entriesByScope, entriesByType) implemented, cache version bumped | None |
| Researcher | Queued | Regional research sprint (Seattle, Tacoma, US events) ready to begin | Awaiting M8 start |
| Designer | Complete | Fantasy color palette, visual distinction system, Design Bible v2 (Sections 9-11) | None |
| Tester | Complete | Fantasy test coverage: 142 tests (up from 122), 10 files, all green | None |
| UI/UX | Reviewing | Reviewing fantasy mode toggle and narrative flow UX | None |
| AI Narrator | Active | World-building tools and narrator export format consultation | None |

## Decisions Log

| Date | Decision | Made By | Rationale |
|------|----------|---------|-----------|
| 2026-03-02 | Use JSON flat files as data layer (not SQLite) | PM + Eng | Simpler for prototype; portable, hand-editable, version-controlled. Can migrate to SQLite later if needed. |
| 2026-03-02 | Skeleton research seed (10-20 entries) for M0 | PM | Enough to validate schema and test UI; full research expansion in M1. |
| 2026-03-02 | Professional neutral voice for all agents | PM | Consistency and clarity over personality. |
| 2026-03-02 | Vashon Island, WA as prototype setting | PM | Rich history spanning 10,000+ years; well-documented; diverse eras and data types. |
| 2026-03-02 | Camp Sealth associated with Camp Fire (not YMCA/YWCA) | Researcher | Web research confirmed Camp Sealth was founded by Camp Fire Girls, not YMCA/YWCA as originally assumed. |
| 2026-03-02 | Darken warm-amber (#C8913A -> #9E7430), teal (#3A8C8C -> #2B7A7A), stone (#D1CCC4 -> #9E9890) for WCAG AA | Eng + Designer | Color contrast audit found 5 failures; darkened colors to meet 4.5:1 for normal text. |
| 2026-03-02 | Add Database Engineer agent to team | PM + Eng | Data layer needs dedicated optimization ownership as dataset grows toward 500+ entries. |
| 2026-03-03 | Fantasy palette uses purple/violet family (Amethyst #7B4BAA anchor) to avoid overlap with historical PNW palette | Designer | Purple occupies a distinct color-wheel region from green/blue/amber/brown; carries cultural association with imagination; all values pass WCAG AA 4.5:1. |
| 2026-03-03 | Fantasy entries hidden by default, opt-in via master toggle | Designer | Historical accuracy is the primary value prop; fantasy must never contaminate a researcher's view without explicit consent. |
| 2026-03-03 | Regional context layers use desaturated gray family, reduced visual weight (6px markers, 60% opacity) | Designer | Regional events are subordinate context, not primary research data. Visual hierarchy must communicate this. |
| 2026-03-03 | Fantasy visual vocabulary: diamond shapes, dashed borders, striped indicators, glow effects | Designer | Four-signal system (color + shape + texture + badge) ensures no single signal bears full responsibility for distinction. |
| 2026-03-02 | Implement localStorage caching for data | DB Eng | Reduces repeat-visit load time from ~500ms to near-instant. Background refresh keeps data fresh. |
| 2026-03-02 | Add O(1) ID-based lookup maps | DB Eng | entriesById, peopleById, placesById eliminate O(n) find() calls in DetailPanel cross-references. |
| 2026-03-02 | Pre-compute parsed dates | DB Eng | parsedDates Map eliminates redundant parseDate() calls during every filter cycle. |
| 2026-03-02 | Paginate entry list (50 per page) | DB Eng | Prevents rendering 500+ cards in DOM at once; "Show More" button loads next batch. |

## Open Questions

- [ ] Which timeline visualization library to use: D3.js (flexible, complex) vs Vis-timeline (simpler, purpose-built)? — **Engineer to evaluate in M2**
- [ ] How should the AI narrator export format handle approximate dates (e.g., "~10000 BCE")? — **Engineer + Researcher to define in M2**
- [ ] Should the map view (P2 feature) use a historical map or modern satellite? — **Designer + Researcher to discuss in M1**
- [x] Fantasy entry data model: `entry_type`, `scope`, `universe_id`, `narrative` fields added to TimelineEntry; `universe.schema.json` created — **M7 Complete**
- [x] Fantasy layer keys: separate FANTASY_LAYER_COLORS constant created alongside existing LAYER_COLORS; AddEntryDialog switches palette by entry_type — **M7 Complete**
- [ ] Regional context data sources: where do Seattle/Tacoma/US event entries come from? — **Researcher to scope regional data collection in M8**
- [ ] AI Narrator export: should fantasy entries be included in narrator exports, and if so how should they be flagged? — **AI Narrator to evaluate**

## Completed Items

- [x] Project directory structure created (2026-03-02)
- [x] Team agent personas defined and configured (2026-03-02)
- [x] CLAUDE.md project configuration established (2026-03-02)
- [x] PRD initial draft complete — 10 user stories, 3 personas (2026-03-02)
- [x] FRD initial draft complete — full data model, component specs (2026-03-02)
- [x] Design Bible initial draft complete — color palette, typography, wireframes (2026-03-02)
- [x] Test Plan initial draft complete — 30+ test cases, quality gates (2026-03-02)
- [x] Milestone Schedule defined — M0 through M6 with dependency graph (2026-03-02)
- [x] Vashon Island skeleton research — 18 entries across all 10 eras (2026-03-02)
- [x] Timeline entry JSON schema created and validated (2026-03-02)
- [x] Project dashboard created (2026-03-02)
- [x] **M0 Foundation milestone complete** (2026-03-02)
- [x] Growth & Industry era expanded: 10 new entries (gro-003 through gro-012) (2026-03-02)
- [x] Early 20th Century era expanded: 11 new entries (ear-004 through ear-014) (2026-03-02)
- [x] Exploration era expanded: 5 new entries (exp-003 through exp-007) (2026-03-02)
- [x] Logging & Treaty era expanded: 4 new entries (log-003 through log-006) (2026-03-02)
- [x] Pioneer era expanded: 11 new entries (pio-003 through pio-013) (2026-03-02)
- [x] Sources.md expanded to 137 entries covering all 139 timeline.json source URLs (2026-03-02)
- [x] **M1 Research milestone complete** (2026-03-02)
- [x] **M2 Data Model milestone complete** (2026-03-02)
- [x] **M3 Core UI milestone complete** (2026-03-02)
- [x] **M4 Search & Filter milestone complete** (2026-03-02)
- [x] ExportDialog component with scope options (all/filtered/era), include toggles, file download (2026-03-02)
- [x] Export button added to header with keyboard shortcut (E) (2026-03-02)
- [x] KeyboardHelp dialog with all shortcuts (? to toggle) (2026-03-02)
- [x] Accessibility: skip link, aria-live regions, focus trap in dialogs, screen reader support (2026-03-02)
- [x] WCAG AA color contrast audit — 5 failures fixed (warm-amber, stone, teal, era labels, inactive toggles) (2026-03-02)
- [x] Responsive improvements: mobile entry-count hidden, export button compact, proper breakpoints (2026-03-02)
- [x] **M5 Polish & Export milestone complete** (2026-03-02)
- [x] Database Engineer agent persona created (2026-03-02)
- [x] DB Engineer code review: identified 7 scalability issues (2026-03-02)
- [x] Data layer optimizations: O(1) lookup maps, pre-computed dates, localStorage caching, entry pagination (2026-03-02)
- [x] AddEntryDialog for on-demand research (N key shortcut) with validation (2026-03-02)
- [x] ErrorBoundary wrapping entire app with graceful recovery (2026-03-02)
- [x] Data integrity validation on load with console warnings (2026-03-02)
- [x] Interactive help tutorial for first-time users (9 steps, localStorage persistence) (2026-03-02)
- [x] CRUD operations: addEntry/removeEntry with immutable store updates (2026-03-02)
- [x] **Hardening sprint complete** (2026-03-02) — 252KB JS, 29KB CSS production build
- [x] Vitest test infrastructure set up (vitest, @testing-library/react, jsdom) (2026-03-02)
- [x] Test fixtures created: 7 entries, 4 people, 3 places, 2 environment features (2026-03-02)
- [x] Unit tests: parseDate (13 cases), eras (10 cases), CRUD ops (12 cases), DataStore (6 cases) (2026-03-02)
- [x] Component tests: EntryCard (12 cases), FilterPanel (12 cases), DetailPanel (14 cases), ErrorBoundary (4 cases) (2026-03-02)
- [x] Search tests: useSearch hook (9 cases) (2026-03-02)
- [x] Integration tests: filter pipeline (8 cases), export generation (11 cases), data validation (16 cases) (2026-03-02)
- [x] TypeScript clean (0 errors), production build: 252KB JS, 29KB CSS (2026-03-02)
- [x] **M6 Validation milestone complete** (2026-03-02) — 122 tests, 10 files, all green
- [x] Research enrichment: +18 timeline entries (93->111), filling state-ferry (+6), logging-treaty (+4), modern (+4), wwii/indigenous/ear/gro (+1 each) (2026-03-02)
- [x] Research enrichment: +28 people (85->113) — Betty MacDonald, Lucy Gerand, Captain Gertrude Wiman, Bruce Haulman, Bill Moyer, Martinolich, Peabody, farming families, and more (2026-03-02)
- [x] Research enrichment: 4 entries enriched with deeper details — Mukai Barreling Plant, Dockton Dry Dock, Strawberry Industry, Mukai Historic Places (2026-03-02)
- [x] Environment cross-references fixed: all 12 features now point to relevant entries instead of pre-007 (2026-03-02)
- [x] Search index, narrator export, and ID mapping regenerated with enriched data (303 records, 292KB, 303 mappings) (2026-03-02)
- [x] people.md narrative updated with all 28 new figures (2026-03-02)
- [x] All 122 tests still passing after enrichment (2026-03-02)
- [x] Data integrity fixes: 46 validation warnings → 0 (27 name mismatches, 12 orphaned people, 4 new tribal records, 3 name simplifications) (2026-03-03)
- [x] Fantasy expansion proposal drafted: `docs/fantasy-expansion-proposal.md` with milestones M7-M12 (2026-03-03)
- [x] Designer consultation complete: fantasy color palette (Amethyst #7B4BAA family), four-signal visual distinction, Design Bible v2 Sections 9-11 (2026-03-03)
- [x] AI Narrator consultation initiated: world-building tools, narrator export extensions, narrative flow features (2026-03-03)
- [x] **M7 Fantasy Data Model milestone complete** (2026-03-03)
  - Schemas updated: timeline-entry v2, person v2, place v2, universe.schema.json (new)
  - TypeScript types: EntryType, ScopeKey, NarrativeBeat, AnchorRelationship, NarrativeMetadata, Universe
  - Data loader: applyEntryDefaults/applyPersonDefaults, fantasy validation, entriesByScope/entriesByType indexes
  - AddEntryDialog: entry type selector, scope dropdown, universe field, fantasy color switching
  - eras.ts: FANTASY_LAYER_COLORS, FANTASY_COLORS, SCOPE_COLORS, ENTRY_TYPE_COLORS
  - Test fixtures: fantasy universe, person, entry with narrative; regional entry
  - Tests: 142 total (up from 122), all green. TypeScript clean.
