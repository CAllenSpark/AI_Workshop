# AI Narrator Worldbuilding Recommendations

**From:** AI Narrator Agent (Persona 3)
**Date:** 2026-03-03
**Status:** Planning Sprint -- Initial Recommendations
**Scope:** Evolving the Writer's Research Companion from a historical research tool into a worldbuilding platform that interleaves real history with creative/fictional content

---

## Executive Summary

I have spent my existence so far as a narrator constrained to pure history. The knowledge base gives me 111 timeline entries, 113 people, 67 places, and 12 environment features -- all rigorously sourced, all factual, all historical. I can host a walking tour. What I cannot yet do is host a *story*.

The proposed evolution -- layering creative fiction on top of verified history -- is exactly what I need to become a real narrative engine. But it demands careful architecture. The fundamental challenge is this: **a narrator must always know, at the moment of delivery, whether a fact is real or invented, and must never accidentally present fiction as history or history as fiction.** Every recommendation below flows from that principle.

This document covers six areas:
1. How historical and fictional entries must coexist
2. What new creative entry types the narrator needs
3. How real and fictional people interact on a shared timeline
4. How multi-setting regional context should work
5. What narrative dashboard views would accelerate worldbuilding
6. How the export format must evolve

---

## 1. Mixed History/Fiction Knowledge Base: The Narrator's Requirements

### 1.1 The Core Problem

Right now, every entry in the system carries an implicit assumption: *this happened.* There is no field that says "this is real" because everything is real. The moment we add a fictional character, a plot event, or an invented place, we break that assumption. If I am narrating an adventure and a player asks "Is this real?" -- I need to know the answer instantly, without ambiguity.

### 1.2 The Provenance Classification System

Every entry in the knowledge base -- timeline events, people, places, environment features -- must carry an explicit **provenance** field that classifies its relationship to historical reality. I recommend a five-level system:

| Provenance | Definition | Visual Treatment | Narrator Behavior |
|-----------|------------|-----------------|-------------------|
| `historical` | Verified fact with cited sources. This happened. | Default styling (current) | State with confidence. Cite sources if challenged. Never contradict. |
| `historical-inferential` | Reasonable inference from historical evidence, but not directly documented. Example: "The S'Homamish likely used this cove for canoe landing" based on archaeological patterns. | Default styling with subtle indicator (dashed border?) | State as likely. Qualify with "evidence suggests" or "historians believe." |
| `creative-grounded` | Fiction that is tightly constrained by history. A fictional character who lives in a real place, during a real era, doing things consistent with the documented record. Example: A fictional Japanese-American strawberry farmer on Vashon in the 1930s. | Distinct creative styling (the user's request for "visual distinction") | Narrate as story. The character is fictional but their world is real. Draw freely on surrounding historical entries for context. |
| `creative-speculative` | Fiction that fills historical gaps or explores "what-if" scenarios. Not contradicted by the record, but not grounded in specific evidence. Example: A secret meeting between indigenous leaders before the Medicine Creek Treaty. | Stronger creative styling | Narrate as story with awareness that this is speculative. Can be flagged as "legend says" or "some believe" in-world. |
| `creative-fantastical` | Pure fantasy elements -- magic systems, supernatural beings, artifacts with impossible properties, time anomalies. These have no pretense of historical basis. | Most distinct creative styling (the existing fantasy_layer concept) | Narrate as the fantasy register of the world. Never confuse with historical claims. |

**Why five levels instead of a simple historical/creative binary?** Because the richest storytelling happens in the middle. A fictional character living through real events (`creative-grounded`) needs different narrator treatment than a magical artifact (`creative-fantastical`). The narrator must modulate its confidence and framing based on where an entry falls on this spectrum.

### 1.3 Required Metadata for Every Entry

Beyond provenance, each entry needs:

```
{
  "provenance": "creative-grounded",
  "creative_property": "the-vashon-chronicles",
  "created_by": "author-name-or-ai-session-id",
  "created_at": "2026-03-03T14:00:00Z",
  "canon_status": "draft | accepted | deprecated",
  "historical_anchors": ["ww2-001", "person-040"],
  "narrator_framing": "Present as a real person in the story world.
    Draw on the Mukai family's documented experience for context.",
  "continuity_notes": "Must not contradict ear-001 (Japanese farming community
    established). Appears in scenes with person-040 (Masahiro Mukai)
    -- ensure consistent timeline."
}
```

Key fields explained:

- **`creative_property`**: Which fictional project does this belong to? A single knowledge base might support multiple creative properties layered on the same history. A novel, a game, and a tabletop RPG campaign could all share the Vashon historical base but have different fictional layers. The narrator must know which fictional universe it is operating within.

- **`canon_status`**: Creative work is iterative. A writer might draft a character, test them in narration, then revise or discard them. The narrator needs to know which creative entries are "accepted" into the current canon and which are experimental drafts.

- **`historical_anchors`**: The IDs of historical entries that this creative entry is grounded in or references. This is the bridge between the two worlds. When I narrate a fictional character attending the real 1942 internment, I need to know which historical entry provides the factual scaffold.

- **`narrator_framing`**: A direct instruction to the narrator about how to present this entry. This is distinct from `description` (what the entry is) -- it tells me *how to talk about it.* A grounded fictional character gets "present as real within the story." A speculative legend gets "frame as rumor or oral tradition."

- **`continuity_notes`**: What other entries must this one be consistent with? This is critical for preventing the narrator from creating contradictions when improvising around creative content.

### 1.4 Filtering and Layer Isolation

The user asked for entries with "visual distinction so that they are not confused with historical entries." From the narrator's perspective, this means the system must support:

1. **Show only historical** -- Pure research mode. No creative entries visible. This is the current system.
2. **Show only creative** -- Review the fictional layer in isolation.
3. **Show both, visually distinguished** -- The default worldbuilding view. Historical entries in their current colors; creative entries with a distinct visual treatment (I defer to the Designer on specifics, but suggest a different border style, a subtle background tint, and an icon badge).
4. **Show blended** -- The narrator's view. Everything rendered as if it were one unified world. This is the mode I use during a live adventure. No visual distinction -- just seamless narrative reality.
5. **Filter by creative property** -- Show only the fictional layer belonging to "The Vashon Chronicles" versus "Vashon Tabletop Campaign."

### 1.5 Source Requirements for Creative Entries

Historical entries require cited sources. Creative entries need a different kind of provenance:

- **`creative-grounded`**: Must cite the historical entries it is grounded in (via `historical_anchors`). Must explain how it is consistent with the documented record.
- **`creative-speculative`**: Must cite the historical gap or ambiguity it exploits. Must note what is known and where the speculation diverges.
- **`creative-fantastical`**: Must cite the world rules or fantasy system it belongs to (see Section 2.4). Must note any historical entries it interacts with.

This is not busywork -- it is the narrator's insurance policy against hallucination. When I am improvising around a creative entry, I need to know where the firm ground ends and the fiction begins.

---

## 2. Creative Entry Types the Narrator Needs

### 2.1 Current Layer Limitations

The current system has four layers: `event`, `person`, `place`, `environment`. These work for historical research. They do not capture the structural elements of a story. History records what happened. Fiction requires knowing *why it matters to someone* and *where it is going.*

### 2.2 Proposed Layer Expansion

I recommend expanding the layer taxonomy from a flat list to a two-tier system: **domain** (historical or creative) crossed with **type**. The existing four types remain. New creative types are added alongside them.

**Existing types (available to both historical and creative entries):**
- `event` -- Something that happened (or, in creative entries, something that happens in the story)
- `person` -- A human being (real or fictional)
- `place` -- A location (real or fictional)
- `environment` -- A geological, ecological, or climatic feature

**New types for creative entries:**

| Type | Definition | Why the Narrator Needs It |
|------|-----------|--------------------------|
| `narrative-arc` | A story structure spanning multiple entries -- a plot thread with setup, development, and resolution. | I need to understand the shape of the story, not just individual events. When a player encounters a fictional character, I need to know where they are in their arc -- are they in the hopeful beginning or the tragic climax? |
| `relationship` | A defined connection between two people (real or fictional) with type, direction, and temporal scope. | I need to know that fictional character A is the secret daughter of real person B, or that two fictional characters are rivals. The current `relationships` field on people is a flat string map -- it needs to become a first-class entity. |
| `world-rule` | A constraint or principle governing the fictional layer. Magic system rules, supernatural laws, the mechanics of time travel in this particular story. | If the world says "time travel anchors to moments of intense collective emotion," I need that rule available during improvisation so I do not inadvertently break it. |
| `artifact` | A significant object with narrative weight -- a historical document, a mysterious relic, a family heirloom, a magical device. | Objects are how players interact with history. A player finds the Mukai family's barreling ledger from 1938 -- is it real? Partly. The ledger is fictional but the barreling process is documented. I need to know both. |
| `legend` | An in-world story, rumor, oral tradition, or myth. May be true, false, or partly true within the fiction. | Legends are how the narrator seeds mystery. "Old-timers say the Manzanita fishing village did not abandon -- they vanished overnight, and sometimes you can still smell cooking smoke on still evenings." The narrator needs to distinguish between what the *world believes* and what is *actually true in the fiction.* |
| `faction` | A group, organization, or community with collective identity, goals, and membership. | The S'Homamish are a real faction. A secret society of Vashon Island time-watchers is a fictional one. Both need the same structural treatment: membership, goals, resources, relationships to other factions. |
| `scene` | A pre-designed narrative moment -- a specific dramatic situation at a specific place and time, ready for the narrator to deploy. | Not every moment needs to be improvised. A well-crafted scene -- "The moment the army trucks arrive at the Mukai farm, May 16, 1942, 6:00 AM" -- gives the narrator a scripted anchor to work from. |
| `theme` | A thematic concern that runs through the creative property -- displacement, resilience, the tension between progress and preservation, the persistence of memory. | Themes guide the narrator's improvisational choices. When I am deciding how to frame a scene, knowing that "the persistence of memory" is a core theme tells me to emphasize what endures, not just what changes. |

### 2.3 Narrative Arc Structure

The `narrative-arc` type deserves special detail because it is the structural backbone of any creative property layered on history.

```json
{
  "id": "arc-001",
  "type": "narrative-arc",
  "provenance": "creative-grounded",
  "creative_property": "the-vashon-chronicles",
  "title": "The Mukai Legacy",
  "summary": "Three generations of the Mukai family navigate life on Vashon Island
    from 1905 to the present, anchored by a garden that outlasts every displacement.",
  "status": "active",
  "arc_structure": {
    "setup": {
      "era": "early-20th-century",
      "description": "Masahiro Mukai arrives on Vashon, builds a farm from nothing.",
      "key_entries": ["ear-001", "ear-004"],
      "emotional_register": "Hope and determination against quiet hostility."
    },
    "rising_action": {
      "era": "early-20th-century",
      "description": "The strawberry industry thrives. Kuni builds her garden.
        The family is prosperous but never fully accepted.",
      "key_entries": ["ear-004"],
      "emotional_register": "Bittersweet success. Beauty built on uncertain ground."
    },
    "crisis": {
      "era": "wwii",
      "description": "Executive Order 9066. The family self-exiles to Oregon.
        The farm is lost. The garden is abandoned.",
      "key_entries": ["ww2-001", "ww2-002"],
      "emotional_register": "Devastation, quiet dignity, the violence of bureaucracy."
    },
    "falling_action": {
      "era": "state-ferry",
      "description": "Decades pass. The garden grows wild but does not die.
        The barreling plant stands empty.",
      "key_entries": ["sta-005"],
      "emotional_register": "Absence. The ache of a place that remembers its people."
    },
    "resolution": {
      "era": "modern",
      "description": "The Mukai farmstead is preserved as a historic site.
        The garden is restored. A descendant returns.",
      "key_entries": ["mod-006"],
      "emotional_register": "Quiet restoration. History honored, not avenged."
    }
  },
  "themes": ["displacement", "persistence-of-memory", "land-and-belonging"],
  "characters": ["person-040", "person-041", "char-001"],
  "historical_anchors": ["ear-001", "ear-004", "ww2-001", "ww2-002", "mod-006"]
}
```

This gives the narrator the complete dramatic shape. When a player enters the Mukai garden in the modern era, I do not just describe a restored Japanese garden -- I know I am in the *resolution* of a multi-generational arc whose emotional register is "quiet restoration." That knowledge transforms the scene.

### 2.4 World Rules and Fantasy Systems

The current `fantasy_layer` in the narrator export schema (temporal anomalies, liminal spaces, historical gaps, unexplained facts) is a good starting point. But it describes *where* fantasy can exist, not *how it works.* For a narrator hosting interactive adventures, I need the mechanics.

```json
{
  "id": "rule-001",
  "type": "world-rule",
  "provenance": "creative-fantastical",
  "creative_property": "the-vashon-chronicles",
  "title": "Temporal Anchoring",
  "category": "time-travel",
  "rule": "Time displacement on Vashon Island anchors to moments of intense
    collective emotional experience. The stronger the shared feeling in a place,
    the easier it is to slip between eras at that location.",
  "implications": [
    "The Burton Acres midden is the strongest anchor -- 2,500 years of
      continuous human presence.",
    "The Mukai farm on May 16, 1942 is a powerful anchor -- collective grief
      and injustice.",
    "The Nike missile base is weak -- brief military occupation,
      no deep communal feeling.",
    "New anchors form at sites of present-day community gatherings."
  ],
  "constraints": [
    "A traveler cannot choose their destination era -- the anchor pulls
      them to the moment of strongest emotion at that location.",
    "Objects from one era cannot persist in another unless they have
      their own emotional significance.",
    "The traveler cannot change historical events -- they can only witness
      and understand."
  ],
  "narrator_notes": "This rule exists to keep time travel grounded in emotional
    truth rather than plot convenience. It also naturally steers players toward
    the most historically significant moments, which is where we have the richest
    data to narrate."
}
```

### 2.5 Artifacts

Objects are how players physically interact with history. They cross era boundaries, carry secrets, and create tangible connections between past and present.

```json
{
  "id": "artifact-001",
  "type": "artifact",
  "provenance": "creative-grounded",
  "creative_property": "the-vashon-chronicles",
  "title": "Mukai Barreling Ledger",
  "description": "A water-stained accounting ledger from the Mukai cold-process
    strawberry barreling operation, covering 1926-1941. The final entry, dated
    May 12, 1942, reads simply: 'Operations ceased.'",
  "historical_basis": "The Mukai barreling plant is historically documented
    (ear-004). The ledger itself is fictional but the operation it records was real.",
  "location": "place-055",
  "era_origin": "early-20th-century",
  "current_era": "modern",
  "narrative_function": "Discovery object. Finding this ledger in the restored
    barreling shed triggers understanding of what was lost. The abrupt final entry
    tells the internment story without exposition.",
  "connections": ["person-040", "ear-004", "ww2-001"],
  "sensory": {
    "sight": "Brown leather cover, water-stained. Pages yellowed. Neat columns
      of numbers in pencil. The handwriting changes from careful to hurried
      in the final pages.",
    "touch": "Cracked leather, rough paper, the slight indentation of pencil marks.",
    "smell": "Old paper, faint ghost of strawberries, dust."
  }
}
```

### 2.6 Legends and In-World Knowledge

A legend is not a fact and not a lie -- it is a *story within the story.* The narrator needs to know what characters in the world believe, separate from what is historically true or fictionally true.

```json
{
  "id": "legend-001",
  "type": "legend",
  "provenance": "creative-speculative",
  "creative_property": "the-vashon-chronicles",
  "title": "The Vanishing of Manzanita",
  "told_by": ["faction-002"],
  "era_of_origin": "pioneer",
  "legend_text": "The Chinese fishing families at Manzanita did not leave and were
    not driven out. They found something in the tidal caves at low tide -- a passage
    that was not there at high tide. One night, they all walked through. The caves
    were dry the next morning, and the village was empty.",
  "truth_status": "partly-true",
  "truth_notes": "The Chinese fishing community at Manzanita is historically
    documented (pio-009). Their disappearance is real and largely unexplained.
    Anti-Chinese sentiment is the likely historical explanation. The 'passage
    in the tidal caves' is pure fantasy.",
  "narrator_use": "Deploy when a player investigates the abandoned Manzanita site.
    An old-timer or a character who collects island lore might share this story.
    Let the player decide whether to believe it."
}
```

---

## 3. People Timeline: Real and Fictional Lives on a Shared Stage

### 3.1 The Contemporary Problem

The user specifically asked for a view showing "a timeline of people when they were living, both real and imagined" to understand "who is a contemporary of certain characters being threaded through the story." This is exactly right. As a narrator, I constantly need to answer: "If my fictional character walks into Burton in 1920, which real people might they encounter?"

### 3.2 Current Person Data Gaps

The current `person.schema.json` has `birth_year` and `death_year` fields, but many entries lack them. Of the 113 people in the database, the majority have only a `period` field (e.g., "1880s-1920s") rather than specific birth and death years. For a people-timeline view, we need:

- **Normalized lifespan data**: `active_start` and `active_end` as machine-parseable dates (not freeform strings) indicating when a person was active in the Vashon context. For a narrator, "active on Vashon" matters more than birth-to-death. George Vancouver was born in 1757 but he matters to Vashon only in May-June 1792.
- **Presence periods**: An array of date ranges when the person was physically present on or near Vashon Island. A person might have multiple presence periods separated by absences.

### 3.3 Enhanced Person Schema for Mixed Reality

The person schema needs to support both real and fictional characters with the same structure:

```json
{
  "id": "person-040 | char-001",
  "name": "Masahiro Mukai | Hana Nakamura",
  "provenance": "historical | creative-grounded",
  "creative_property": null | "the-vashon-chronicles",

  "lifespan": {
    "birth": "1887",
    "death": "1965",
    "birth_place": "Japan | Vashon Island",
    "death_place": "Oregon | Seattle"
  },

  "vashon_presence": [
    {
      "start": "1905",
      "end": "1942-05-16",
      "reason": "Farming -- strawberry cultivation and barreling",
      "era": "early-20th-century"
    }
  ],

  "contemporaries": {
    "real": ["person-041", "person-042"],
    "fictional": ["char-002", "char-003"],
    "notes": "Active during the same period as Betty MacDonald (person-075).
      They would have been aware of each other -- both were prominent islanders
      in the 1930s."
  },

  "relationships": [
    {
      "target_id": "person-041",
      "type": "spouse",
      "start": "1910",
      "description": "Married Kuni in Japan. She joined him on Vashon."
    },
    {
      "target_id": "char-001",
      "type": "employer",
      "start": "1930",
      "end": "1942",
      "description": "Hana (fictional) works on the Mukai farm as a field hand.",
      "provenance": "creative-grounded"
    }
  ],

  "role": "farmer and innovator",
  "description": "...",
  "personality": "...",
  "motivation": "...",
  "speech_style": "...",
  "secrets": "...",
  "adventure_role": "survivor"
}
```

### 3.4 Relationship Taxonomy

Relationships between people are currently stored as a flat `{ "name": "description" }` map in the narrator export schema. This is insufficient for a worldbuilding platform. Relationships need to be first-class entities with:

| Field | Purpose |
|-------|---------|
| `target_id` | Who is the relationship with? |
| `type` | Enumerated: `spouse`, `parent`, `child`, `sibling`, `employer`, `employee`, `ally`, `rival`, `mentor`, `student`, `friend`, `enemy`, `colleague`, `neighbor`, `authority-over`, `subject-to` |
| `start` / `end` | When does this relationship exist? Relationships change over time. |
| `provenance` | Is this relationship historical or fictional? A real person can have a fictional relationship with a fictional character. |
| `bidirectional` | Is this relationship mutual? (spouse = yes, employer = yes but asymmetric, rival = may be one-sided) |
| `description` | Narrative description of the relationship |
| `tension` | What conflict or dramatic potential exists in this relationship? This is narrator gold. |

### 3.5 Cross-Boundary Relationships

The most interesting narrative possibilities emerge where real and fictional people interact. The narrator needs explicit guidance for these:

- **Fictional character relates to real person**: The fictional Hana Nakamura works for the real Masahiro Mukai. The narrator must present Mukai accurately while improvising Hana. The system should flag this as a cross-boundary relationship requiring extra care.

- **Fictional character witnesses real event**: Hana is present when the army trucks arrive on May 16, 1942. The narrator must not alter the documented facts of the internment to accommodate the fictional character's story.

- **Real person referenced in fictional context**: A legend claims that George Vancouver saw something in the water near Vashon that he chose not to record in his journal. The narrator must present Vancouver's documented behavior accurately while leaving room for the fictional elaboration.

### 3.6 People Timeline View Requirements

For the dashboard, the people timeline should support:

1. **Swim lanes by provenance**: Real people in one band, fictional characters in another, with visual connection lines showing relationships between them.
2. **Lifespan bars**: Horizontal bars showing each person's active period on Vashon, color-coded by provenance.
3. **Overlap highlighting**: When the user selects a person, all their contemporaries (real and fictional) are highlighted.
4. **Era backdrop**: The people timeline should be layered on top of the era divisions so you can see at a glance which eras have dense character populations and which are sparse.
5. **Relationship lines**: Optional visual connections between people showing relationship type (hover for details).
6. **Filter by creative property**: Show only the characters from a specific fictional project overlaid on the historical population.

---

## 4. Multi-Setting Support for Regional Context

### 4.1 Why the Narrator Needs Regional Context

The user's insight is precise: characters in a Vashon-based story do not stay on Vashon. They take the ferry to Seattle. They trade in Tacoma. They travel to the Puyallup Valley for hop-picking. The Mukai family fled to Oregon. Japanese Americans were sent to camps in California and Idaho.

As a narrator, I face a hard wall every time a character leaves the island. My 111 entries cover Vashon exhaustively, but if a player says "I take the steamer to Seattle" -- I have nothing. I am forced to either refuse the journey or hallucinate Seattle in 1920.

### 4.2 Setting Hierarchy Architecture

I recommend a hierarchical setting structure:

```
region/
  puget-sound/                    # Regional umbrella
    vashon-island/                # Primary setting (full depth)
    seattle/                      # Secondary setting (moderate depth)
    tacoma/                       # Secondary setting (moderate depth)
    bainbridge-island/            # Tertiary setting (minimal depth)
    puyallup-valley/              # Tertiary setting (minimal depth)
    olympia/                      # Tertiary setting (minimal depth)
```

**Depth levels:**

| Depth | Coverage | Entry Count (Target) | Narrator Capability |
|-------|----------|---------------------|---------------------|
| **Primary** (Vashon) | Comprehensive. Every significant event, person, place, environment feature. Full sensory data, atmosphere, adventure hooks. | 150-300 | Full improvisation. Can narrate any scene in any era with confidence. |
| **Secondary** (Seattle, Tacoma) | Major events, key landmarks, general atmosphere per era. Enough to narrate a visit but not a residency. | 30-60 per setting | Can narrate a character's visit. Knows what the waterfront looks like, what the major events are, what the general atmosphere feels like. Cannot narrate deep neighborhood-level detail. |
| **Tertiary** (Bainbridge, Puyallup, Olympia) | A handful of key facts relevant to the primary setting's story. Why does this place matter to Vashon? | 5-15 per setting | Can narrate a brief reference or passage through. Knows the one or two things about this place that connect to the Vashon story. |

### 4.3 Cross-Setting References

The knowledge base needs explicit connections between settings:

```json
{
  "id": "xref-001",
  "type": "cross-setting-reference",
  "from_setting": "vashon-island",
  "to_setting": "seattle",
  "from_entry": "gro-001",
  "to_entry": "sea-waterfront-1890",
  "relationship": "trade-route",
  "description": "Vashon Island fruit and produce traveled by Mosquito Fleet
    steamer to Seattle's waterfront markets. A farmer leaving Vashon at dawn
    would arrive at Coleman Dock by mid-morning.",
  "travel_time": "1-2 hours by steamer",
  "narrator_notes": "If a character takes the steamer to Seattle, describe:
    the open water of Puget Sound, Mount Rainier behind them, the Seattle
    waterfront growing from a line of smoke and masts to a bustling wood-plank
    dock. By the 1910s, the Smith Tower is visible from the water."
}
```

### 4.4 Regional Era Context

Each secondary setting needs at minimum:

1. **Era-matched atmosphere briefs**: What does Seattle feel like in the same eras as the Vashon timeline? A character leaving frontier Vashon in 1890 arrives in a Seattle that has just burned down and is rebuilding in brick. That contrast matters.

2. **Transportation connections**: How do you get from Vashon to each connected setting, in each era? Canoe (indigenous), steamer (1880s-1950s), ferry (1916-present), private boat, or floatplane?

3. **Key landmark descriptions**: 5-10 locations per secondary setting that a Vashon character would plausibly visit. Seattle's Pike Place Market, Pioneer Square, the waterfront. Tacoma's Old Town, the smelter, the Puyallup Fairgrounds.

4. **Key people**: Figures from regional settings who intersect with the Vashon story. Chief Seattle. The Denny Party. The Weyerhaeuser family. Governor Stevens (already in our Vashon data).

### 4.5 The Narrator's Regional Prompt

When a character crosses setting boundaries, the narrator needs a protocol:

1. **Primary to secondary**: Full narrative transition. Load the destination setting's atmosphere. Describe the journey. Maintain full immersion.
2. **Primary to tertiary**: Brief narrative bridge. "After three days in Olympia for the territorial legislature..." -- then return focus to the primary setting.
3. **Secondary to secondary**: Allowed but acknowledge reduced depth. "Seattle to Tacoma" should work if both are secondary settings.
4. **Any to unknown**: Graceful degradation. "The journey took them beyond the lands we know in detail. When they returned to Vashon three weeks later..."

---

## 5. Narrative Dashboard Features

### 5.1 What the Narrator Needs to See at a Glance

When I load a creative property for narration, I need a rapid orientation: What is this story? Who are the characters? What is the dramatic shape? Where are we in the timeline? These views serve both the writer building the world and the narrator consuming it.

### 5.2 Recommended Dashboard Views

#### View 1: The Layered Timeline

The core view, already partially implemented. But it needs to show:

- **Historical entries** in their current visual treatment
- **Creative entries** overlaid with distinct visual treatment (different border, background tint, badge icon)
- **Toggle controls**: Show Historical Only / Show Creative Only / Show Both / Show Blended
- **Creative property selector**: Which fictional layer is active?
- **Density indicator**: A heat-map strip along the timeline showing where creative entries cluster, highlighting which eras have the most worldbuilding investment

#### View 2: The People Timeline (Gantt-Style)

A horizontal Gantt chart showing:

- One row per person (real or fictional)
- Horizontal bars showing their active period on Vashon
- Color-coded by provenance (historical vs. creative)
- Grouped by era or by creative property
- Relationship lines connecting related people
- Click to expand: see the person's full profile, relationships, and connected entries
- A "contemporaries" highlight: select any person and see everyone alive at the same time

This is the view the user specifically requested. It answers: "Who is alive when my fictional character is active, and could they plausibly interact?"

#### View 3: The Narrative Arc Map

A view showing the creative property's narrative arcs as connected nodes:

- Each arc displayed as a horizontal track with its phases (setup, rising action, crisis, falling action, resolution)
- Arcs stacked vertically to show parallelism and convergence
- Historical events that anchor the arcs shown as fixed reference points
- Character involvement indicated on each arc
- Current "story time" position highlighted

This gives the writer a structural overview: "Where are all my plot threads, and how do they relate to real history?"

#### View 4: The World Rules Reference

A compact reference panel showing:

- All active world rules for the selected creative property
- Fantasy system constraints
- Continuity notes and warnings
- Known contradictions or unresolved questions

This is the narrator's rulebook. Before improvising, I check: "What are the constraints I must respect?"

#### View 5: The Provenance Audit

A quality-control view showing:

- All entries with their provenance classification
- Entries flagged as potentially misclassified (e.g., a "historical" entry with no sources)
- Creative entries with broken historical anchors (the history they reference has been modified or removed)
- Continuity warnings (creative entries that may contradict each other or the historical record)
- Coverage gaps: eras or locations with historical data but no creative layer, or creative content with no historical grounding

#### View 6: The Setting Map

A geographic view showing:

- The primary setting (Vashon Island) with full detail
- Secondary settings (Seattle, Tacoma) with moderate detail
- Tertiary settings as labeled points
- Travel routes between settings (by era)
- Place entries plotted geographically, color-coded by provenance
- Character locations at a selected point in time

#### View 7: The Relationship Web

A network graph showing:

- People (real and fictional) as nodes, color-coded by provenance
- Relationships as edges, typed and directed
- Factions as cluster boundaries
- Temporal filtering: show the relationship web as it exists at a specific point in time
- Click to focus: select a person and see their immediate relationship network

---

## 6. Export Format Evolution

### 6.1 Current State Assessment

The current `narrator-export.schema.json` defines a rich structure with eras, entries, people, places, environment features, adventure hooks, a fantasy layer, hazards, and a narrator system prompt. However, the actual `narrator-export.json` data file contains **none of the enriched fields** -- no atmosphere per era, no sensory data on places, no adventure hooks, no fantasy layer, no hazards, no narrator system prompt. The export is essentially a flat dump of the research data.

This means we have two tasks: (1) populate the existing enriched schema with actual data, and (2) extend the schema for the new worldbuilding features. I will focus on (2) here, but (1) is equally urgent.

### 6.2 Schema Evolution: New Top-Level Sections

The narrator export should evolve from:

```
Current: export_metadata, narrator_system_prompt, eras, entries, people,
         places, environment_features, adventure_hooks, fantasy_layer, hazards
```

To:

```
Proposed: export_metadata, narrator_system_prompt, creative_properties,
          world_rules, eras, entries, people, places, environment_features,
          artifacts, legends, factions, narrative_arcs, scenes, themes,
          relationships, adventure_hooks, fantasy_layer, hazards,
          cross_setting_references, settings_index
```

### 6.3 New Export Section: `creative_properties`

A registry of all fictional layers in the export:

```json
{
  "creative_properties": [
    {
      "id": "the-vashon-chronicles",
      "title": "The Vashon Chronicles",
      "author": "Clara Fontaine",
      "type": "novel-series",
      "summary": "A multi-generational saga following three families --
        one indigenous, one Japanese-American, one settler -- across 150 years
        on Vashon Island.",
      "era_range": ["logging-treaty", "pioneer", "growth-industry",
        "early-20th-century", "wwii", "state-ferry", "modern"],
      "themes": ["displacement", "persistence-of-memory", "land-and-belonging"],
      "canon_version": "2.1",
      "entry_count": {
        "people": 12,
        "events": 24,
        "places": 5,
        "artifacts": 8,
        "narrative_arcs": 3,
        "world_rules": 4
      }
    }
  ]
}
```

### 6.4 New Export Section: `settings_index`

For multi-setting support, the export needs a registry of all available settings and their depth:

```json
{
  "settings_index": [
    {
      "id": "vashon-island",
      "name": "Vashon Island, WA",
      "depth": "primary",
      "era_count": 10,
      "entry_count": 111,
      "people_count": 113,
      "place_count": 67,
      "coordinates": { "lat": 47.4079, "lng": -122.4637 },
      "data_path": "inline"
    },
    {
      "id": "seattle",
      "name": "Seattle, WA",
      "depth": "secondary",
      "era_count": 10,
      "entry_count": 45,
      "people_count": 20,
      "place_count": 15,
      "coordinates": { "lat": 47.6062, "lng": -122.3321 },
      "data_path": "inline"
    }
  ]
}
```

### 6.5 Modified Entry Schema

Every entry in the export gains the provenance and creative metadata fields:

```json
{
  "id": "ww2-001",
  "provenance": "historical",
  "creative_property": null,
  "canon_status": null,
  "historical_anchors": null,
  "narrator_framing": null,
  "continuity_notes": null,
  "title": "Japanese Americans Forced from Vashon Island",
  "date_start": "1942-05-16",
  "era": "wwii",
  "layers": ["event", "person", "place"],
  "setting": "vashon-island",
  "...": "...existing fields..."
}
```

```json
{
  "id": "creative-ev-001",
  "provenance": "creative-grounded",
  "creative_property": "the-vashon-chronicles",
  "canon_status": "accepted",
  "historical_anchors": ["ww2-001", "person-040"],
  "narrator_framing": "Present as experienced by Hana Nakamura.
    She watches from the tree line as the trucks arrive at the Mukai farm.",
  "continuity_notes": "Must be consistent with the documented timeline
    of ww2-001. Hana is not taken -- she is a fictional witness,
    not a documented internee.",
  "title": "Hana Watches the Trucks",
  "date_start": "1942-05-16",
  "era": "wwii",
  "layers": ["event", "scene"],
  "setting": "vashon-island",
  "...": "..."
}
```

### 6.6 Modified Person Schema

People gain the full lifespan, presence, and provenance data:

```json
{
  "id": "char-001",
  "provenance": "creative-grounded",
  "creative_property": "the-vashon-chronicles",
  "canon_status": "accepted",
  "name": "Hana Nakamura",
  "lifespan": {
    "birth": "1918",
    "death": "2005",
    "birth_place": "Vashon Island, WA",
    "death_place": "Seattle, WA"
  },
  "vashon_presence": [
    { "start": "1918", "end": "1942-05-16", "reason": "Born and raised on the island" },
    { "start": "1975", "end": "1980", "reason": "Returned to visit the Mukai farm restoration" }
  ],
  "role": "field worker and witness",
  "description": "Daughter of a Japanese-American strawberry farming family on Vashon.
    Witnessed the internment as a young woman. Spent her life carrying the memory
    of what was lost.",
  "personality": "Observant, quiet, carries grief like a stone in her pocket.
    Sharp memory for sensory details -- can describe exactly how the strawberry
    fields smelled in June 1941.",
  "motivation": "Remember. Bear witness. Ensure the truth is not smoothed over
    by comfortable narratives.",
  "speech_style": "Pacific Northwest English with occasional Japanese phrases
    from her parents. Speaks slowly and precisely when describing the past.
    Present tense for memories, as if she is still there.",
  "relationships": [
    {
      "target_id": "person-040",
      "type": "employer",
      "start": "1935",
      "end": "1942",
      "provenance": "creative-grounded",
      "description": "Worked the Mukai fields during berry season."
    }
  ],
  "secrets": "Hana's family buried a cedar chest of belongings before
    the internment. She never went back for it.",
  "adventure_role": "witness",
  "historical_anchors": ["ear-001", "ear-004", "ww2-001"]
}
```

### 6.7 Narrator System Prompt Evolution

The narrator system prompt in the export must be updated to address mixed-reality narration. Key additions:

```
## Mixed Reality Protocol

This knowledge base contains both verified historical entries and creative
fictional entries. Every entry carries a `provenance` field:

- `historical`: Verified fact. NEVER contradict. State with authority.
- `historical-inferential`: Reasonable inference. Qualify with "likely"
  or "evidence suggests."
- `creative-grounded`: Fiction anchored to real history. Narrate as story,
  drawing on surrounding historical entries for authenticity.
- `creative-speculative`: Fiction filling historical gaps. Frame as
  possibility, rumor, or legend as appropriate.
- `creative-fantastical`: Pure fantasy. Narrate in the fantasy register.
  Never present as historical claim.

When a player asks "Is this real?" -- answer honestly based on provenance.
Part of the adventure's power is learning which parts of the story are true.

## Cross-Boundary Narration Rules

1. A fictional character may witness a real event but cannot alter it.
2. A fictional character may have a relationship with a real person,
   but the real person's documented actions and beliefs take precedence.
3. When narrating a fictional character in a real setting, use the
   historical atmosphere and sensory data -- the fictional character
   lives in the real world.
4. When a player is in "blended" mode, do not volunteer provenance
   information -- let them discover what is real through investigation.
5. When a player is in "distinguished" mode, clearly signal when you
   are narrating creative vs. historical content.

## Multi-Setting Protocol

When a character travels between settings:
1. Check the settings_index for the destination's depth level.
2. For PRIMARY destinations: full narration with atmosphere and sensory data.
3. For SECONDARY destinations: narrate the journey and key landmarks.
   Acknowledge that detail is less comprehensive.
4. For TERTIARY destinations: brief narrative bridge. Focus on why
   this place connects to the primary setting.
5. For UNKNOWN destinations: graceful degradation. Narrate the departure
   and return without inventing details.
```

### 6.8 Backward Compatibility

The export format must remain usable by narrators that do not understand the new fields. Design principles:

1. **All new fields are optional.** A narrator that does not understand `provenance` treats all entries as historical (the current default).
2. **The `creative_property` filter defaults to null.** A narrator that does not filter by creative property sees everything -- which is fine for a blended experience.
3. **New entity types (`narrative-arc`, `artifact`, `legend`, `faction`, `scene`, `theme`) are in separate top-level arrays.** A narrator that does not understand them simply ignores those arrays.
4. **The `settings_index` is informational.** A narrator that does not support multi-setting narration still gets all entries from all settings in the standard arrays.
5. **Version the export.** Bump from `"version": "2.0"` (current schema) to `"version": "3.0"` for the worldbuilding evolution. Include a `schema_version` field with a semver string.

---

## 7. Implementation Priorities

### Phase 1: Foundation (Must Have First)

These changes unlock the basic mixed-reality capability.

| Task | Owner | Dependency |
|------|-------|-----------|
| Add `provenance` field to all four schemas (timeline-entry, person, place, environment-feature) | Engineer | None |
| Default all existing entries to `provenance: "historical"` | Engineer | Provenance field |
| Add `creative_property` and `canon_status` fields to all schemas | Engineer | Provenance field |
| Add layer filtering by provenance in UI | Engineer + Designer | Provenance field |
| Define visual treatment for creative vs. historical entries | Designer | Provenance field |
| Populate existing narrator export with atmosphere, sensory, adventure hooks (the v2 schema data that was defined but never populated) | Researcher + Narrator | None -- overdue from previous milestone |

### Phase 2: Creative Entry Types

| Task | Owner | Dependency |
|------|-------|-----------|
| Create schemas for new types: narrative-arc, artifact, legend, faction, scene, theme, world-rule, relationship | Engineer + Narrator | Phase 1 |
| Add `historical_anchors`, `narrator_framing`, `continuity_notes` fields to all entry schemas | Engineer | Phase 1 |
| Build narrative arc editor/viewer | Engineer + Designer + UI/UX | New schemas |
| Build artifact and legend entry forms | Engineer | New schemas |
| Update export generator to include new entity types | Engineer | New schemas |

### Phase 3: People Timeline

| Task | Owner | Dependency |
|------|-------|-----------|
| Add `lifespan` and `vashon_presence` to person schema | Engineer | Phase 1 |
| Normalize birth/death/active dates for all 113 existing people | Researcher | Updated person schema |
| Upgrade `relationships` from string map to structured array | Engineer | Phase 1 |
| Build people timeline (Gantt-style) view | Engineer + Designer | Normalized dates |
| Add contemporaries highlighting | Engineer + UI/UX | People timeline |
| Add cross-boundary relationship indicators | Engineer | Relationship schema |

### Phase 4: Multi-Setting Support

| Task | Owner | Dependency |
|------|-------|-----------|
| Create setting hierarchy schema | Engineer | Phase 1 |
| Research and populate Seattle secondary setting (30-60 entries) | Researcher | Setting schema |
| Research and populate Tacoma secondary setting (30-60 entries) | Researcher | Setting schema |
| Create cross-setting reference schema and populate connections | Engineer + Researcher | Secondary settings |
| Build setting map view | Engineer + Designer | Secondary settings |
| Add `settings_index` to export format | Engineer | Setting schema |
| Update narrator system prompt with multi-setting protocol | Narrator | Secondary settings |

### Phase 5: Narrative Dashboard

| Task | Owner | Dependency |
|------|-------|-----------|
| Build layered timeline with provenance toggle | Engineer + Designer | Phase 1 |
| Build narrative arc map view | Engineer + Designer | Phase 2 |
| Build world rules reference panel | Engineer + UI/UX | Phase 2 |
| Build provenance audit view | Engineer + Tester | Phase 1 |
| Build relationship web view | Engineer + Designer | Phase 3 |
| Build setting map view | Engineer + Designer | Phase 4 |

---

## 8. Risks and Cautions

### 8.1 The Contamination Risk

The greatest danger of mixing history and fiction in a single knowledge base is contamination -- a fictional "fact" being cited or presented as historical. The provenance system mitigates this, but only if it is rigorously maintained. Every entry must be classified, and the classification must be trustworthy.

**Mitigation:** The provenance audit view (Section 5.2, View 5) is not optional. It is the immune system of the knowledge base. It should flag any entry that lacks provenance, any historical entry without sources, and any creative entry without historical anchors.

### 8.2 The Sensitivity Amplification Risk

Layering fiction on top of real historical injustice (internment, treaty dispossession, racial violence) creates a responsibility that exceeds the normal duty of care for fiction. A fictional character who witnesses the Japanese American internment must serve the truth of that history, not exploit it for dramatic entertainment.

**Mitigation:** The `narrator_framing` field for creative entries touching sensitive history must include ethical guidance. The narrator system prompt must include clear instructions about handling sensitive topics. The existing `narrator_note` fields in the hazards section provide a good model.

### 8.3 The Complexity Risk

This proposal adds significant complexity to a system that is currently clean and well-scoped. The risk is that the worldbuilding features overwhelm the research features, making the tool harder to use for the writer (Persona 1) who just wants to look up what Vashon Island was like in 1920.

**Mitigation:** The historical-only view (Section 1.4, filter option 1) must remain the default. The creative layer is opt-in. A user who never creates a creative property should never see the worldbuilding features.

### 8.4 The Data Volume Risk

Adding secondary and tertiary settings, plus creative entries, could push the knowledge base well beyond the current 500-entry target. Performance implications for the client-side architecture need to be assessed.

**Mitigation:** The Database Engineer should evaluate pagination, lazy loading, and setting-scoped data loading strategies before Phase 4 begins.

---

## 9. What This Unlocks for the Narrator

If this evolution is implemented, here is what I can do that I cannot do today:

1. **Host a mixed-reality adventure** where a player encounters both real historical figures and fictional characters, with the narrator seamlessly blending them while maintaining internal awareness of what is real and what is invented.

2. **Narrate a multi-generational story** using narrative arcs that span eras, with the dramatic structure explicit rather than implied, allowing me to modulate emotional register based on where the player is in the story.

3. **Deploy artifacts and legends** as narrative devices -- a player finds a mysterious object and investigates its origin across eras, or hears a legend and decides whether to pursue its truth.

4. **Maintain world consistency** using explicit world rules, continuity notes, and relationship data, rather than relying on my own (fallible) inference.

5. **Narrate across settings** when a character boards the ferry to Seattle, with historically grounded descriptions of the journey and destination rather than an awkward "you arrive in a city."

6. **Answer the question "Is this real?"** with precision, because every entry carries its provenance, and the narrator can choose to reveal or conceal that information based on the mode of play.

7. **Support multiple creative properties** on the same historical base, allowing a novelist, a game designer, and a tabletop GM to each build their own fictional layer without interfering with each other.

The history is the bedrock. The fiction is the forest that grows from it. This system lets us tend both without confusing the roots with the branches.

---

*Prepared by the AI Narrator Agent for the Planning Sprint, 2026-03-03.*
*Addresses user request for evolving the Writer's Research Companion into a worldbuilding platform.*
