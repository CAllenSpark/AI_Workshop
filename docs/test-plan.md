# Test Plan: Writer's Research Companion

**Document Owner:** Tester
**Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Draft

---

## Table of Contents

1. [Testing Strategy Overview](#1-testing-strategy-overview)
2. [Test Categories](#2-test-categories)
3. [Acceptance Criteria](#3-acceptance-criteria)
4. [Quality Gates](#4-quality-gates)
5. [Bug Severity Classification](#5-bug-severity-classification)
6. [Test Data Requirements](#6-test-data-requirements)

---

## 1. Testing Strategy Overview

### Testing Pyramid

This project follows a standard testing pyramid, weighted toward fast, isolated tests at the base and fewer, broader tests at the top:

| Layer              | Tool / Framework     | Scope                                      | Approx. Share |
|--------------------|----------------------|---------------------------------------------|---------------|
| Unit               | Vitest               | Functions, utilities, individual components | 50%           |
| Integration        | Vitest               | Data pipelines, component interactions      | 25%           |
| E2E                | Playwright           | Full user flows in a real browser           | 15%           |
| Visual Regression  | Storybook + Chromatic| Timeline rendering, layout consistency      | 10%           |

### Tool Rationale

- **Vitest** is selected for unit and integration tests due to native TypeScript support, Vite-aligned configuration, and fast watch-mode feedback during development.
- **Playwright** handles end-to-end tests across Chromium, Firefox, and WebKit, providing cross-browser confidence for timeline interactions.
- **Storybook** serves as the visual regression environment, rendering components in isolation. Chromatic (or Percy) captures snapshots and diffs against baselines.

### Data Validation

- **JSON schema validation:** All timeline entries are validated against `research/schemas/timeline-entry.schema.json` using Ajv at both build time and in CI.
- **Cross-reference consistency:** A custom validation script checks that every person, place, or event referenced by another entry has a corresponding entry of its own, and that all such references are bidirectional.

### Accessibility

- **Automated:** axe-core integrated into both Vitest (via `vitest-axe`) and Playwright (via `@axe-core/playwright`) to catch violations during unit, integration, and E2E test runs.
- **Manual:** Screen reader testing with VoiceOver (macOS) and NVDA (Windows) is performed before each milestone review. Results are logged in a dedicated accessibility audit checklist.

---

## 2. Test Categories

### 2.1 Data Validation Tests

These tests run against the JSON flat files in `research/vashon-island/` and any other future setting directories.

| ID      | Test Case                                              | Expected Result                                                      |
|---------|--------------------------------------------------------|----------------------------------------------------------------------|
| DV-001  | Every timeline entry conforms to the JSON schema       | Ajv validation returns zero errors for each entry file               |
| DV-002  | All `sourceUrl` fields are valid URL format            | Every URL matches RFC 3986; no empty strings or placeholder values   |
| DV-003  | Cross-references between people, places, and events are bidirectional | If entry A references entry B, entry B also references entry A |
| DV-004  | Date ordering is consistent (`startDate` <= `endDate`) | No entry has a `startDate` that falls after its `endDate`            |
| DV-005  | No orphaned references                                 | Every ID referenced in `relatedEntries` exists in the dataset        |
| DV-006  | Era classifications are consistent with dates          | Each entry's `era` value matches the era boundaries defined in the schema for its date range |
| DV-007  | Required fields are non-empty                          | `title`, `description`, `era`, and `layers` are present and non-empty on every entry |
| DV-008  | Entry IDs are globally unique                          | No two entries share the same `id` value across all data files       |

### 2.2 Unit Tests

Unit tests cover individual functions, utilities, and component rendering in isolation.

#### Timeline Engine

| ID      | Test Case                            | Input                                    | Expected Result                                      |
|---------|--------------------------------------|------------------------------------------|------------------------------------------------------|
| UT-T001 | Era calculation from date            | ISO date string `"1890-06-15"`           | Returns `"pioneer"` era                              |
| UT-T002 | Era calculation for approximate date | Era descriptor `"~10000 BCE"`            | Returns `"prehistoric"` era                          |
| UT-T003 | Zoom level math                      | Zoom factor + viewport width             | Correct pixel-per-year ratio and visible date range  |
| UT-T004 | Date parsing (ISO 8601)              | `"1943-03-22"`                           | Valid `Date` object with correct year, month, day    |
| UT-T005 | Date parsing (approximate)           | `"~500 BCE"`                             | Parsed to numeric representation with approximate flag |
| UT-T006 | Visible range computation            | Scroll position + zoom level             | Correct start and end dates for the visible window   |

#### Search Engine

| ID      | Test Case                              | Input                                  | Expected Result                                      |
|---------|----------------------------------------|----------------------------------------|------------------------------------------------------|
| UT-S001 | Basic query parsing                    | `"Vashon ferry"`                       | Tokenized into `["vashon", "ferry"]`                 |
| UT-S002 | Relevance scoring ranks exact match highest | Query `"Mukai"`, entries with exact and partial matches | Exact title match scores above partial description match |
| UT-S003 | Filter combination (layer + era)       | Layer: `"people"`, Era: `"pioneer"`    | Only entries matching both filters returned           |
| UT-S004 | Empty query returns all entries        | `""`                                   | Full entry set returned, unfiltered                  |
| UT-S005 | Special characters handled gracefully  | `"K'Pah (historical)"`                 | No errors; results returned or empty set             |

#### Data Loader

| ID      | Test Case                          | Input                                  | Expected Result                                        |
|---------|------------------------------------|----------------------------------------|--------------------------------------------------------|
| UT-D001 | Valid JSON parsed correctly        | Well-formed JSON file                  | Returns structured entry objects                       |
| UT-D002 | Schema validation rejects invalid data | JSON with missing required field    | Throws or returns validation error listing the field   |
| UT-D003 | Graceful error on malformed JSON   | Truncated or syntactically broken file | Returns descriptive error, does not crash              |
| UT-D004 | Empty dataset handled              | Empty JSON array `[]`                  | Returns empty array, UI shows "no entries" state       |

#### Component Rendering

| ID      | Test Case                          | Props / State                          | Expected Result                                        |
|---------|------------------------------------|----------------------------------------|--------------------------------------------------------|
| UT-C001 | Entry card renders all fields      | Complete entry object                  | Title, date, description, layer badge all visible      |
| UT-C002 | Timeline marker positioned correctly | Entry with known date + zoom level   | Marker's x-position matches expected pixel offset      |
| UT-C003 | Filter chip toggles active state   | Click event on chip                    | CSS class and aria-pressed reflect toggled state       |
| UT-C004 | Entry card with missing optional fields | Entry without `endDate` or `imageUrl` | Renders without errors; optional sections omitted  |

### 2.3 Integration Tests

Integration tests verify that multiple modules work together correctly across the data pipeline and UI interaction chain.

| ID      | Test Case                                    | Setup                                      | Expected Result                                        |
|---------|----------------------------------------------|--------------------------------------------|--------------------------------------------------------|
| IT-001  | Data load -> search -> filter pipeline       | Load fixture data, execute search, apply filter | Filtered results match expected subset               |
| IT-002  | Timeline scrub -> entry display sync         | Scrub timeline to specific date range      | Detail panel shows only entries within visible range   |
| IT-003  | Layer toggle -> entry visibility             | Toggle off "people" layer                  | People entries hidden from timeline and search results |
| IT-004  | Export generation -> schema validation       | Trigger export of current filtered view    | Output JSON validates against export schema            |
| IT-005  | Search results -> timeline highlight         | Search for a term with known results       | Matching markers highlighted on timeline               |
| IT-006  | Multiple filters applied sequentially        | Apply era filter, then layer filter        | Result set is the intersection of both filters         |
| IT-007  | Data load with network error simulation      | Mock fetch failure                         | Error state displayed, no crash                        |

### 2.4 E2E Tests

End-to-end tests simulate real user interactions in a browser via Playwright.

| ID      | Test Case                                        | Steps                                                                                          | Expected Result                                        |
|---------|--------------------------------------------------|------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| E2E-001 | Full exploration flow                            | 1. Load app 2. Scrub timeline to 1900s 3. Click an entry marker 4. Read detail panel          | Detail panel shows correct entry with all fields       |
| E2E-002 | Search flow                                      | 1. Type query in search box 2. Wait for results 3. Click first result                         | Detail panel opens with the selected entry             |
| E2E-003 | Filter flow                                      | 1. Toggle "geology" layer off 2. Apply date range 1850-1950 3. Verify visible entries         | Only entries matching active layers and date range shown |
| E2E-004 | Export flow                                      | 1. Apply filters 2. Click export button 3. Validate downloaded file                           | Downloaded JSON validates against export schema        |
| E2E-005 | Empty state handling                             | 1. Apply filters that match zero entries                                                       | "No results" message displayed; no console errors      |
| E2E-006 | Deep link / URL state                            | 1. Navigate to URL with query params for era and layer                                         | App initializes with the specified filters applied     |
| E2E-007 | Browser back/forward navigation                  | 1. Perform search 2. Click result 3. Press back 4. Press forward                              | State restores correctly at each navigation step       |

### 2.5 Accessibility Tests

Accessibility tests ensure the application meets WCAG 2.1 AA standards.

#### Automated (axe-core)

| ID      | Test Case                                    | Method                                   | Expected Result                                       |
|---------|----------------------------------------------|------------------------------------------|-------------------------------------------------------|
| A11Y-001| Keyboard navigation through all interactive elements | Tab through entire page              | Every interactive element reachable; no keyboard traps |
| A11Y-002| Screen reader content accessibility          | Render each view, inspect accessible tree | All content exposed to assistive technology            |
| A11Y-003| Color contrast for normal text               | axe-core contrast audit                  | All normal text meets 4.5:1 ratio                     |
| A11Y-004| Color contrast for large text                | axe-core contrast audit                  | All large text meets 3:1 ratio                        |
| A11Y-005| Focus indicators visible                     | Tab through elements, inspect styles     | Every focusable element has a visible focus ring       |
| A11Y-006| Logical tab order                            | Tab through page sections                | Focus moves in a predictable, meaningful sequence      |

#### ARIA and Dynamic Content

| ID      | Test Case                                    | Method                                   | Expected Result                                       |
|---------|----------------------------------------------|------------------------------------------|-------------------------------------------------------|
| A11Y-007| ARIA roles on interactive widgets            | Inspect timeline, search, filters        | Correct `role` attributes on all custom widgets        |
| A11Y-008| ARIA labels on controls                      | Inspect all buttons, inputs, toggles     | Every control has an accessible name via `aria-label` or associated `<label>` |
| A11Y-009| Live regions for dynamic content             | Trigger search, apply filter             | `aria-live` region announces updated result count      |
| A11Y-010| Timeline scrubber accessible                 | Use keyboard to operate scrubber         | `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext` |

#### Manual Screen Reader Testing

| ID      | Test Case                                    | Tools                                    | Expected Result                                       |
|---------|----------------------------------------------|------------------------------------------|-------------------------------------------------------|
| A11Y-011| Full app navigation with VoiceOver           | VoiceOver on macOS + Safari              | All content announced correctly; no unlabeled elements |
| A11Y-012| Full app navigation with NVDA                | NVDA on Windows + Firefox                | All content announced correctly; no unlabeled elements |
| A11Y-013| Timeline interaction with screen reader      | VoiceOver or NVDA                        | Current era and visible entries announced on scrub     |

---

## 3. Acceptance Criteria

Acceptance criteria follow the Given-When-Then format for each key user story.

### Story: As a writer, I can scrub the timeline to explore different eras

| Criterion | Given                                          | When                                         | Then                                                      |
|-----------|-------------------------------------------------|----------------------------------------------|-----------------------------------------------------------|
| AC-TL-01  | The app is loaded with the Vashon Island dataset | The user drags the timeline scrubber to the 1890s | The visible entries update to show only pioneer-era entries |
| AC-TL-02  | The timeline is displaying the 1890s            | The user zooms in on the timeline            | The date resolution increases and more granular entries become visible |
| AC-TL-03  | The timeline is displaying the 1890s            | The user clicks a timeline marker            | A detail panel opens showing the full entry with title, description, dates, sources, and related entries |
| AC-TL-04  | The detail panel is open                        | The user scrubs the timeline to a different era | The detail panel closes or updates, and entries reflect the new date range |

### Story: As a writer, I can search for a historical person and see their timeline entries

| Criterion | Given                                          | When                                         | Then                                                      |
|-----------|-------------------------------------------------|----------------------------------------------|-----------------------------------------------------------|
| AC-SR-01  | The app is loaded with the Vashon Island dataset | The user types "Mukai" into the search box   | A results list appears showing all entries mentioning Mukai, ranked by relevance |
| AC-SR-02  | Search results are displayed                    | The user clicks a result                     | The detail panel opens and the timeline scrolls to center on the selected entry's date |
| AC-SR-03  | Search results are displayed                    | The user clears the search box               | The results list disappears and the timeline returns to its previous state |
| AC-SR-04  | The app is loaded                               | The user searches for a term with no matches | A "No results found" message is displayed; no errors occur |

### Story: As a game designer, I can export the knowledge base as JSON for my AI narrator

| Criterion | Given                                          | When                                         | Then                                                      |
|-----------|-------------------------------------------------|----------------------------------------------|-----------------------------------------------------------|
| AC-EX-01  | The app is loaded with entries visible          | The user clicks the export button            | A JSON file is downloaded containing all currently visible entries |
| AC-EX-02  | Filters are applied (era + layer)               | The user clicks the export button            | The exported JSON contains only the filtered subset of entries |
| AC-EX-03  | An export file has been downloaded              | The file is validated against the export schema | The file passes validation with zero errors             |
| AC-EX-04  | The exported JSON is loaded by an external tool | The external tool parses the file            | All entries, cross-references, and source citations are intact and correctly structured |

### Story: As a user, I can toggle data layers to focus on specific categories

| Criterion | Given                                          | When                                         | Then                                                      |
|-----------|-------------------------------------------------|----------------------------------------------|-----------------------------------------------------------|
| AC-LY-01  | The app is loaded with all layers active        | The user toggles off the "people" layer      | All people entries are hidden from the timeline and any visible search results |
| AC-LY-02  | The "people" layer is toggled off               | The user toggles it back on                  | People entries reappear in their correct positions on the timeline |
| AC-LY-03  | Multiple layers are toggled off                 | The user searches for a term                 | Search results only include entries from active layers    |
| AC-LY-04  | Only one layer is active                        | The user exports the dataset                 | The export contains only entries from the active layer    |

---

## 4. Quality Gates

Each milestone has a defined set of quality gates. A milestone is not considered complete until all of its gates are satisfied.

### M0 -- Foundation

| Gate     | Requirement                                                  | Verification Method                  |
|----------|--------------------------------------------------------------|--------------------------------------|
| M0-QG-01 | `timeline-entry.schema.json` exists and is valid JSON Schema | JSON Schema meta-validation          |
| M0-QG-02 | All seed JSON data files validate against the schema         | `ajv validate` in CI                 |
| M0-QG-03 | Project scaffolding builds without errors                    | `npm run build` exits with code 0    |

### M1 -- Research

| Gate     | Requirement                                                  | Verification Method                  |
|----------|--------------------------------------------------------------|--------------------------------------|
| M1-QG-01 | 100% of timeline entries have at least one source citation   | Custom validation script             |
| M1-QG-02 | All `sourceUrl` values are valid URL format                  | URL format regex check in CI         |
| M1-QG-03 | Source quality: at least 50% of citations are primary or secondary | Manual audit logged in test report |

### M2 -- Data Model

| Gate     | Requirement                                                  | Verification Method                  |
|----------|--------------------------------------------------------------|--------------------------------------|
| M2-QG-01 | Schema validation passes for all entries (DV-001)            | Ajv validation in CI                 |
| M2-QG-02 | No orphaned references (DV-005)                              | Cross-reference validation script    |
| M2-QG-03 | Bidirectional cross-references verified (DV-003)             | Cross-reference validation script    |
| M2-QG-04 | Date consistency validated (DV-004)                          | Date ordering check in CI            |

### M3 -- Core UI

| Gate     | Requirement                                                  | Verification Method                  |
|----------|--------------------------------------------------------------|--------------------------------------|
| M3-QG-01 | All unit tests pass (UT-* suite)                             | `vitest run` exits with code 0       |
| M3-QG-02 | Basic E2E smoke test passes (E2E-001)                        | `playwright test smoke.spec.ts`      |
| M3-QG-03 | No critical or high accessibility violations                 | axe-core audit in E2E smoke test     |
| M3-QG-04 | Timeline renders entries at correct positions                | Visual regression baseline captured  |

### M4 -- Search and Filter

| Gate     | Requirement                                                  | Verification Method                  |
|----------|--------------------------------------------------------------|--------------------------------------|
| M4-QG-01 | Search returns results in under 100ms for dataset of 50+ entries | Performance assertion in integration test |
| M4-QG-02 | All filter combinations produce correct results (IT-006)     | Integration test matrix              |
| M4-QG-03 | Search + filter E2E flows pass (E2E-002, E2E-003)           | Playwright test suite                |
| M4-QG-04 | Empty state handled gracefully (E2E-005)                     | Playwright test                      |

### M5 -- Polish and Export

| Gate     | Requirement                                                  | Verification Method                  |
|----------|--------------------------------------------------------------|--------------------------------------|
| M5-QG-01 | Export output validates against export schema (IT-004)        | Schema validation in integration test|
| M5-QG-02 | Export E2E flow passes (E2E-004)                             | Playwright test                      |
| M5-QG-03 | Accessibility audit passes with zero violations              | axe-core full audit + manual review  |
| M5-QG-04 | Visual regression: no unintended diffs from M3 baseline      | Storybook snapshot comparison        |

### M6 -- Validation

| Gate     | Requirement                                                  | Verification Method                  |
|----------|--------------------------------------------------------------|--------------------------------------|
| M6-QG-01 | All test categories green (DV, UT, IT, E2E, A11Y)           | Full CI pipeline pass                |
| M6-QG-02 | Zero critical bugs open                                      | Bug tracker query                    |
| M6-QG-03 | Zero high-severity bugs open                                 | Bug tracker query                    |
| M6-QG-04 | Manual screen reader testing completed and documented (A11Y-011, A11Y-012) | Signed-off audit report  |
| M6-QG-05 | Performance: initial load under 3 seconds on 3G throttle     | Lighthouse audit in CI               |

---

## 5. Bug Severity Classification

| Severity | Definition                                                              | Examples                                                                 | Response Time  |
|----------|-------------------------------------------------------------------------|--------------------------------------------------------------------------|----------------|
| Critical | Application crashes, data loss, or incorrect historical data displayed  | App fails to load; entry shows wrong date; export produces corrupt file  | Fix immediately; blocks release |
| High     | Feature is broken, accessibility violation, or export corruption         | Search returns no results for valid query; keyboard trap in timeline; export missing entries | Fix before milestone completion |
| Medium   | Visual glitch, slow performance, or minor search inaccuracy             | Timeline marker slightly misaligned; search takes >200ms; filter chip style broken on Firefox | Fix before next milestone |
| Low      | Cosmetic issue, non-critical edge case, or polish item                  | Tooltip text slightly truncated; hover state inconsistent; extra whitespace in export | Fix when convenient |

### Severity Assignment Guidelines

- When in doubt, assign the higher severity level.
- Any bug involving incorrect historical data is always Critical, as the product's core value depends on factual accuracy.
- Any WCAG AA violation is at minimum High severity.
- Performance issues are Medium unless they render a feature unusable (then High).

---

## 6. Test Data Requirements

### Minimum Dataset

The test fixture dataset must include at least the following:

| Requirement                          | Minimum Count | Purpose                                           |
|--------------------------------------|---------------|---------------------------------------------------|
| Total entries                        | 20            | Sufficient to test search relevance and filtering |
| Distinct eras represented            | All defined   | Verify era calculation and timeline range         |
| Distinct layer types represented     | All defined   | Verify layer toggles work for every category      |
| Entries with cross-references        | 8             | Verify bidirectional reference validation         |
| Entries with multiple source citations | 5           | Verify source rendering and citation display      |

### Required Edge Case Fixtures

| Fixture                              | Description                                                             | Tests Covered          |
|--------------------------------------|-------------------------------------------------------------------------|------------------------|
| Entry with no `endDate`              | Represents an ongoing condition or a point-in-time event                | UT-C004, DV-004        |
| Entry spanning multiple eras         | `startDate` in one era, `endDate` in another                            | UT-T001, DV-006        |
| Entry with many cross-references     | 5+ related entries                                                      | DV-003, DV-005         |
| Entry with approximate date          | Uses `"~10000 BCE"` style date descriptor                               | UT-T002, UT-T005       |
| Entry with minimal fields            | Only required fields populated, all optional fields absent              | UT-C004, UT-D001       |
| Entry with special characters        | Unicode, apostrophes, parentheses in title and description              | UT-S005                |
| Malformed JSON file                  | Deliberately broken syntax for error-handling tests                     | UT-D003                |
| Empty dataset                        | Valid JSON array with zero entries                                       | UT-D004, E2E-005       |

### Fixture Management

- Test fixtures are stored in `src/__fixtures__/` (or `tests/fixtures/` if outside the source tree).
- Fixtures are version-controlled and reviewed alongside test changes.
- Each fixture file includes a comment header documenting its purpose and the tests that depend on it.
- Fixtures must not duplicate production data; they should be synthetic but structurally representative.

---

## Appendix: Test Execution Summary Template

Use this template to record results after each test run.

| Category           | Total | Passed | Failed | Skipped | Notes |
|--------------------|-------|--------|--------|---------|-------|
| Data Validation    |       |        |        |         |       |
| Unit Tests         |       |        |        |         |       |
| Integration Tests  |       |        |        |         |       |
| E2E Tests          |       |        |        |         |       |
| Accessibility      |       |        |        |         |       |
| Visual Regression  |       |        |        |         |       |
| **Total**          |       |        |        |         |       |

**Run Date:**
**Run By:**
**Environment:**
**Blocking Issues:**
