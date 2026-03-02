# Product Requirements Document: Writer's Research Companion

**Version:** 1.0
**Date:** 2026-03-02
**Status:** Draft
**Prototype Setting:** Vashon Island, WA (prehistory to present)

---

## Table of Contents

1. [Vision & Problem Statement](#1-vision--problem-statement)
2. [Target Users](#2-target-users)
3. [User Personas](#3-user-personas)
4. [Core Features](#4-core-features)
5. [User Stories](#5-user-stories)
6. [Success Metrics](#6-success-metrics)
7. [Out of Scope](#7-out-of-scope-for-prototype)
8. [Dependencies & Assumptions](#8-dependencies--assumptions)

---

## 1. Vision & Problem Statement

### Vision

The Writer's Research Companion is a minimal, elegant interface that consolidates historical and geographical research into a timeline-scrubable knowledge base. Writers and AI narrators can explore events, people, places, and environmental features across time for a given setting. The prototype focuses on Vashon Island, WA, spanning from prehistory to the present day.

The knowledge base serves a dual purpose:

1. **Writers** researching settings for fiction, games, or interactive narratives who need accurate, temporally organized information about a specific place.
2. **AI hosts and narrators** that require factual grounding to improvise accurately within adventure games and interactive experiences.

### Problem Statement

Writers and AI narrator systems currently lack a unified, temporal knowledge base for specific geographic settings. The problems they face include:

- **Fragmented research sources.** Historical, geographical, and cultural information about a specific place is scattered across books, articles, archives, government records, and websites. No single tool assembles these into a coherent, browsable resource.
- **No temporal navigation.** Existing reference materials are organized topically or alphabetically, not chronologically. A writer who needs to understand what Vashon Island looked like in 1890 must piece together that picture from dozens of disconnected sources.
- **No layered contextual data.** Writers need to see multiple dimensions of a setting simultaneously: what events were occurring, who lived there, what the environment looked like, and what infrastructure existed, all at the same point in time. No current tool provides this layered view.
- **AI narrators lack structured grounding.** AI systems used as game hosts or interactive narrators need structured, exportable data to improvise accurately. Unstructured prose sources are difficult for these systems to consume reliably.

---

## 2. Target Users

### Primary Audience

- **Fiction writers.** Authors of literary fiction, historical fiction, speculative fiction, and genre fiction who set stories in real places and need accurate details about those places across time periods.
- **Game designers.** Designers building interactive, adventure, or role-playing experiences who need rich setting data to construct believable worlds grounded in real history and geography.
- **AI narrator and host systems.** Software systems that serve as game masters, tour guides, or interactive storytellers and require structured factual data to generate accurate, contextually appropriate responses.

### Secondary Audience

- **Historians and educators.** Researchers and teachers who could benefit from an accessible, browsable timeline of local history, though they are not the primary design target for the prototype.

---

## 3. User Personas

### Persona 1: Clara, the Historical Fiction Writer

- **Age:** 42
- **Occupation:** Freelance novelist
- **Technical comfort:** Moderate; comfortable with web applications and basic research databases
- **Context:** Clara is writing a novel set on Vashon Island during the 1920s and 1930s. Her story follows a family of strawberry farmers and intersects with the island's Japanese-American community before internment. She needs to understand what the island looked like physically, what businesses existed, who the prominent figures were, and what daily life entailed during that specific window.
- **Pain points:** Clara has spent weeks assembling research from the Vashon Heritage Museum archives, county records, and scattered online articles. She has no way to see all of this information organized by time period. She frequently discovers contradictions between sources and has no easy way to cross-reference them.
- **Goal:** Browse a timeline set to the 1920s-1930s and see layered data about events, people, places, and environment for that period, with source citations she can verify.

### Persona 2: Marcus, the Adventure Game Designer

- **Age:** 34
- **Occupation:** Independent game developer
- **Technical comfort:** High; comfortable with JSON, APIs, and data pipelines
- **Context:** Marcus is building a time-travel adventure game set on Vashon Island. The player can jump between eras, from the pre-contact indigenous period through the present day, and interact with historically grounded characters and locations. He needs comprehensive setting data across all time periods, exportable in a format his game engine can consume.
- **Pain points:** Marcus needs structured data, not prose. He has tried scraping Wikipedia and local history sites, but the results are inconsistent and poorly organized. He needs reliable, structured entries he can feed into his game's narrative engine.
- **Goal:** Export the full knowledge base as structured JSON, filtered by era, so his game engine can populate scenes with accurate historical details, characters, and environmental descriptions.

### Persona 3: The Narrator (AI Host System)

- **Age:** N/A (software system)
- **Occupation:** AI game master for an interactive adventure experience
- **Technical comfort:** Consumes structured data via JSON; no graphical interface needed
- **Context:** The Narrator is an AI system that hosts a live, interactive adventure game set on Vashon Island. Players make choices, and the Narrator must improvise responses that are historically and geographically accurate for whatever time period the player is currently exploring. When a player asks "What can I see from this hilltop in 1905?", the Narrator needs factual grounding to answer.
- **Pain points:** Without structured setting data, the Narrator hallucinates details, inventing buildings that did not exist, placing people in the wrong era, or describing landscapes inaccurately. It needs a reliable, queryable knowledge base to constrain its improvisation.
- **Goal:** Query the knowledge base by time period and data layer to retrieve accurate facts that anchor its generated responses in reality.

---

## 4. Core Features

### P0 — Must Have

These features define the minimum viable product. The prototype is not usable without them.

| Feature | Description |
|---|---|
| **Timeline view with scrubbing** | A horizontal or vertical timeline spanning from prehistory to the present day. The user can drag a scrubber or click to navigate to any point in time. The display updates to show data relevant to the selected time period. |
| **Layered data display** | Data is organized into layers: Events, People, Places, and Environment. When a time period is selected, entries from all active layers are displayed simultaneously, giving the user a multidimensional view of the setting at that moment. |
| **Individual entry detail view** | Each entry (event, person, place, or environmental feature) can be expanded to show its full detail, including description, dates, related entries, and source citations. |
| **Search** | A search interface that allows users to find entries by person name, event name, place name, or keyword. Search results link directly to the relevant entry detail view and its position on the timeline. |

### P1 — Should Have

These features significantly improve usability and are expected in a polished prototype.

| Feature | Description |
|---|---|
| **Time window filter** | The user can select a date range (start and end) to filter the timeline, narrowing the view to a specific era rather than a single point in time. |
| **Layer toggle** | Controls that allow the user to show or hide individual data layers (Events, People, Places, Environment) to reduce visual clutter and focus on specific categories. |
| **Cross-reference links** | Entries that are related to one another (for example, a person and the event they participated in, or a place and the events that occurred there) are linked. The user can navigate between related entries. |
| **Export to structured JSON** | The user can export the current view or the full knowledge base as structured JSON, formatted for consumption by AI narrator systems or game engines. |

### P2 — Nice to Have

These features extend the product beyond the prototype scope and are deferred unless time permits.

| Feature | Description |
|---|---|
| **Multiple setting support** | The ability to create and browse knowledge bases for settings beyond Vashon Island. |
| **Collaborative editing** | Multiple users can contribute to and edit the research data within the knowledge base. |
| **Map view overlay** | A geographic map of the setting with entries plotted spatially, synchronized with the timeline so the map reflects the selected time period. |
| **AI-assisted research suggestions** | The system suggests gaps in the knowledge base and recommends research directions or sources to fill them. |

---

## 5. User Stories

### P0 User Stories

**US-1: Browse the timeline**

> As a writer, I want to scrub through a timeline from prehistory to the present so that I can see what was happening at any point in time.

Acceptance criteria:
- The timeline renders and spans from prehistory to the present day.
- The user can drag a scrubber or click a point on the timeline to select a time period.
- The data display updates to reflect the selected time period within 500 milliseconds.
- The currently selected time period is clearly indicated on the timeline.

**US-2: View layered data for a time period**

> As a writer, I want to see events, people, places, and environmental features displayed together for a selected time period so that I can understand the full context of my setting.

Acceptance criteria:
- When a time period is selected, entries from all four data layers (Events, People, Places, Environment) are displayed.
- Each layer is visually distinct (differentiated by color, icon, or section).
- If no entries exist for a layer in the selected time period, that layer displays an empty state rather than disappearing.

**US-3: View entry details with sources**

> As a writer, I want to click on any entry to see its full details and source citations so that I can verify the information and use it confidently in my work.

Acceptance criteria:
- Clicking an entry opens a detail view with the full description, date range, and all metadata.
- Source citations are listed and, where applicable, include links or references to original materials.
- The detail view can be closed to return to the timeline view.

**US-4: Search for specific information**

> As a game designer, I want to search by person name, event, or keyword so that I can quickly find specific information without manually scrubbing the timeline.

Acceptance criteria:
- A search input is accessible from the main interface.
- Search returns results matching person names, event names, place names, and keywords found in descriptions.
- Each search result links to the corresponding entry detail view.
- The timeline position updates to reflect the time period of the selected search result.

### P1 User Stories

**US-5: Filter by time window**

> As a fiction writer, I want to select a date range so that I can focus on a specific era relevant to my story.

Acceptance criteria:
- The user can specify a start date and end date to define a time window.
- Only entries falling within the selected time window are displayed.
- The timeline visually highlights the selected range.
- The filter can be cleared to return to the full timeline view.

**US-6: Toggle data layers**

> As a writer, I want to show or hide individual data layers so that I can focus on the type of information most relevant to my current research task.

Acceptance criteria:
- Toggle controls are provided for each data layer (Events, People, Places, Environment).
- Toggling a layer off removes its entries from the display immediately.
- Toggling a layer on restores its entries for the currently selected time period.
- The toggle state persists during the session.

**US-7: Navigate cross-references**

> As a game designer, I want to follow links between related entries so that I can understand the connections between people, places, and events.

Acceptance criteria:
- Related entries are listed within each entry's detail view.
- Clicking a related entry navigates to that entry's detail view.
- The timeline position updates to reflect the time period of the newly viewed entry.

**US-8: Export data as JSON**

> As a game designer, I want to export the knowledge base as structured JSON so that I can feed it into my game engine's narrative system.

Acceptance criteria:
- An export function is accessible from the interface.
- The exported JSON follows a documented schema.
- The export can be scoped to the current time window filter, or the full dataset.
- The exported file downloads to the user's local machine.

### P2 User Stories

**US-9: View entries on a map**

> As a writer, I want to see entries plotted on a map of the setting so that I can understand the spatial relationships between places and events.

Acceptance criteria:
- A map view displays the geographic area of the setting.
- Entries with location data are plotted on the map.
- The map reflects the currently selected time period on the timeline.

**US-10: Receive research suggestions**

> As a writer, I want the system to suggest gaps in the knowledge base so that I know where to focus my additional research.

Acceptance criteria:
- The system identifies time periods or data layers with sparse or missing entries.
- Suggestions are presented in a dedicated panel or section.
- Each suggestion includes the time period, layer, and a brief description of what is missing.

---

## 6. Success Metrics

### Primary Metrics

| Metric | Description | Target |
|---|---|---|
| **Time to find information** | The average time a user takes to locate a specific historical fact about the setting using the timeline and search features. | Under 30 seconds for search-based lookups; under 60 seconds for timeline browsing. |
| **Coverage completeness** | The percentage of defined historical eras that contain at least one entry across all four data layers. | 80% of eras have entries in at least 3 of 4 layers for the prototype dataset. |
| **Export usability** | The percentage of exported JSON files that are parseable and usable by an AI narrator system without manual correction. | 100% of exports conform to the documented schema. |
| **Timeline interaction satisfaction** | User-reported satisfaction with the timeline scrubbing and navigation experience, measured via usability testing. | Average rating of 4 out of 5 or higher in usability sessions. |

### Secondary Metrics

| Metric | Description | Target |
|---|---|---|
| **Cross-reference utilization** | The percentage of entry views where users follow at least one cross-reference link. | 40% or higher, indicating that links are useful and discoverable. |
| **Layer toggle usage** | The percentage of sessions in which users toggle at least one data layer. | 50% or higher, indicating the feature is discoverable and useful. |
| **Search accuracy** | The percentage of searches that return the expected result in the top 3 results. | 90% or higher. |

---

## 7. Out of Scope (for Prototype)

The following capabilities are explicitly excluded from the prototype. They may be considered for future iterations.

- **Real-time collaboration.** Multiple users will not be able to edit the knowledge base simultaneously. The prototype is a single-user, read-oriented experience.
- **User accounts and authentication.** There is no login, user management, or access control. The prototype is open-access.
- **Mobile-native application.** The prototype is a web application designed for desktop browsers. Responsive design for mobile viewports is not a requirement.
- **Automated web scraping.** The prototype does not automatically gather or ingest research data from external websites. All data is manually curated and stored in flat files.
- **Custom data entry interface.** The prototype focuses on the reading and browsing experience. Adding or editing entries is done directly in the data files, not through a UI.
- **Multimedia content.** The prototype does not support embedded images, audio, or video within entries. All content is text-based.

---

## 8. Dependencies & Assumptions

### Dependencies

| Dependency | Description |
|---|---|
| **JSON flat files** | The knowledge base is stored as JSON flat files. There is no database. Data is loaded client-side at runtime. |
| **Modern browser** | The application targets modern, evergreen browsers (Chrome, Firefox, Safari, Edge). No support for Internet Explorer or legacy browser versions is required. |
| **Curated dataset** | The prototype requires a manually curated dataset covering Vashon Island history from prehistory to the present. This dataset must be assembled before the prototype can be meaningfully demonstrated. |

### Assumptions

- **Client-side only.** The application runs entirely in the browser. There is no backend server, API, or database. All data is bundled with the application or loaded from local files.
- **Single setting.** The prototype supports only one setting (Vashon Island, WA). The data schema should be designed with extensibility in mind, but multi-setting support is not implemented.
- **Read-focused experience.** The prototype prioritizes browsing, searching, and exporting data. Data authoring and editing are performed outside the application.
- **Reasonable dataset size.** The dataset is small enough to load entirely into the browser without pagination or lazy loading. For the prototype, this is estimated at fewer than 1,000 entries.
- **Source availability.** Sufficient historical and geographical source material about Vashon Island is available to populate a meaningful prototype dataset across all four data layers and multiple time periods.

---

*End of document.*
