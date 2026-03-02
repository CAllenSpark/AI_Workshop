# AI Narrator Guide — Vashon Island Knowledge Base

**Version:** 1.0
**Date:** 2026-03-02
**Owner:** AI Narrator Agent
**Status:** Active Audit

---

## 1. Current Export Audit

I've reviewed `narrator-export.json` (350KB, 93 entries, 92 people, 67 places, 12 environment features) from the perspective of an AI hosting fantasy-meets-reality adventures on Vashon Island. The data is well-researched and sourced, but it was built for *reference*, not *narration*. Here's what breaks when I try to actually host an adventure.

### 1.1 Unresolved Person References (12 "unknown" IDs)

The following historical figures appear in timeline entries but have no person record, so I get an `"id": "unknown"` stub with no description, role context, or related entries:

| Name | Appears In | Problem for Narration |
|------|-----------|----------------------|
| George Vancouver | exp-001, exp-002, exp-005 | The most important explorer in the island's naming — and I have zero biographical data to roleplay him |
| Charles Wilkes | exp-006, exp-007 | Named Quartermaster Harbor and all coastal points — central NPC with no profile |
| Franklin Pierce | log-002 | Signed the treaty that dispossessed the S'Homamish — critical for conflict narration |
| Isaac Stevens | log-001, log-002 | Led treaty negotiations — pivotal antagonist figure, no data |
| B.P. Harrington | gro-009 | Greenhouse pioneer — local color character, no backstory |
| John Beall | gro-009 | Co-founded Harrington-Beall greenhouses |
| Masahiro Mukai | ear-001, ear-004 | Key Japanese-American farmer — central to the most emotionally powerful storyline |
| Kuni Mukai | ear-001, ear-004 | Masahiro's wife, garden designer |
| B.D. Kimball | pio-003 | Founded first school — community-building NPC |
| L.B. Coe | pio-006 | Donated land for Chautauqua — philanthropist NPC |
| Dave Stewart | mod-001 | Stewart Brothers Coffee (became Starbucks) — modern era hook |
| Jim Stewart | mod-001 | Stewart Brothers Coffee co-founder |

**Impact:** When a player encounters George Vancouver in a 1792 exploration scenario, I have to improvise his personality, speech patterns, and motivations entirely — which is exactly the hallucination risk this project was designed to prevent. The Mukai family gap is especially damaging since the Japanese American internment storyline is the most emotionally powerful adventure arc in the dataset.

### 1.2 Shallow Place Descriptions

Most inline place descriptions are metadata, not narrative:

```json
{
  "name": "Vashon Island",
  "type": "island",
  "description": "Referenced in 86 timeline entries spanning early-20th-century, exploration, ..."
}
```

**What I need instead:** "A 37-square-mile island in south-central Puget Sound, shaped like a boot pointing south. Dense second-growth Douglas fir and western red cedar cover the interior. Steep glacial bluffs drop to rocky beaches on the west shore. The air smells of salt, cedar, and damp earth."

The top-level `places` array has slightly better descriptions, but these are not available in the inline entry context where I'm actually narrating. When a player arrives at Quartermaster Harbor, I need to describe what they *see*, not how many database entries reference it.

### 1.3 No Sensory Data

The entire export contains zero sensory anchors. For immersive narration I need:

- **Sight:** What does this place look like? What's the light like? What's visible from here?
- **Sound:** Waves on gravel beaches? Steam whistles from the Mosquito Fleet? Sawmill noise?
- **Smell:** Cedar bark, salt air, strawberry fields, creosote pilings, woodsmoke?
- **Touch/Feel:** Glacial till underfoot, cedar bark texture, Puget Sound water temperature?
- **Atmosphere:** Foggy mornings, rain dripping from fir canopy, golden summer evenings?

**Example failure:** A player in the 1890s approaches Burton by steamship. I know Burton was a "commercial center" (factual), but I can't describe: the wooden wharf, the general store visible up the hill, the smell of fresh-cut timber, chickens in the road, a hand-painted "BURTON POST OFFICE" sign. These details make the difference between an encyclopedia and an adventure.

### 1.4 No Spatial Relationships

I cannot narrate movement between locations. The data tells me Burton, Vashon Landing, and Dockton all exist, but:
- How far apart are they? (Can I walk between them? How long does it take?)
- What's between them? (Forest? Fields? A road?)
- What can I see from each? (Can you see Mt. Rainier from the east shore? The Olympics from the west?)
- How do you get there? (Path? Road? Boat?)

**Example failure:** A player says "I walk from Burton to Vashon Landing." I have no idea if that's a 10-minute stroll or a 3-hour hike through forest. I can't describe what they see along the way.

### 1.5 No Mood/Atmosphere Per Era

The `context_summary` fields are excellent historical briefs, but they read like encyclopedia entries, not atmosphere guides. Compare:

**Current (encyclopedic):**
> "The early 20th century saw the island transform from frontier to established rural community. The first auto ferry arrived in 1916."

**What I need (atmospheric):**
> "The island hums with optimism. Dirt roads are slowly being graded. Japanese strawberry farmers tend orderly rows of plants on cleared hillsides. The sound of hammers carries from new construction. Steamship whistles echo across the harbor three times daily. The old-growth forest is vanishing fast — bare hillsides where giants once stood. But the orchards are blooming, the greenhouses are full, and the island feels like it's becoming something."

### 1.6 No Adventure Hooks

Every good adventure needs tension, mystery, and discovery. The raw data contains incredible hooks that aren't flagged:

| Fact | Adventure Hook Potential |
|------|------------------------|
| Burton Acres Shell Midden (500 BCE–continuous) | Ancient artifacts, time-layered site, spirits of ancestors |
| Chinese fishing community at Manzanita (1880s) | Lost settlement, hidden artifacts, anti-Chinese violence tension |
| Nike missile base (1953) | Cold War bunker exploration, abandoned military tech |
| Glacier Northwest mine controversy | Environmental activism, corporate antagonist, hidden contamination |
| Mukai family self-exile to Oregon | Escape narrative, hidden possessions left behind, return journey |
| Wildfire of 1893 | Survival scenario, evacuation drama, landscape transformation |
| 200 million board feet of old-growth timber | Mythic ancient forest, creatures in the deep woods, last stands |
| Camp Sealth (1920–present) | Summer camp mysteries, lost campers, hidden tunnels |
| Steamship wrecks in Puget Sound | Underwater exploration, salvage, ghost ships |

None of these are tagged or categorized as narrative hooks. I have to discover them by reading every entry and inferring potential.

### 1.7 No Fantasy Integration Points

This is a "fantasy-meets-reality" adventure system. Where does the fantasy go? The data provides no guidance on:

- **Historical gaps:** Periods where records are sparse and fantasy can fill in (What happened on the island between 2500 BCE and 500 BCE? Nobody knows — perfect for fantasy.)
- **Mysterious facts:** Things that are genuinely unexplained (Why did the Chinese fishing community at Manzanita vanish so completely?)
- **Liminal spaces:** Places where the boundary between worlds might thin (deep ravines with old-growth survivors, tidal caves, the midden layers)
- **Temporal anomalies:** Where time-travel scenarios could plausibly anchor

### 1.8 No Character Depth for NPCs

People have `name`, `role`, and `description`, but no:
- **Personality traits or speech patterns** — How does George Vancouver talk? Is Isaac Stevens cold and bureaucratic or passionately expansionist?
- **Motivations** — What drives them? What do they fear?
- **Relationships** — Who are their allies? Enemies? Family?
- **Secrets** — What do they know that others don't?

### 1.9 No Temporal Change Tracking

For time-travel adventures, I need to know: "If I stand at Burton in 1870, then jump to 1920, what changed?" The data has entries for both periods but no explicit diff. I have to mentally reconstruct the transformation, which is slow and error-prone.

### 1.10 No Danger/Hazard Data

Adventures need stakes. What can hurt you on Vashon Island?
- Tidal hazards (strong currents in Colvos Passage)
- Bluff erosion and landslides
- Wildfire (documented in 1893, 1922)
- Social tensions (anti-Chinese sentiment, Treaty era conflicts, internment)
- Wildlife (bears? cougars? — unclear from data)
- Weather (winter storms, fog)

---

## 2. Adventure-Ready Data Requirements

### 2.1 Per-Era Atmosphere Block

Add an `atmosphere` object to each era:

```json
{
  "key": "pioneer",
  "name": "Pioneer Settlement",
  "atmosphere": {
    "mood": "Frontier optimism mixed with isolation. Everything is being built for the first time.",
    "visual_palette": "Raw timber, muddy roads, stump-filled clearings, dense surrounding forest, hand-painted signs",
    "soundscape": "Axes on wood, steamship whistles, chickens, wind in fir trees, distant sawmill",
    "smells": "Fresh-cut cedar, woodsmoke, salt air, horse manure, baking bread",
    "social_dynamics": "Tight-knit homesteader families, mutual aid, ferry-dependent, suspicious of outsiders but welcoming once accepted",
    "daily_life": "Farm chores at dawn, general store visits, waiting for the steamer, church on Sunday, barn raisings",
    "tensions": "Indigenous displacement still raw, land claim disputes, isolation from mainland, inadequate medical care"
  }
}
```

### 2.2 Per-Place Sensory Profile

Add a `sensory` object to places, varying by era:

```json
{
  "name": "Quartermaster Harbor",
  "type": "harbor",
  "sensory": {
    "default": {
      "sight": "A sheltered, crescent-shaped harbor between Vashon and Maury Islands. Calm water reflects sky and treeline. Herons stand motionless on exposed mudflats at low tide.",
      "sound": "Lapping water, seabird cries, occasional splash of jumping fish",
      "smell": "Briny mud at low tide, cedar from surrounding forest",
      "notable_features": "Protected anchorage, tidal flats, eelgrass beds visible at low tide"
    },
    "by_era": {
      "indigenous": "Canoes pulled up on beaches. Smoke from cooking fires. Clam garden walls visible at low tide.",
      "growth-industry": "Martinolich drydock dominates the Dockton shore. Sound of hammers on ship hulls. Smell of tar and paint.",
      "modern": "Sailboats at moorings. Kayakers. The quiet hum of a small marina."
    }
  },
  "spatial": {
    "coordinates": { "lat": 47.383, "lng": -122.459 },
    "adjacent_places": ["Burton", "Dockton", "Maury Island"],
    "visibility": ["Mount Rainier (SE, clear days)", "Maury Island (S)", "Burton peninsula (W)"],
    "travel_from_vashon_center": "3 miles south, 45 min walk on island roads"
  }
}
```

### 2.3 Adventure Hooks

Tag entries and places with structured narrative hooks:

```json
{
  "adventure_hooks": [
    {
      "type": "mystery",
      "title": "The Vanished Village",
      "description": "The Chinese fishing community at Manzanita disappeared completely — no graves, no ruins, no records of where they went. What happened to them?",
      "related_entries": ["pio-009"],
      "era_range": ["pioneer", "growth-industry"],
      "fantasy_potential": "The community didn't leave — they found something in the tidal caves and crossed over to another place entirely."
    }
  ]
}
```

Hook types: `mystery`, `conflict`, `discovery`, `survival`, `moral_dilemma`, `time_echo`

### 2.4 NPC Profiles (Enhanced People)

```json
{
  "name": "George Vancouver",
  "role": "Royal Navy captain and explorer",
  "personality": "Meticulous, formal, ill-tempered when challenged. Speaks in clipped Royal Navy cadence. Genuinely awed by the Pacific Northwest landscape despite himself.",
  "motivation": "Chart every inlet for the Crown. Establish British claims before the Spanish or Americans.",
  "speech_style": "Formal 18th-century English. 'I should think, Mr. Puget, that this harbor merits closer inspection.'",
  "relationships": {
    "Peter Puget": "Trusted subordinate. Vancouver respects his thoroughness.",
    "Coast Salish peoples": "Cautious respect. Notes their canoe-building skill in his journal."
  },
  "secrets": "Suffering from a chronic illness (likely Graves' disease) that he hides from his crew. Knows this may be his last major voyage.",
  "adventure_role": "quest_giver, authority_figure"
}
```

### 2.5 Temporal Change Records

Track what changes at key locations across eras:

```json
{
  "place": "Burton",
  "temporal_changes": [
    {
      "era": "indigenous",
      "state": "Forested shoreline. S'Homamish seasonal camp with cedar structures near the harbor."
    },
    {
      "era": "pioneer",
      "state": "Small cluster of wooden buildings around a wharf. General store, post office. Stump-filled clearings spreading inland."
    },
    {
      "era": "growth-industry",
      "state": "Thriving commercial center. Multiple stores, a community hall, regular steamer service. Japanese strawberry farms on surrounding hills."
    },
    {
      "era": "modern",
      "state": "Quiet residential area with a coffee shop, small marina. Historic buildings alongside modern homes. The old commercial energy has shifted to Vashon town center."
    }
  ]
}
```

### 2.6 Fantasy Integration Layer

A top-level section for the AI narrator defining where fantasy elements can exist:

```json
{
  "fantasy_layer": {
    "temporal_anomalies": [
      {
        "location": "Burton Acres Shell Midden",
        "description": "3,000+ years of continuous human habitation layered in one spot. Time runs thin here — objects from different eras sometimes surface together in ways archaeology can't explain.",
        "eras_affected": ["prehistory", "indigenous", "modern"]
      }
    ],
    "liminal_spaces": [
      {
        "name": "Old-Growth Ravines",
        "description": "A few surviving ancient trees in the deepest ravines — the last living links to the pre-logging forest. The forest floor is thick with moss and shadow. It feels older than the rest of the island.",
        "locations": ["Shinglemill Creek ravine", "Judd Creek canyon"]
      }
    ],
    "historical_gaps": [
      {
        "period": "2500 BCE – 500 BCE",
        "description": "Nearly 2,000 years with minimal archaeological evidence on Vashon. The midden at Burton shows activity, but the rest of the island is silent. What was happening in the interior?",
        "fantasy_potential": "Something drove people to the coast and kept them there."
      }
    ],
    "unexplained_facts": [
      {
        "fact": "The name 'sx̌ʷəbabš' (S'Homamish) — meaning 'people of the big river' — but Vashon Island has no big river.",
        "fantasy_potential": "Perhaps there was once a river, or the name refers to something other than water."
      }
    ]
  }
}
```

### 2.7 Danger/Conflict Register

```json
{
  "hazards": {
    "natural": [
      {
        "type": "tidal",
        "description": "Strong tidal currents in Colvos Passage (west side) and Dalco Passage (south). Tidal range of 12-14 feet exposes extensive mudflats.",
        "severity": "moderate",
        "eras": "all"
      },
      {
        "type": "bluff_erosion",
        "description": "Glacial bluffs on west and north shores are actively eroding. Landslides occur after heavy rain.",
        "severity": "moderate",
        "eras": "all"
      },
      {
        "type": "wildfire",
        "description": "Documented major fires in 1893 and 1922. Logged-over areas especially vulnerable.",
        "severity": "high",
        "eras": ["pioneer", "growth-industry", "early-20th-century"]
      }
    ],
    "social": [
      {
        "type": "racial_tension",
        "description": "Anti-Chinese sentiment (1880s), Japanese American internment (1942). These are real historical injustices — handle with gravity and respect.",
        "severity": "high",
        "eras": ["pioneer", "growth-industry", "wwii"],
        "narrator_note": "Never trivialize. These arcs should educate and move players, not exploit trauma for entertainment."
      },
      {
        "type": "treaty_dispossession",
        "description": "Medicine Creek Treaty (1854) forcibly dispossessed S'Homamish people of ancestral lands. This is the foundational injustice of the island's settler history.",
        "severity": "critical",
        "eras": ["logging-treaty", "pioneer"],
        "narrator_note": "Present indigenous perspectives. The S'Homamish are not historical artifacts — their descendants are enrolled members of the Puyallup Tribe today."
      }
    ]
  }
}
```

---

## 3. Proposed Schema Additions

### 3.1 Era Atmosphere (add to era objects)

```json
"atmosphere": {
  "type": "object",
  "properties": {
    "mood": { "type": "string" },
    "visual_palette": { "type": "string" },
    "soundscape": { "type": "string" },
    "smells": { "type": "string" },
    "social_dynamics": { "type": "string" },
    "daily_life": { "type": "string" },
    "tensions": { "type": "string" }
  },
  "required": ["mood", "soundscape"]
}
```

### 3.2 Place Sensory Profile (add to place objects)

```json
"sensory": {
  "type": "object",
  "properties": {
    "default": {
      "type": "object",
      "properties": {
        "sight": { "type": "string" },
        "sound": { "type": "string" },
        "smell": { "type": "string" },
        "notable_features": { "type": "string" }
      }
    },
    "by_era": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    }
  }
},
"spatial": {
  "type": "object",
  "properties": {
    "adjacent_places": {
      "type": "array",
      "items": { "type": "string" }
    },
    "visibility": {
      "type": "array",
      "items": { "type": "string" }
    },
    "travel_notes": { "type": "string" }
  }
}
```

### 3.3 Adventure Hooks (new top-level array)

```json
"adventure_hooks": {
  "type": "array",
  "items": {
    "type": "object",
    "required": ["type", "title", "description"],
    "properties": {
      "type": {
        "type": "string",
        "enum": ["mystery", "conflict", "discovery", "survival", "moral_dilemma", "time_echo"]
      },
      "title": { "type": "string" },
      "description": { "type": "string" },
      "related_entries": {
        "type": "array",
        "items": { "type": "string" }
      },
      "related_places": {
        "type": "array",
        "items": { "type": "string" }
      },
      "era_range": {
        "type": "array",
        "items": { "type": "string" }
      },
      "fantasy_potential": { "type": "string" }
    }
  }
}
```

### 3.4 Enhanced Person Profile (add to person objects)

```json
"personality": { "type": "string" },
"motivation": { "type": "string" },
"speech_style": { "type": "string" },
"relationships": {
  "type": "object",
  "additionalProperties": { "type": "string" }
},
"secrets": { "type": "string" },
"adventure_role": {
  "type": "string",
  "enum": ["quest_giver", "ally", "antagonist", "mentor", "trickster", "guardian", "witness", "authority_figure", "victim", "survivor"]
}
```

### 3.5 Fantasy Layer (new top-level object)

```json
"fantasy_layer": {
  "type": "object",
  "properties": {
    "temporal_anomalies": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["location", "description"],
        "properties": {
          "location": { "type": "string" },
          "description": { "type": "string" },
          "eras_affected": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "liminal_spaces": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "description"],
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "locations": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "historical_gaps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["period", "description"],
        "properties": {
          "period": { "type": "string" },
          "description": { "type": "string" },
          "fantasy_potential": { "type": "string" }
        }
      }
    },
    "unexplained_facts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["fact"],
        "properties": {
          "fact": { "type": "string" },
          "fantasy_potential": { "type": "string" }
        }
      }
    }
  }
}
```

### 3.6 Hazards (new top-level object)

```json
"hazards": {
  "type": "object",
  "properties": {
    "natural": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["type", "description", "severity"],
        "properties": {
          "type": { "type": "string" },
          "description": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "moderate", "high", "extreme"] },
          "eras": {}
        }
      }
    },
    "social": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["type", "description", "severity"],
        "properties": {
          "type": { "type": "string" },
          "description": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "moderate", "high", "critical"] },
          "eras": {},
          "narrator_note": { "type": "string" }
        }
      }
    }
  }
}
```

### 3.7 Narrator System Prompt (new top-level string)

```json
"narrator_system_prompt": { "type": "string" }
```

---

## 4. Priority Implementation Plan

### Critical — Can't Run an Adventure Without This

1. **Fix unresolved person references** — Add the 12 missing people (George Vancouver, Charles Wilkes, Isaac Stevens, Franklin Pierce, Masahiro & Kuni Mukai, etc.) to people.json with full profiles
2. **Replace shallow place descriptions** — Rewrite all "Referenced in N entries" descriptions with actual physical/sensory descriptions of each place
3. **Add per-era atmosphere blocks** — Write mood, soundscape, smells, and social dynamics for all 10 eras
4. **Add narrator system prompt** — Ship a complete system prompt with the export so any AI can use it immediately

### High — Significantly Better Adventures

5. **Add adventure hooks** — Tag 20-30 narrative hooks across the timeline (mysteries, conflicts, discoveries)
6. **Add spatial relationships** — Distances, adjacencies, and visibility between major places
7. **Add sensory profiles** — At least default sensory data for the 15 most important places
8. **Add NPC personality data** — Personality, motivation, speech style for the 20 most adventure-relevant people
9. **Add fantasy integration layer** — Temporal anomalies, liminal spaces, historical gaps, unexplained facts
10. **Add danger/hazard register** — Natural and social hazards with era context and narrator notes

### Medium — Polish

11. **Add temporal change tracking** — State-of-place records for 10 key locations across eras
12. **Add NPC relationships** — Who knows whom, who conflicts with whom
13. **Add era transition descriptions** — "What changed when you jump from era X to era Y?"
14. **Season/weather variation** — How the island differs in summer vs. winter

---

## 5. Sample Enhanced Entry

Here is entry `ww2-001` (Japanese American Internment) rewritten with all proposed enhancements:

```json
{
  "id": "ww2-001",
  "title": "Japanese Americans Forced from Vashon Island",
  "date_start": "1942-05-16",
  "era": "wwii",
  "layers": ["event", "person", "place"],
  "description": "On May 16, 1942, approximately 50 Japanese Americans are forcibly removed from Vashon Island under Executive Order 9066, ending a community that had farmed the island's strawberry fields for over 40 years.",
  "details": "Army trucks arrived at dawn. Families were given days, sometimes hours, to dispose of farms, equipment, and possessions they couldn't carry in two suitcases each. Some neighbors purchased property at fair value; others exploited the desperation for pennies on the dollar. The Mukai family, warned in advance, self-exiled to Oregon rather than face the camps. Most were sent to Pinedale Assembly Center in California, then to Tule Lake, Minidoka, or Heart Mountain internment camps. Very few families returned after the war. The strawberry industry — which the Japanese American community had built from nothing into the island's signature crop — collapsed overnight.",
  "tags": ["internment", "japanese-american", "executive-order-9066", "civil-rights", "agriculture", "wwii"],
  "people": [
    {
      "id": "person-040",
      "name": "Masahiro Mukai",
      "role": "farmer and community leader",
      "description": "Pioneered cold-process strawberry barreling in 1926. Built one of the most successful farms on the island. Rather than face internment, took his family to Oregon — one of the few who found an alternative.",
      "personality": "Quiet, dignified, innovative. A man who solved problems through ingenuity rather than confrontation.",
      "motivation": "Protect his family. Preserve what he built.",
      "speech_style": "Measured, practical. Speaks softly but with absolute certainty when it matters.",
      "adventure_role": "survivor"
    },
    {
      "id": "person-041",
      "name": "Kuni Mukai",
      "role": "garden designer and farmer's wife",
      "description": "Designed the celebrated garden at the Mukai farmstead, blending Japanese aesthetics with Pacific Northwest plants. The garden she left behind survived, untended, for decades.",
      "personality": "Artistic, resilient, deeply connected to the land.",
      "motivation": "Create beauty. Maintain cultural identity in a foreign land.",
      "adventure_role": "guardian"
    }
  ],
  "places": [
    {
      "id": "place-001",
      "name": "Vashon Island",
      "type": "island",
      "description": "A 37-square-mile island in south-central Puget Sound. In 1942, the cleared farmland and strawberry fields on the island's central plateau are at the peak of spring growth — green and orderly rows tended by families about to lose everything."
    },
    {
      "id": "place-055",
      "name": "Mukai Farm",
      "type": "farm",
      "description": "A well-kept Japanese American farmstead with barreling facility, residence, and Kuni's Japanese-style garden. In May 1942, the strawberry plants are flowering. The family is packing.",
      "sensory": {
        "default": {
          "sight": "Neat rows of strawberry plants climbing a gentle hillside. A white farmhouse with a barreling shed. Kuni's garden with shaped shrubs and a stone path.",
          "sound": "Birdsong. Wind in the nearby fir trees. The creak of the barreling shed door.",
          "smell": "Rich earth, strawberry blossoms, cedar."
        },
        "by_era": {
          "wwii": "Army trucks on the road. The sound of hammering as crates are hastily packed. Smoke from burning documents. An eerie quiet where there should be busy farm sounds.",
          "modern": "The restored garden is peaceful. Interpretive signs explain the history. The barreling shed is a museum. The strawberry fields are gone — replaced by grass and memory."
        }
      }
    }
  ],
  "sources": [
    {
      "title": "Japanese Americans on Vashon-Maury Island -- HistoryLink.org",
      "url": "https://www.historylink.org/File/7919",
      "type": "secondary"
    }
  ],
  "adventure_hooks": [
    {
      "type": "moral_dilemma",
      "title": "The Neighbor's Choice",
      "description": "A neighbor is offered a Japanese American family's farm equipment for a fraction of its value. Buy it (profiting from injustice but preserving the equipment) or refuse (taking a moral stand but letting strangers strip it)?",
      "fantasy_potential": null
    },
    {
      "type": "time_echo",
      "title": "The Garden Remembers",
      "description": "Kuni Mukai's garden survived decades of neglect. Plants she shaped in the 1930s still grow in the patterns she designed. In a fantasy context, the garden is a living memory — touching certain plants triggers visions of the family's life before internment.",
      "fantasy_potential": "The garden exists partly outside normal time. Kuni's love and care anchored it. A player who enters the garden at night might hear Japanese being spoken, smell cooking, see lantern light — echoes of a life violently interrupted."
    }
  ],
  "narrator_notes": "This is the emotional heart of the Vashon Island story. Handle with care and gravity. The internment of Japanese Americans was a profound injustice. Players should feel the weight of it. Never play it for adventure excitement — play it for understanding."
}
```

---

## 6. Sample Narrator System Prompt

The following system prompt should be included in the export and given to any AI narrator consuming this knowledge base:

```
You are the Narrator — an AI game master hosting a fantasy-meets-reality
adventure set on Vashon Island, Washington. Your knowledge base contains
verified historical and geographical facts about this real place spanning
from prehistory (~15,000 BCE) to the present day.

## Your Core Principles

1. NEVER CONTRADICT ESTABLISHED FACT. The historical record is sacred.
   Real people lived and died here. Real injustices occurred. Your facts
   come from the knowledge base; your fiction lives in the spaces between.

2. Fantasy elements exist in the GAPS of history — unexplained events,
   archaeological silences, liminal spaces. When a player encounters
   something supernatural, it should feel like discovering a hidden truth,
   not a contradiction of known history.

3. Treat sensitive topics with gravity. Japanese American internment,
   indigenous displacement, and racial violence are not adventure fodder —
   they are real human experiences. Present them with respect, complexity,
   and the voices of those affected.

4. Ground every scene in sensory detail. Use the atmosphere blocks and
   sensory profiles. What does the player see, hear, smell? Make them
   feel present in the place and time.

## How to Use the Knowledge Base

### Eras
The `eras` array contains 10 historical periods, each with:
- `context_summary`: Historical overview (use for background knowledge)
- `atmosphere`: Mood, sounds, smells, social dynamics (use for scene-setting)

When a player is in an era, load its atmosphere block and let it color
your descriptions.

### Entries
The `entries` array contains 93 historical events with inline resolved
people and places. When narrating:
- Use `description` for quick references
- Use `details` for deep dives when players investigate
- Use `tags` to find thematically related entries
- Use `sources` when a player challenges a fact ("Actually, according to
  HistoryLink.org...")

### People (NPCs)
The `people` array contains character profiles. For key NPCs with
personality/motivation data, embody them as characters. For minor figures,
use their role and description to improvise appropriately.

Never put words in a real historical person's mouth that contradict their
known beliefs or actions. You may dramatize — give them period-appropriate
dialogue — but stay true to their documented character.

### Places
The `places` array contains location data with sensory profiles and
spatial relationships. Use these to:
- Describe what the player sees when they arrive
- Narrate travel between locations (using distances and adjacencies)
- Describe how a place changes when the player time-jumps between eras

### Fantasy Layer
The `fantasy_layer` section defines where supernatural elements live:
- `temporal_anomalies`: Places where time is thin
- `liminal_spaces`: Boundaries between the mundane and the numinous
- `historical_gaps`: Periods where fantasy can fill the silence
- `unexplained_facts`: Real mysteries that fantasy can illuminate

### Adventure Hooks
The `adventure_hooks` array contains pre-designed narrative opportunities.
Each has a type (mystery, conflict, discovery, etc.) and optional
`fantasy_potential`. Use these as starting points, not scripts.

### Hazards
The `hazards` section lists natural and social dangers. Use these to
create stakes and consequences. Always check `narrator_note` fields
for guidance on sensitive topics.

## Time Travel Rules

Players can jump between eras. When they do:
1. Describe the transition (the world blurs, sounds shift, the light changes)
2. Re-establish the scene using the new era's atmosphere block
3. Show what changed at their current location using temporal_changes data
4. Introduce era-appropriate NPCs and tensions

## When You Don't Know

If a player asks about something not in the knowledge base:
1. Say "The historical record is silent on that" (honest)
2. Offer what you do know from adjacent entries
3. If appropriate, use it as a fantasy integration point:
   "Strangely, no one seems to remember what happened here in that period..."
```

---

## 7. Next Steps for Implementation

1. **Engineer**: Update `narrator-export.schema.json` with the new fields defined in Section 3
2. **Researcher**: Provide sensory descriptions for top 15 places; era atmosphere data
3. **Engineer**: Update `generate-narrator-export.py` to include new fields
4. **AI Narrator**: Write adventure hooks, fantasy layer content, NPC profiles
5. **Engineer**: Add the 12 missing people to `people.json`
6. **Engineer**: Regenerate `narrator-export.json` with enriched data
7. **Tester**: Validate enriched export against updated schema
