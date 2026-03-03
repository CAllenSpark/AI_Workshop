# Team Coordination Board

## Current Sprint: Creative Layer Planning Sprint

| Agent | Status | Current Task | Blockers |
|-------|--------|-------------|----------|
| Product Manager | Active | PRD Creative Layer Addendum drafted (docs/planning/prd-creative-layer-addendum.md) | Awaiting team review |
| Engineer | Pending Review | Review data model changes (addendum Section 5), estimate M7-M11 effort | None |
| Database Engineer | Pending Review | Review search index updates for content_class facet, multi-setting perf | None |
| Researcher | Pending Review | Plan Seattle/Tacoma skeleton research (20-30 entries each) | None |
| Designer | Complete | Creative layer visual strategy drafted (docs/planning/designer-visual-strategy.md) — classification language, palette extension, timeline layering, people timeline, narrative dashboard, card evolution | Awaiting Engineer review for schema additions; UI/UX review for interaction patterns |
| Tester | Pending Review | Extend test plan with creative layer test cases | None |
| UI/UX | Pending Review | People timeline interaction design, view mode toggle placement | None |
| AI Narrator | Complete | Worldbuilding recommendations drafted (docs/planning/narrator-worldbuilding-recommendations.md) -- 9 sections covering provenance system, creative entry types, people timeline, multi-setting, narrative dashboard, export evolution | Awaiting Engineer review for schema changes; PM review for scope alignment |

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
| 2026-03-03 | Initiate Creative Layer planning sprint | PM | User vision: evolve from research tool to worldbuilding platform with fact/fiction distinction, people timeline, narrative dashboard, and multi-setting support. |
| 2026-03-03 | PRD Creative Layer Addendum drafted | PM | 13 user stories (5 P0, 4 P1, 4 P2), 5 milestones (M7-M11), 2 new personas. Addendum at docs/planning/prd-creative-layer-addendum.md. |
| 2026-03-03 | Creative layer visual strategy: "Different Pen" metaphor — violet/purple palette, dashed borders, diagonal texture, provenance badges (HIST/FICTION/HYBRID) | Designer | Violet family chosen for creative layer because it occupies the unused hue region relative to existing amber/teal/green/brown layers, carries cultural associations with imagination, and exists naturally in PNW twilight skies. All proposed colors pass WCAG AA at 4.5:1 against Parchment. |
| 2026-03-03 | People Timeline as separate tab view (not panel overlay) | Designer | Lifespan bars require full horizontal width for temporal legibility; cannot coexist with the main timeline in a stacked layout without severe vertical compression. Tab approach keeps both views at full resolution. |
| 2026-03-03 | Five-level provenance system for mixed history/fiction entries | AI Narrator | historical, historical-inferential, creative-grounded, creative-speculative, creative-fantastical. Binary classification insufficient -- narrator needs granular provenance to modulate confidence and framing. See docs/planning/narrator-worldbuilding-recommendations.md Section 1.2. |
| 2026-03-03 | Eight new creative entry types proposed | AI Narrator | narrative-arc, relationship, world-rule, artifact, legend, faction, scene, theme. Existing four types (event, person, place, environment) serve history but not story structure. See docs/planning/narrator-worldbuilding-recommendations.md Section 2.2. |
| 2026-03-03 | Multi-setting depth hierarchy: primary/secondary/tertiary | AI Narrator | Vashon=primary (full depth), Seattle+Tacoma=secondary (30-60 entries), Bainbridge+Puyallup+Olympia=tertiary (5-15 entries). Prevents scope creep while enabling cross-setting narration. See Section 4.2. |
| 2026-03-03 | Narrative Dashboard as third tab view alongside Timeline and People | Designer | Dashboard serves a fundamentally different task (story structure overview) than the timeline (temporal exploration). Embedding it in a panel would force too much compression. Three-tab navigation keeps each view focused on its purpose. |
| 2026-03-02 | Implement localStorage caching for data | DB Eng | Reduces repeat-visit load time from ~500ms to near-instant. Background refresh keeps data fresh. |
| 2026-03-02 | Add O(1) ID-based lookup maps | DB Eng | entriesById, peopleById, placesById eliminate O(n) find() calls in DetailPanel cross-references. |
| 2026-03-02 | Pre-compute parsed dates | DB Eng | parsedDates Map eliminates redundant parseDate() calls during every filter cycle. |
| 2026-03-02 | Paginate entry list (50 per page) | DB Eng | Prevents rendering 500+ cards in DOM at once; "Show More" button loads next batch. |

## Open Questions

- [ ] Which timeline visualization library to use: D3.js (flexible, complex) vs Vis-timeline (simpler, purpose-built)? — **Engineer to evaluate in M2**
- [ ] How should the AI narrator export format handle approximate dates (e.g., "~10000 BCE")? — **Engineer + Researcher to define in M2**
- [ ] Should the map view (P2 feature) use a historical map or modern satellite? — **Designer + Researcher to discuss in M1**
- [x] What visual treatment best distinguishes creative from historical entries on the timeline? — **Resolved by Designer (2026-03-03):** Four-signal system (border style, background tint, provenance badge, marker fill) detailed in docs/planning/designer-visual-strategy.md Section 2
- [ ] Should historical-inspired entries appear in both historical-only and creative-only views? — **PM, proposed: yes, they appear in both**
- [ ] How should the people timeline handle characters whose lifespans span multiple eras? — **UI/UX, to be resolved in M8**
- [ ] Should context settings (Seattle, Tacoma) support creative content, or only historical? — **PM, proposed: both, since characters travel between settings**
- [x] Should the narrative dashboard be a separate route or a panel within the main view? — **Resolved by Designer (2026-03-03):** Separate tab view (third tab: Timeline | People | Narrative Dashboard). Rationale: dashboard serves a different task than timeline; panel embedding would over-compress. See docs/planning/designer-visual-strategy.md Section 6
- [x] How does the AI narrator system prompt handle creative vs. historical content during gameplay? — **Resolved by AI Narrator (2026-03-03):** Mixed Reality Protocol and Cross-Boundary Narration Rules defined in docs/planning/narrator-worldbuilding-recommendations.md Section 6.7. Key principle: narrator modulates confidence based on provenance field; fictional characters may witness but not alter real events.
- [ ] Should the five-level provenance system be simplified to three levels (historical, creative-grounded, creative-fantastical) for the prototype? — **PM + AI Narrator to discuss**
- [ ] How should the narrator export handle multiple creative properties sharing the same historical base? Inline all, or separate export per property? — **Engineer + AI Narrator to resolve in M10**

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
- [x] PRD Creative Layer Addendum drafted — 13 user stories, 5 milestones (M7-M11), 2 new personas (2026-03-03)
- [x] Creative layer visual design strategy drafted — classification language, color palette extension, timeline layering, people timeline, narrative dashboard, card evolution, CSS tokens (2026-03-03)
- [x] AI Narrator worldbuilding recommendations drafted — 5-level provenance system, 8 new creative entry types, people timeline spec, multi-setting hierarchy, 7 dashboard views, export format v3 evolution plan, 5-phase implementation roadmap (2026-03-03)
