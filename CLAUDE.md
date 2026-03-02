# Writer's Research Companion

## Project Overview

A minimal, elegant interface that consolidates historical and geographical research into a timeline-scrubable knowledge base. Writers and AI narrators can explore events, people, places, and environmental features across time for a given setting. The prototype uses **Vashon Island, WA** (prehistory to present).

The knowledge base is designed for dual use:
1. **Writers** researching settings for fiction, games, or interactive narratives
2. **AI hosts/narrators** that need accurate factual grounding to improvise within adventure games

## Team

This project uses 7 persistent agent personas. Invoke them by name to engage their expertise:

| Agent | Invoke | Owns | Primary Files |
|-------|--------|------|---------------|
| Product Manager | `/product-manager` | PRD, prioritization, user stories | `docs/PRD.md`, `docs/milestone-schedule.md` |
| Engineer | `/engineer` | FRD, architecture, data schemas | `docs/FRD.md`, `research/schemas/`, `src/` |
| Researcher | `/researcher` | Research content, fact-checking, sources | `research/vashon-island/*`, `research/README.md` |
| Designer | `/designer` | Visual design, information architecture | `docs/design-bible.md` |
| Tester | `/tester` | Test plan, QA strategy, acceptance criteria | `docs/test-plan.md` |
| UI/UX | `/ui-ux` | Interaction design, user flows, accessibility | `docs/design-bible.md` (interaction sections) |
| AI Narrator | `/ai-narrator` | Narrator export evaluation, adventure data requirements | `docs/narrator-guide.md`, `research/schemas/narrator-export.schema.json` |

All agents share access to `docs/coordination.md` (the team status board) and `docs/dashboard.md` (the project dashboard).

## Dashboard

The project dashboard at `docs/dashboard.md` provides a consolidated view of:
- Overall milestone progress with visual progress bars
- Team status across all 7 agents
- Research coverage metrics (entries per era, layer distribution)
- Document status and word counts
- Key decisions, open questions, and risk register
- Next steps for each agent

**Update the dashboard** whenever milestone status changes, documents are revised, or research data is added. Any agent can update their section.

## Coordination Protocol

1. When starting work, update your row in `docs/coordination.md` with status and current task
2. Log decisions in the Decisions Log table with date, rationale, and your agent role
3. Post blockers immediately — do not wait for the next status update
4. When your work affects another agent's files, note it in Open Questions and tag the relevant agent

## Conventions

### File Naming
- Lowercase with hyphens: `design-bible.md`, `timeline-entry.schema.json`
- Research data files use the setting name as the directory: `research/vashon-island/`

### Commit Messages
- Format: `[agent] brief description` (e.g., `[researcher] add pioneer era timeline entries`)
- Use present tense, imperative mood

### Document Formatting
- All docs use Markdown
- Tables for structured comparisons
- Headers follow a consistent hierarchy (H1 = document title, H2 = major sections, H3 = subsections)

### Research Standards
- Every factual claim requires at least one source citation
- Sources ranked: primary (archives, official records) > secondary (academic, museum) > tertiary (encyclopedias, general web)
- Timeline entries follow the JSON schema in `research/schemas/timeline-entry.schema.json`
- Dates use ISO 8601 where possible; era descriptors (e.g., "~10000 BCE") for approximate dates

## Tech Stack (Planned)

- **Frontend:** React + TypeScript
- **Timeline visualization:** D3.js or Vis-timeline
- **Data layer:** JSON flat files (portable, hand-editable, version-controlled)
- **Search:** Client-side full-text search (Fuse.js or Lunr.js)
- **Build:** Vite
- **Export:** Structured JSON for AI narrator integration

## Project Structure

```
AI_Workshop/
├── CLAUDE.md                    # This file
├── .claude/agents/              # Team agent personas
├── docs/                        # Project documents (PRD, FRD, design bible, etc.)
├── research/                    # Research data and schemas
│   ├── vashon-island/           # Prototype setting data
│   └── schemas/                 # JSON schemas for data validation
└── src/                         # Application source code (future)
```
