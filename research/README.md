# Research Directory

## Purpose

This directory contains all research data for the Writer's Research Companion project. Each setting (location/topic) gets its own subdirectory with structured data files.

## Methodology

### Source Hierarchy

Sources are ranked by reliability:

1. **Primary** — Original documents, archives, official records, first-hand accounts
2. **Secondary** — Academic publications, museum materials, curated historical databases
3. **Tertiary** — Encyclopedias, general reference websites, aggregated content

### Data Standards

- Every factual claim must have at least one source citation
- Timeline entries follow the JSON schema in `schemas/timeline-entry.schema.json`
- Dates use ISO 8601 where possible (e.g., `1792-05-28`)
- Approximate dates use era descriptors with tilde (e.g., `~10000 BCE`)
- Uncertain or disputed facts must be flagged with `[disputed]` or `[uncertain]` tags

### File Organization

Each setting directory contains:

| File | Format | Purpose |
|------|--------|---------|
| `timeline.json` | JSON | Machine-readable timeline entries (follows schema) |
| `timeline.md` | Markdown | Human-readable narrative timeline |
| `people.md` | Markdown | Key personalities and biographical summaries |
| `places.md` | Markdown | Locations, landmarks, and geographical features |
| `environment.md` | Markdown | Geography, ecology, climate, and natural history |
| `events.md` | Markdown | Detailed event descriptions and context |
| `sources.md` | Markdown | Complete bibliography with source rankings |

### Cross-Referencing

- People, places, and events are cross-referenced by name within timeline entries
- The `people`, `places`, and `tags` arrays in timeline entries enable programmatic linking
- Markdown files use inline links to reference related entries

## Current Settings

### Vashon Island, WA (`vashon-island/`)

Prototype setting covering 10,000+ years of history in the Central Puget Sound Basin. Rich historical record with diverse eras spanning indigenous habitation, European exploration, pioneer settlement, industrial growth, and modern preservation.
