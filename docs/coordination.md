# Team Coordination Board

## Current Sprint: M0 — Foundation

| Agent | Status | Current Task | Blockers |
|-------|--------|-------------|----------|
| Product Manager | Active | PRD initial draft | None |
| Engineer | Active | FRD initial draft, JSON schema design | None |
| Researcher | Active | Vashon Island skeleton research (10-20 entries) | None |
| Designer | Active | Design Bible initial draft | None |
| Tester | Active | Test Plan initial draft | None |
| UI/UX | Active | Wireframes and user flow definitions | None |

## Decisions Log

| Date | Decision | Made By | Rationale |
|------|----------|---------|-----------|
| 2026-03-02 | Use JSON flat files as data layer (not SQLite) | PM + Eng | Simpler for prototype; portable, hand-editable, version-controlled. Can migrate to SQLite later if needed. |
| 2026-03-02 | Skeleton research seed (10-20 entries) for M0 | PM | Enough to validate schema and test UI; full research expansion in M1. |
| 2026-03-02 | Professional neutral voice for all agents | PM | Consistency and clarity over personality. |
| 2026-03-02 | Vashon Island, WA as prototype setting | PM | Rich history spanning 10,000+ years; well-documented; diverse eras and data types. |

## Open Questions

- [ ] Which timeline visualization library to use: D3.js (flexible, complex) vs Vis-timeline (simpler, purpose-built)? — **Engineer to evaluate in M2**
- [ ] How should the AI narrator export format handle approximate dates (e.g., "~10000 BCE")? — **Engineer + Researcher to define in M2**
- [ ] Should the map view (P2 feature) use a historical map or modern satellite? — **Designer + Researcher to discuss in M1**

## Completed Items

- [x] Project directory structure created (2026-03-02)
- [x] Team agent personas defined and configured (2026-03-02)
- [x] CLAUDE.md project configuration established (2026-03-02)
