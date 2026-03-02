# Team Coordination Board

## Current Sprint: M6 — Validation (Hardening Complete)

| Agent | Status | Current Task | Blockers |
|-------|--------|-------------|----------|
| Product Manager | Idle | Hardening complete; ready for M6 review | None |
| Engineer | Active | Hardening sprint complete | None |
| Database Engineer | Active | Code review complete; optimizations deployed | None |
| Researcher | Idle | Data finalized | None |
| Designer | Ready | Will review M6 visual regression | None |
| Tester | Ready | Will run full E2E and accessibility audits | None |
| UI/UX | Ready | Will verify responsive + keyboard nav in M6 | None |
| AI Narrator | Ready | Export validated; ready for M6 integration testing | None |

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
| 2026-03-02 | Implement localStorage caching for data | DB Eng | Reduces repeat-visit load time from ~500ms to near-instant. Background refresh keeps data fresh. |
| 2026-03-02 | Add O(1) ID-based lookup maps | DB Eng | entriesById, peopleById, placesById eliminate O(n) find() calls in DetailPanel cross-references. |
| 2026-03-02 | Pre-compute parsed dates | DB Eng | parsedDates Map eliminates redundant parseDate() calls during every filter cycle. |
| 2026-03-02 | Paginate entry list (50 per page) | DB Eng | Prevents rendering 500+ cards in DOM at once; "Show More" button loads next batch. |

## Open Questions

- [ ] Which timeline visualization library to use: D3.js (flexible, complex) vs Vis-timeline (simpler, purpose-built)? — **Engineer to evaluate in M2**
- [ ] How should the AI narrator export format handle approximate dates (e.g., "~10000 BCE")? — **Engineer + Researcher to define in M2**
- [ ] Should the map view (P2 feature) use a historical map or modern satellite? — **Designer + Researcher to discuss in M1**

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
