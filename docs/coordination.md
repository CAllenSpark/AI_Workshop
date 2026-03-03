# Team Coordination Board

## Current Sprint: Post-M7 — Planning M8 Creative UI

| Agent | Status | Current Task | Blockers |
|-------|--------|-------------|----------|
| Product Manager | Active | PRD Addendum + M7 code merged; scoping M8 Creative UI | None |
| Engineer | Complete | M7 schemas v2, types, loader, AddEntryDialog, tests — all implemented | None |
| Database Engineer | Complete | entriesByScope/entriesByType indexes, cache v3 | None |
| Researcher | Queued | Regional research sprint (Seattle, Tacoma) — awaiting M9 | None |
| Designer | Complete | Visual strategy (docs/planning/designer-visual-strategy.md) + Design Bible v2 | None |
| Tester | Complete | 142 tests (up from 122), 10 fantasy tests, all green | None |
| UI/UX | Pending | People timeline interaction design, view mode toggle placement | None |
| AI Narrator | Complete | Worldbuilding recommendations (docs/planning/narrator-worldbuilding-recommendations.md) | None |

## Decisions Log

| Date | Decision | Made By | Rationale |
|------|----------|---------|-----------|
| 2026-03-02 | Use JSON flat files as data layer (not SQLite) | PM + Eng | Simpler for prototype; portable, hand-editable, version-controlled. Can migrate to SQLite later if needed. |
| 2026-03-02 | Skeleton research seed (10-20 entries) for M0 | PM | Enough to validate schema and test UI; full research expansion in M1. |
| 2026-03-02 | Professional neutral voice for all agents | PM | Consistency and clarity over personality. |
| 2026-03-02 | Vashon Island, WA as prototype setting | PM | Rich history spanning 10,000+ years; well-documented; diverse eras and data types. |
| 2026-03-02 | Camp Sealth associated with Camp Fire (not YMCA/YWCA) | Researcher | Web research confirmed Camp Sealth was founded by Camp Fire Girls. |
| 2026-03-02 | Darken warm-amber, teal, stone for WCAG AA | Eng + Designer | Color contrast audit found 5 failures; darkened to meet 4.5:1. |
| 2026-03-02 | Add Database Engineer agent to team | PM + Eng | Data layer needs dedicated optimization ownership. |
| 2026-03-03 | Initiate Creative Layer planning sprint | PM | User vision: worldbuilding platform with fact/fiction distinction, people timeline, narrative dashboard, multi-setting. |
| 2026-03-03 | 3-level classification: historical / fantasy / speculative | User + PM | User chose 3 levels over Narrator's proposed 5. Implemented as `entry_type` field in M7 schemas. |
| 2026-03-03 | PRD Creative Layer Addendum drafted | PM | 13 user stories (5 P0, 4 P1, 4 P2), 5 milestones (M7-M11), 2 new personas. |
| 2026-03-03 | Creative layer visual strategy: "Different Pen" metaphor | Designer | Violet/purple palette, dashed borders, diagonal texture, provenance badges. Four-signal system for accessibility. |
| 2026-03-03 | People Timeline as separate tab view (not panel overlay) | Designer | Lifespan bars need full width; three-tab nav: Timeline / People / Narrative Dashboard. |
| 2026-03-03 | Narrative Dashboard as third tab view | Designer | Separate task from timeline exploration; panel embedding would over-compress. |
| 2026-03-03 | Multi-setting depth hierarchy: primary/secondary/tertiary | AI Narrator | Vashon=primary, Seattle+Tacoma=secondary (30-60 entries), others=tertiary (5-15). Prevents scope creep. |
| 2026-03-03 | Fantasy palette uses purple/violet family (Amethyst #7B4BAA) | Designer | Purple occupies distinct color-wheel region; cultural association with imagination; WCAG AA compliant. |
| 2026-03-03 | Fantasy entries hidden by default, opt-in via master toggle | Designer | Historical accuracy is primary; fantasy must not contaminate researcher's view. |
| 2026-03-03 | Fantasy visual vocabulary: diamond shapes, dashed borders, striped indicators | Designer | Four-signal system ensures no single signal bears full distinction responsibility. |
| 2026-03-02 | Implement localStorage caching for data | DB Eng | Reduces repeat-visit load time from ~500ms to near-instant. |
| 2026-03-02 | Add O(1) ID-based lookup maps | DB Eng | Eliminates O(n) find() calls in DetailPanel. |
| 2026-03-02 | Pre-compute parsed dates | DB Eng | Eliminates redundant parseDate() calls during filter cycles. |
| 2026-03-02 | Paginate entry list (50 per page) | DB Eng | Prevents rendering 500+ cards in DOM at once. |

## Open Questions

- [ ] Which timeline visualization library to use: D3.js vs Vis-timeline? — **Engineer to evaluate**
- [ ] Should the map view use a historical map or modern satellite? — **Designer + Researcher**
- [x] What visual treatment best distinguishes creative from historical entries? — **Resolved: four-signal system (border, tint, badge, marker fill)**
- [x] Should the narrative dashboard be a separate route or panel? — **Resolved: separate tab view**
- [x] How does the AI narrator system prompt handle creative vs. historical? — **Resolved: Mixed Reality Protocol**
- [x] Fantasy entry data model fields — **Resolved: M7 implemented entry_type, scope, universe_id, narrative**
- [ ] Should historical-inspired entries appear in both historical-only and creative-only views? — **PM, proposed: yes**
- [ ] How should the people timeline handle characters spanning multiple eras? — **UI/UX, M8**
- [ ] Should context settings (Seattle, Tacoma) support creative content? — **PM, proposed: yes**
- [ ] How should the narrator export handle multiple creative properties? — **Engineer + Narrator, M10**
- [ ] Regional context data sources for Seattle/Tacoma — **Researcher to scope in M9**

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
- [x] Growth & Industry era expanded: 10 new entries (2026-03-02)
- [x] Early 20th Century era expanded: 11 new entries (2026-03-02)
- [x] Exploration era expanded: 5 new entries (2026-03-02)
- [x] Logging & Treaty era expanded: 4 new entries (2026-03-02)
- [x] Pioneer era expanded: 11 new entries (2026-03-02)
- [x] Sources.md expanded to 137 entries (2026-03-02)
- [x] **M1 Research milestone complete** (2026-03-02)
- [x] **M2 Data Model milestone complete** (2026-03-02)
- [x] **M3 Core UI milestone complete** (2026-03-02)
- [x] **M4 Search & Filter milestone complete** (2026-03-02)
- [x] ExportDialog, KeyboardHelp, accessibility, WCAG AA fixes (2026-03-02)
- [x] **M5 Polish & Export milestone complete** (2026-03-02)
- [x] Database Engineer agent + hardening sprint (2026-03-02)
- [x] **M6 Validation milestone complete** (2026-03-02) — 122 tests, all green
- [x] Research enrichment: +18 entries, +28 people, 4 entries enriched, env cross-refs fixed (2026-03-02)
- [x] PRD Creative Layer Addendum drafted — 13 user stories, 5 milestones, 2 new personas (2026-03-03)
- [x] Creative layer visual design strategy drafted — violet palette, four-signal classification, people timeline, narrative dashboard (2026-03-03)
- [x] AI Narrator worldbuilding recommendations drafted — creative entry types, export v3, Mixed Reality Protocol (2026-03-03)
- [x] Engineer schema evolution plan drafted — additive architecture, migration strategy (2026-03-03)
- [x] Data integrity fixes: 46 validation warnings -> 0 (2026-03-03)
- [x] Fantasy expansion proposal drafted: `docs/fantasy-expansion-proposal.md` (2026-03-03)
- [x] **M7 Fantasy Data Model milestone complete** (2026-03-03)
  - Schemas v2: timeline-entry, person, place (entry_type, scope, universe_id, narrative)
  - Universe schema (new)
  - TypeScript types: EntryType, ScopeKey, NarrativeBeat, AnchorRelationship, Universe
  - Data loader: backward-compatible defaults, fantasy validation, new indexes
  - AddEntryDialog: entry type selector, scope dropdown, universe field, fantasy colors
  - 142 tests (up from 122), all green. TypeScript clean.
- [x] Parallel branch `claude/add-fantasy-dates-iTNHa` merged into main branch (2026-03-03)
