# Technical Architecture Plan: Creative Layer & Multi-Setting Evolution

**Author:** Engineer
**Date:** 2026-03-03
**Status:** Planning Draft
**Scope:** Schema evolution, data architecture, filter/view extensions, search index changes, migration strategy

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Principles](#2-design-principles)
3. [Schema Evolution](#3-schema-evolution)
4. [Data Architecture for Multi-Setting](#4-data-architecture-for-multi-setting)
5. [People Timeline Data Model](#5-people-timeline-data-model)
6. [Filter and View Evolution](#6-filter-and-view-evolution)
7. [Search Index Evolution](#7-search-index-evolution)
8. [Narrator Export Evolution](#8-narrator-export-evolution)
9. [Migration Strategy](#9-migration-strategy)
10. [Implementation Phases](#10-implementation-phases)
11. [Open Questions](#11-open-questions)

---

## 1. Executive Summary

The Writer's Research Companion currently serves as a historical research tool for a single setting (Vashon Island). This plan describes how to evolve the system so that creative/fictional entries can coexist with historical ones, multiple geographic settings can be loaded simultaneously, and a people-timeline view can show lifespans of both real and fictional figures against the historical backdrop.

The guiding constraint is backward compatibility: the existing 111 timeline entries, 113 people, 67 places, 12 environment features, 122 passing tests, and the narrator export pipeline must continue to work without modification. All new fields are additive and optional. Existing data files remain valid under the evolved schemas through careful use of JSON Schema `default` values and conditional requirements.

### Current System Snapshot

| Metric | Value |
|--------|-------|
| Timeline entries | 111 (IDs: `pre-001` through `mod-016`) |
| People | 113 (IDs: `person-001` through `person-113`) |
| Places | 67 (IDs: `place-001` through `place-067`) |
| Environment features | 12 (IDs: `env-001` through `env-012`) |
| Search index records | 303 |
| Eras | 10 (prehistory through modern) |
| Layers | 4 (event, person, place, environment) |
| Tests | 122 passing across 10 files |
| Production build | 252KB JS, 29KB CSS |

---

## 2. Design Principles

1. **Additive-only schema changes.** No existing required field is removed or renamed. New fields use defaults so that old data validates without modification.

2. **Classification is a spectrum, not a binary.** Entries can be `historical`, `creative`, or `hybrid` (fictional characters placed into real historical events). This three-way classification avoids forcing a false binary on entries that blend fact and fiction.

3. **Visual distinction is first-class.** The creative layer must be visually separable from the historical layer at every zoom level and in every view mode. This is not just a filter dimension; it affects marker rendering, card styling, density indicators, and export formatting.

4. **Settings are namespaces, not silos.** A character who travels from Vashon to Seattle produces entries that reference both settings. The data model supports cross-setting references rather than requiring duplication.

5. **Sources are conditional, not optional.** Historical entries continue to require sources. Creative entries require a `creative_property` instead. The schema enforces this through conditional requirements rather than making everything optional.

6. **The narrator gets everything.** The export format must clearly separate historical ground truth from creative embellishment so that an AI narrator can distinguish "this actually happened" from "this is part of the story."

---

## 3. Schema Evolution

### 3.1 Shared Classification Fields (All Entity Types)

Every entity type (TimelineEntry, Person, Place, EnvironmentFeature) gains the same base classification fields. This ensures consistent filtering and visual treatment across the system.

#### New Fields

```jsonc
// Added to all entity schemas
{
  "classification": {
    "type": "string",
    "description": "Whether this entry represents historical fact, creative fiction, or a blend",
    "enum": ["historical", "creative", "hybrid"],
    "default": "historical"
  },
  "creative_property": {
    "type": "string",
    "description": "Name of the creative work this entry belongs to (e.g., 'The Vashon Chronicles'). Required when classification is 'creative' or 'hybrid'. Omit for purely historical entries."
  },
  "setting": {
    "type": "string",
    "description": "Primary geographic setting this entry belongs to (e.g., 'vashon-island', 'seattle', 'tacoma'). Defaults to the file's parent directory setting.",
    "default": "vashon-island"
  },
  "settings": {
    "type": "array",
    "description": "All settings this entry is relevant to. Used for cross-setting references. If omitted, derived from the singular 'setting' field.",
    "items": { "type": "string" }
  }
}
```

#### Conditional Source Requirements

The current schema requires `sources` with `minItems: 1` on every timeline entry. This must change to support creative entries that have no historical sources, while continuing to enforce sources on historical entries.

**Approach: JSON Schema `if/then/else`**

```jsonc
{
  "if": {
    "properties": { "classification": { "const": "historical" } }
  },
  "then": {
    "required": ["sources"],
    "properties": {
      "sources": { "minItems": 1 }
    }
  },
  "else": {
    "if": {
      "properties": { "classification": { "const": "hybrid" } }
    },
    "then": {
      "required": ["sources", "creative_property"],
      "properties": {
        "sources": { "minItems": 1 }
      }
    },
    "else": {
      "required": ["creative_property"]
    }
  }
}
```

This means:
- `historical` entries: `sources` required (at least 1), `creative_property` optional
- `hybrid` entries: both `sources` (at least 1) and `creative_property` required
- `creative` entries: `creative_property` required, `sources` optional (can still cite inspiration)

For the TypeScript layer, we update the `TimelineEntry` interface so that `sources` becomes `Source[]` (not optional in the type, but can be an empty array for creative entries). Validation enforcement moves to the loader.

### 3.2 Timeline Entry Schema Evolution

#### New Layers

The `layers` enum expands to support creative entry types:

```jsonc
{
  "layers": {
    "items": {
      "enum": [
        // Existing
        "event", "person", "place", "environment",
        // New: creative layers
        "narrative",    // Plot events, story beats
        "character",    // Character introductions, arcs
        "world-rule"    // Fictional world-building rules (e.g., "magic works here")
      ]
    }
  }
}
```

**Rationale for each new layer:**

| Layer | Purpose | Example |
|-------|---------|---------|
| `narrative` | Plot-level story events that happen at a specific point in time | "Elena discovers the hidden cave beneath Maury Island" |
| `character` | Character introduction, transformation, or departure events | "Captain Hargrave arrives on the midnight ferry" |
| `world-rule` | Fictional rules, constraints, or lore that apply across time | "The tidal pools at Point Robinson reveal visions during solstice" |

#### Creative Metadata (New Optional Block)

```jsonc
{
  "creative_metadata": {
    "type": "object",
    "description": "Metadata specific to creative/fictional entries. Omit for purely historical entries.",
    "properties": {
      "narrative_function": {
        "type": "string",
        "description": "What role this entry serves in the narrative",
        "enum": [
          "inciting_incident",
          "rising_action",
          "climax",
          "falling_action",
          "resolution",
          "backstory",
          "world_building",
          "character_development",
          "foreshadowing",
          "red_herring",
          "subplot"
        ]
      },
      "plot_significance": {
        "type": "string",
        "description": "Free-text explanation of why this matters to the story",
        "enum": ["critical", "major", "supporting", "minor", "atmospheric"]
      },
      "character_arc": {
        "type": "string",
        "description": "If this entry marks a character arc beat, describe which arc and what changes"
      },
      "themes": {
        "type": "array",
        "description": "Thematic tags for this entry (e.g., 'identity', 'belonging', 'loss')",
        "items": { "type": "string" }
      },
      "depends_on": {
        "type": "array",
        "description": "IDs of entries that must occur before this one in the narrative",
        "items": { "type": "string" }
      },
      "enables": {
        "type": "array",
        "description": "IDs of entries that this event makes possible",
        "items": { "type": "string" }
      },
      "historical_anchor": {
        "type": "string",
        "description": "ID of the historical entry this creative entry is anchored to or inspired by"
      },
      "narrator_instructions": {
        "type": "string",
        "description": "Specific instructions for an AI narrator handling this entry (tone, emphasis, what to reveal/conceal)"
      }
    }
  }
}
```

**Why `depends_on` and `enables`:** These fields allow the system (and the narrator export) to represent causal chains in the narrative. A writer can trace the dependency graph of their plot. An AI narrator can understand which events must have occurred before it can introduce a new plot point.

**Why `historical_anchor`:** This is the key field for the "layering" concept. A creative entry anchored to `pio-005` (a real historical event) can be displayed directly adjacent to it on the timeline, visually showing how fiction interleaves with fact.

### 3.3 Person Schema Evolution

The Person schema needs the most significant expansion to support the people-timeline view and fictional characters.

#### New Fields

```jsonc
{
  // Classification fields (same as Section 3.1)
  "classification": { /* ... */ },
  "creative_property": { /* ... */ },
  "setting": { /* ... */ },
  "settings": { /* ... */ },

  // Lifespan fields (birth_year and death_year already exist)
  "birth_date": {
    "type": "string",
    "description": "Full birth date if known (ISO 8601). More precise than birth_year."
  },
  "death_date": {
    "type": "string",
    "description": "Full death date if known (ISO 8601). More precise than death_year."
  },
  "is_alive": {
    "type": "boolean",
    "description": "Whether this person is currently living. If true, death_year/death_date should be omitted.",
    "default": false
  },

  // Active period ranges (for people whose relevance spans specific intervals)
  "active_periods": {
    "type": "array",
    "description": "Time ranges when this person was active in the setting. Supports multiple periods (e.g., someone who left and returned).",
    "items": {
      "type": "object",
      "required": ["start", "label"],
      "properties": {
        "start": {
          "type": "string",
          "description": "Start of active period (ISO 8601 or approximate)"
        },
        "end": {
          "type": "string",
          "description": "End of active period (ISO 8601 or approximate). Omit if ongoing."
        },
        "label": {
          "type": "string",
          "description": "What they were doing during this period (e.g., 'farming on Vashon', 'serving in WWI')"
        },
        "setting": {
          "type": "string",
          "description": "Where they were during this period (setting key)"
        }
      }
    }
  },

  // Fictional character fields
  "fictional": {
    "type": "boolean",
    "description": "Whether this person is a fictional character. Redundant with classification=='creative' but useful for quick filtering.",
    "default": false
  },
  "character_profile": {
    "type": "object",
    "description": "Extended character profile for fictional characters or richly-developed historical figures",
    "properties": {
      "archetype": {
        "type": "string",
        "description": "Character archetype (e.g., 'reluctant hero', 'trickster', 'mentor')"
      },
      "motivation": {
        "type": "string",
        "description": "Core motivation driving this character"
      },
      "personality_traits": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Key personality traits"
      },
      "speech_style": {
        "type": "string",
        "description": "How this character speaks (dialect, formality, verbal tics)"
      },
      "appearance": {
        "type": "string",
        "description": "Physical description"
      },
      "relationships": {
        "type": "array",
        "description": "Named relationships to other people in the system",
        "items": {
          "type": "object",
          "required": ["person_id", "type"],
          "properties": {
            "person_id": {
              "type": "string",
              "description": "ID of the related person"
            },
            "type": {
              "type": "string",
              "description": "Relationship type",
              "enum": [
                "parent", "child", "spouse", "sibling",
                "mentor", "student", "ally", "rival",
                "employer", "employee", "colleague",
                "friend", "neighbor", "adversary"
              ]
            },
            "description": {
              "type": "string",
              "description": "Free-text description of the relationship"
            },
            "period": {
              "type": "string",
              "description": "When this relationship was active"
            }
          }
        }
      },
      "arc_summary": {
        "type": "string",
        "description": "One-paragraph summary of this character's narrative arc"
      },
      "secrets": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Things this character knows or hides that are plot-relevant"
      }
    }
  },

  // Contemporaries (computed, but can be overridden)
  "contemporaries": {
    "type": "array",
    "description": "IDs of other people whose lifespans overlap. Can be auto-computed or manually curated.",
    "items": { "type": "string" }
  }
}
```

#### Lifespan Visualization Fields

The people-timeline view needs numeric year values for rendering. These are computed at load time (like `parsedDates` for timeline entries) rather than stored in the schema:

```typescript
// New computed fields in the DataStore
interface PersonLifespan {
  personId: string;
  birthYear: number | null;      // numeric, negative for BCE
  deathYear: number | null;      // numeric, null if alive or unknown
  activePeriods: Array<{
    startYear: number;
    endYear: number | null;
    label: string;
    setting?: string;
  }>;
  classification: 'historical' | 'creative' | 'hybrid';
  fictional: boolean;
}
```

### 3.4 Place Schema Evolution

#### New Fields

```jsonc
{
  // Classification fields (same as Section 3.1)
  "classification": { /* ... */ },
  "creative_property": { /* ... */ },
  "setting": { /* ... */ },
  "settings": { /* ... */ },

  // New place types for fictional/regional use
  "type": {
    "enum": [
      // Existing types preserved...
      "island", "body-of-water", "waterway", "harbor", "peninsula",
      "beach", "geographic-point", "geographic-area", "wetland",
      "settlement", "heritage-site", "youth-camp", "public-park",
      "community-space", "business", "historic-site", "gathering-point",
      "ferry-terminal", "road", "internment-site", "military-site",
      "school", "mill-town", "fort", "territory", "region",
      // New types for creative/regional use
      "city",              // Seattle, Tacoma
      "neighborhood",      // Pioneer Square, Fremont
      "fictional-locale",  // Invented places
      "portal",            // Fantasy: threshold between worlds
      "hidden-place"       // Secret locations known only to certain characters
    ]
  },

  // Fictional place metadata
  "fictional_properties": {
    "type": "object",
    "description": "Properties specific to fictional or enhanced places",
    "properties": {
      "based_on": {
        "type": "string",
        "description": "ID of the real place this fictional place is based on (if any)"
      },
      "atmosphere": {
        "type": "string",
        "description": "The mood or feeling of this place"
      },
      "rules": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Special rules that apply in this place (for world-building)"
      },
      "accessibility": {
        "type": "string",
        "description": "How and when this place can be reached"
      }
    }
  }
}
```

### 3.5 Environment Feature Schema Evolution

Minimal changes needed. Environment features are predominantly historical/scientific, but a creative world might define fictional ecological or geological features.

```jsonc
{
  // Classification fields (same as Section 3.1)
  "classification": { /* ... */ },
  "creative_property": { /* ... */ },
  "setting": { /* ... */ },

  // New types for creative use
  "type": {
    "enum": [
      // Existing
      "geology", "ecology", "climate", "hydrology", "soil", "conservation",
      // New
      "magical",     // Fantasy: ley lines, enchanted groves
      "anomalous"    // Unexplained phenomena (bridges fact and fiction)
    ]
  }
}
```

### 3.6 Setting Registry Schema (New)

A new schema for the settings themselves. Each setting has metadata, geographic bounds, and relationships to other settings.

**File:** `research/schemas/setting.schema.json`

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "setting.schema.json",
  "title": "Setting",
  "description": "A geographic setting in the Writer's Research Companion",
  "type": "object",
  "required": ["id", "name", "type"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier matching the directory name (e.g., 'vashon-island')",
      "pattern": "^[a-z][a-z0-9-]*$"
    },
    "name": {
      "type": "string",
      "description": "Display name (e.g., 'Vashon Island, WA')"
    },
    "type": {
      "type": "string",
      "enum": ["primary", "secondary", "regional"],
      "description": "primary = full research depth, secondary = supporting context, regional = high-level overview"
    },
    "description": {
      "type": "string",
      "description": "Brief description of the setting and its relevance"
    },
    "geographic_bounds": {
      "type": "object",
      "description": "Bounding box for map display",
      "properties": {
        "north": { "type": "number" },
        "south": { "type": "number" },
        "east": { "type": "number" },
        "west": { "type": "number" }
      }
    },
    "center": {
      "type": "object",
      "properties": {
        "lat": { "type": "number" },
        "lng": { "type": "number" }
      }
    },
    "related_settings": {
      "type": "array",
      "description": "IDs of settings that are geographically or narratively connected",
      "items": { "type": "string" }
    },
    "era_overrides": {
      "type": "object",
      "description": "Setting-specific era definitions that override or extend the global era list. Key is era key, value is era metadata.",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "start": { "type": "string" },
          "end": { "type": "string" }
        }
      }
    },
    "creative_properties": {
      "type": "array",
      "description": "Names of creative works that use this setting",
      "items": { "type": "string" }
    }
  }
}
```

### 3.7 Creative Property Registry Schema (New)

A registry of creative works so that entries can reference them by name and the UI can offer them as filter options.

**File:** `research/schemas/creative-property.schema.json`

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "creative-property.schema.json",
  "title": "Creative Property",
  "description": "A named creative work (novel, game, screenplay) that uses the knowledge base",
  "type": "object",
  "required": ["id", "name", "type"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier (e.g., 'vashon-chronicles')",
      "pattern": "^[a-z][a-z0-9-]*$"
    },
    "name": {
      "type": "string",
      "description": "Display name (e.g., 'The Vashon Chronicles')"
    },
    "type": {
      "type": "string",
      "enum": ["novel", "game", "screenplay", "interactive-narrative", "tabletop-rpg", "other"],
      "description": "Type of creative work"
    },
    "description": {
      "type": "string",
      "description": "Brief description of the creative work"
    },
    "settings": {
      "type": "array",
      "description": "Setting IDs this creative work uses",
      "items": { "type": "string" }
    },
    "time_period": {
      "type": "string",
      "description": "The time period the narrative spans (e.g., '1890-1920')"
    },
    "themes": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Major themes of the work"
    },
    "characters": {
      "type": "array",
      "description": "Person IDs of characters in this creative work",
      "items": { "type": "string" }
    },
    "status": {
      "type": "string",
      "enum": ["planning", "in-progress", "complete", "archived"],
      "description": "Current status of the creative work"
    }
  }
}
```

### 3.8 Updated TypeScript Types

```typescript
// --- Classification types ---

export type Classification = 'historical' | 'creative' | 'hybrid';

export type LayerKey =
  | 'event' | 'person' | 'place' | 'environment'  // existing
  | 'narrative' | 'character' | 'world-rule';       // new

// --- Creative metadata ---

export type NarrativeFunction =
  | 'inciting_incident' | 'rising_action' | 'climax'
  | 'falling_action' | 'resolution' | 'backstory'
  | 'world_building' | 'character_development'
  | 'foreshadowing' | 'red_herring' | 'subplot';

export type PlotSignificance = 'critical' | 'major' | 'supporting' | 'minor' | 'atmospheric';

export interface CreativeMetadata {
  narrative_function?: NarrativeFunction;
  plot_significance?: PlotSignificance;
  character_arc?: string;
  themes?: string[];
  depends_on?: string[];
  enables?: string[];
  historical_anchor?: string;
  narrator_instructions?: string;
}

// --- Evolved TimelineEntry ---

export interface TimelineEntry {
  id: string;
  title: string;
  date_start: string;
  date_end?: string;
  era: EraKey;
  layers: LayerKey[];
  description: string;
  details?: string;
  people: string[];
  places: string[];
  sources: Source[];
  tags: string[];
  // New fields
  classification: Classification;          // default: 'historical'
  creative_property?: string;
  setting: string;                         // default: 'vashon-island'
  settings?: string[];
  creative_metadata?: CreativeMetadata;
}

// --- Evolved Person ---

export interface PersonRelationship {
  person_id: string;
  type: string;
  description?: string;
  period?: string;
}

export interface CharacterProfile {
  archetype?: string;
  motivation?: string;
  personality_traits?: string[];
  speech_style?: string;
  appearance?: string;
  relationships?: PersonRelationship[];
  arc_summary?: string;
  secrets?: string[];
}

export interface ActivePeriod {
  start: string;
  end?: string;
  label: string;
  setting?: string;
}

export interface Person {
  id: string;
  name: string;
  description: string;
  role: string;
  period?: string;
  birth_year?: string;
  death_year?: string;
  related_entries?: string[];
  // New fields
  classification: Classification;          // default: 'historical'
  creative_property?: string;
  setting: string;                         // default: 'vashon-island'
  settings?: string[];
  fictional: boolean;                      // default: false
  birth_date?: string;
  death_date?: string;
  is_alive?: boolean;
  active_periods?: ActivePeriod[];
  character_profile?: CharacterProfile;
  contemporaries?: string[];
}

// --- Setting and Creative Property ---

export interface Setting {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'regional';
  description?: string;
  geographic_bounds?: { north: number; south: number; east: number; west: number };
  center?: { lat: number; lng: number };
  related_settings?: string[];
  era_overrides?: Record<string, { name?: string; start?: string; end?: string }>;
  creative_properties?: string[];
}

export interface CreativeProperty {
  id: string;
  name: string;
  type: string;
  description?: string;
  settings?: string[];
  time_period?: string;
  themes?: string[];
  characters?: string[];
  status?: string;
}
```

---

## 4. Data Architecture for Multi-Setting

### 4.1 File Organization

```
research/
  settings.json                    # Setting registry (all settings)
  creative-properties.json         # Creative property registry
  schemas/
    timeline-entry.schema.json     # Evolved schema (v2)
    person.schema.json             # Evolved schema (v2)
    place.schema.json              # Evolved schema (v2)
    environment-feature.schema.json
    setting.schema.json            # New
    creative-property.schema.json  # New
    narrator-export.schema.json    # Evolved (v3)
  vashon-island/                   # Primary setting (full depth)
    timeline.json                  # Historical entries (existing)
    people.json                    # Historical people (existing)
    places.json                    # Historical places (existing)
    environment.json               # Environment features (existing)
    creative/                      # Creative entries for this setting
      timeline.json                # Narrative/character entries
      people.json                  # Fictional characters
      places.json                  # Fictional places
    narrator-export.json
    search-index.json
    id-mapping.json
    *.md                           # Research narratives (existing)
  seattle/                         # Secondary setting (supporting context)
    timeline.json
    people.json
    places.json
    environment.json
  tacoma/                          # Secondary setting
    timeline.json
    people.json
    places.json
    environment.json
  regional/                        # Cross-setting, high-level entries
    timeline.json                  # Regional events affecting multiple settings
    people.json                    # People who span settings
    places.json                    # Regional places (Puget Sound, etc.)
```

### 4.2 Why Separate `creative/` Subdirectories

Creative entries live in a `creative/` subdirectory within each setting rather than being mixed into the main data files. This provides several benefits:

1. **Version control clarity.** A `git diff` immediately shows whether a change affects historical research or creative content.
2. **Independent authoring.** A researcher adding historical data never risks merge conflicts with a writer adding fictional entries.
3. **Easy toggling.** The data loader can skip the `creative/` directory entirely if the user wants a pure-research view.
4. **Clear ownership.** The Researcher agent owns `timeline.json`; the writer/narrator owns `creative/timeline.json`.

The `classification` field on each entry is the source of truth for how it is treated in the UI. The directory structure is an organizational convenience, not a logical constraint. An entry in `creative/timeline.json` with `classification: "hybrid"` is valid.

### 4.3 Cross-Setting References

A character who lives on Vashon but visits Seattle needs entries in both settings. Rather than duplicating the character, we use the `settings` array field.

**Example: A character who moves between settings**

```jsonc
// In research/vashon-island/creative/people.json
{
  "id": "person-c-001",
  "name": "Elena Marchetti",
  "classification": "creative",
  "creative_property": "vashon-chronicles",
  "setting": "vashon-island",
  "settings": ["vashon-island", "seattle"],
  "fictional": true,
  "birth_year": "1875",
  "death_year": "1952",
  "description": "Italian-American farmer who discovers a hidden network beneath the island.",
  "role": "protagonist",
  "active_periods": [
    { "start": "1875", "end": "1898", "label": "Childhood on Vashon", "setting": "vashon-island" },
    { "start": "1898", "end": "1902", "label": "Working in Seattle", "setting": "seattle" },
    { "start": "1902", "end": "1952", "label": "Returns to Vashon farm", "setting": "vashon-island" }
  ]
}
```

**Resolution rule:** When loading data, a person with `settings: ["vashon-island", "seattle"]` appears in both the Vashon Island and Seattle views. The canonical record lives in the setting matching the `setting` (singular) field. The loader does not duplicate the object; it indexes it under multiple setting keys.

### 4.4 Shared vs. Setting-Specific Data

| Data Type | Shared (regional/) | Setting-Specific |
|-----------|-------------------|-----------------|
| Regional events (e.g., "Washington statehood 1889") | Yes | No |
| People who span settings | Canonical in one setting, referenced via `settings[]` | Active periods indicate which setting |
| Places like "Puget Sound" | Yes (regional) | Referenced from setting-specific entries |
| Environment features | Mostly setting-specific | Regional climate/geology in regional/ |
| Creative properties | Defined in `creative-properties.json` (global) | Entries distributed by setting |

### 4.5 ID Conventions

Existing IDs use the pattern `era-prefix + NNN` (e.g., `pre-001`, `person-001`). New IDs must avoid collisions and clearly indicate their origin:

| Entity Type | Historical Pattern | Creative Pattern | Regional Pattern |
|-------------|-------------------|-----------------|-----------------|
| Timeline entry | `pre-001` (existing) | `c-pio-001` (c prefix) | `r-pio-001` (r prefix) |
| Person | `person-001` (existing) | `person-c-001` | `person-r-001` |
| Place | `place-001` (existing) | `place-c-001` | `place-r-001` |
| Environment | `env-001` (existing) | `env-c-001` | `env-r-001` |

The `c-` and `r-` prefixes ensure no collision with existing IDs. The schema's ID pattern regex must be updated:

```jsonc
// Old: "^[a-z][a-z0-9]*-[0-9]{3}$"
// New: "^[a-z][a-z0-9-]*-[0-9]{3,}$"
```

This allows `c-pio-001`, `person-c-001`, and future growth beyond 999 entries.

### 4.6 Data Loader Evolution

The current `loadData()` function fetches four fixed files. The evolved loader must:

1. Read `settings.json` to discover available settings.
2. For each active setting, fetch `timeline.json`, `people.json`, `places.json`, `environment.json`.
3. For each active setting, optionally fetch `creative/timeline.json`, `creative/people.json`, `creative/places.json`.
4. Fetch `regional/` data files.
5. Fetch `creative-properties.json`.
6. Merge all data into a single `DataStore`, applying default values for missing fields.
7. Build all indexes including the new ones (by setting, by classification, by creative property).

```typescript
// Evolved DataStore
export interface DataStore {
  // Existing fields (unchanged)
  entries: TimelineEntry[];
  people: Person[];
  places: Place[];
  environment: EnvironmentFeature[];
  entriesById: Map<string, TimelineEntry>;
  peopleById: Map<string, Person>;
  placesById: Map<string, Place>;
  peopleByName: Map<string, Person>;
  placesByName: Map<string, Place>;
  parsedDates: Map<string, number>;
  entriesByEra: Map<string, TimelineEntry[]>;
  warnings: DataWarning[];

  // New indexes
  entriesBySetting: Map<string, TimelineEntry[]>;
  entriesByClassification: Map<Classification, TimelineEntry[]>;
  entriesByCreativeProperty: Map<string, TimelineEntry[]>;
  peopleBySetting: Map<string, Person[]>;
  peopleByClassification: Map<Classification, Person[]>;
  personLifespans: Map<string, PersonLifespan>;

  // New registries
  settings: Setting[];
  settingsById: Map<string, Setting>;
  creativeProperties: CreativeProperty[];
  creativePropertiesById: Map<string, CreativeProperty>;
}
```

**Default value injection:** When loading existing data that lacks the new fields, the loader injects defaults:

```typescript
function applyDefaults(entry: Partial<TimelineEntry>, setting: string): TimelineEntry {
  return {
    ...entry,
    classification: entry.classification ?? 'historical',
    setting: entry.setting ?? setting,
    settings: entry.settings ?? [entry.setting ?? setting],
    creative_metadata: entry.creative_metadata ?? undefined,
    creative_property: entry.creative_property ?? undefined,
  } as TimelineEntry;
}
```

---

## 5. People Timeline Data Model

### 5.1 Purpose

The people-timeline view shows horizontal bands representing each person's lifespan, laid out against the same temporal axis as the main timeline. Real historical figures and fictional characters are visually distinguished. The view reveals who was alive at the same time, which characters are contemporaries of real people, and when active periods overlap.

### 5.2 Computed Lifespan Data

At load time, the loader computes a `PersonLifespan` for every person in the dataset:

```typescript
interface PersonLifespan {
  personId: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  isAlive: boolean;
  activePeriods: ComputedActivePeriod[];
  classification: Classification;
  fictional: boolean;
  setting: string;
  role: string;
}

interface ComputedActivePeriod {
  startYear: number;
  endYear: number | null;
  label: string;
  setting?: string;
}
```

**Computation rules:**

1. `birthYear` = `parseDate(person.birth_date ?? person.birth_year)` or `null` if neither is set.
2. `deathYear` = `parseDate(person.death_date ?? person.death_year)` or `null` if `is_alive` is true or neither field is set.
3. `activePeriods` = mapped from `person.active_periods` with `parseDate()` applied to each `start`/`end`.
4. If no `active_periods` are defined but `period` is set, parse it into a single active period (e.g., `"1880s-1920s"` becomes `{ startYear: 1880, endYear: 1929 }`).
5. If neither `active_periods` nor `period` is set, the lifespan band spans `birthYear` to `deathYear` with no sub-segmentation.

### 5.3 Contemporary Relationship Computation

Two people are contemporaries if their lifespans overlap. This is computed at load time and stored in the `contemporaries` field (if not already manually specified).

```typescript
function computeContemporaries(lifespans: PersonLifespan[]): Map<string, string[]> {
  const result = new Map<string, string[]>();

  for (let i = 0; i < lifespans.length; i++) {
    const a = lifespans[i];
    if (a.birthYear === null) continue;
    const aEnd = a.deathYear ?? new Date().getFullYear();

    const contemporaries: string[] = [];
    for (let j = 0; j < lifespans.length; j++) {
      if (i === j) continue;
      const b = lifespans[j];
      if (b.birthYear === null) continue;
      const bEnd = b.deathYear ?? new Date().getFullYear();

      // Overlap test: A started before B ended AND B started before A ended
      if (a.birthYear <= bEnd && b.birthYear <= aEnd) {
        contemporaries.push(b.personId);
      }
    }
    result.set(a.personId, contemporaries);
  }

  return result;
}
```

**Performance note:** With 113 historical + estimated 50-100 fictional people, the O(n^2) comparison is under 25,000 iterations. This is trivially fast (sub-millisecond). If the dataset grows beyond 1,000 people, we can switch to an interval-tree approach, but that is not needed for the prototype.

### 5.4 Visual Band Data for the People Timeline

The people-timeline renderer needs layout data: vertical positions, band lengths, colors. This is computed by the UI component, not stored in the data model. The data model provides the raw temporal data; the renderer handles layout.

```typescript
interface PersonBand {
  personId: string;
  name: string;
  y: number;                       // Vertical position (computed by layout algorithm)
  xStart: number;                  // Pixel position for birth year
  xEnd: number;                    // Pixel position for death year (or "now")
  color: string;                   // Based on classification
  opacity: number;                 // 1.0 for active periods, 0.3 for inactive
  segments: Array<{
    xStart: number;
    xEnd: number;
    label: string;
    setting?: string;
    isActive: boolean;
  }>;
  classification: Classification;
  fictional: boolean;
}
```

**Visual distinction rules:**

| Classification | Band Style | Border | Opacity |
|---------------|-----------|--------|---------|
| `historical` | Solid fill | None | 1.0 |
| `creative` | Diagonal hatch pattern | Dashed border | 0.9 |
| `hybrid` | Gradient (solid-to-hatch) | Dotted border | 0.95 |

### 5.5 Grouping and Sorting Options

The people-timeline view supports multiple sort/group modes:

| Mode | Sort Key | Group Key | Use Case |
|------|---------|-----------|----------|
| Chronological | `birthYear` | None | Default: see everyone in birth order |
| By Classification | `classification`, then `birthYear` | `classification` | See historical vs. creative clusters |
| By Setting | `setting`, then `birthYear` | `setting` | See who belongs where |
| By Role | `role`, then `birthYear` | `role` | See chiefs, homesteaders, protagonists together |
| By Creative Property | `creative_property`, then `birthYear` | `creative_property` | See all characters in a given story |

---

## 6. Filter and View Evolution

### 6.1 New Filter Dimensions

The FilterPanel currently has three filter groups: Layers, Eras, and Date Range. The evolution adds three more.

#### Classification Toggle

A three-way toggle: **Historical** | **Creative** | **Both** (default: Both).

- When "Historical" is selected, only entries with `classification === 'historical'` are shown.
- When "Creative" is selected, only `classification === 'creative'` entries are shown.
- When "Both" is selected (default), all entries are shown. Hybrid entries always appear.

Implementation: a new `Set<Classification>` in the filter state, analogous to `activeLayers`.

#### Creative Property Filter

A multi-select dropdown populated from `creativeProperties[]` in the DataStore.

- Shows only when at least one creative property exists.
- Default: all properties selected.
- When a subset is selected, only entries whose `creative_property` matches are shown (plus all `historical` entries, which have no creative property).

#### Setting Filter

A multi-select dropdown populated from `settings[]` in the DataStore.

- Default: all settings selected.
- When a subset is selected, only entries whose `setting` (or `settings[]`) matches are shown.
- An "All Settings" quick toggle.

### 6.2 Updated Filter Logic

The combined filter pipeline extends from four to seven stages:

```typescript
visible_entries = entries
  .filter(entry => matchesSearch(entry, searchQuery))
  .filter(entry => matchesLayerFilter(entry, activeLayers))
  .filter(entry => matchesEraFilter(entry, selectedEras))
  .filter(entry => matchesDateRange(entry, dateRangeStart, dateRangeEnd))
  // New stages:
  .filter(entry => matchesClassification(entry, activeClassifications))
  .filter(entry => matchesCreativeProperty(entry, selectedProperties))
  .filter(entry => matchesSetting(entry, selectedSettings))
```

Each new filter function:

```typescript
function matchesClassification(
  entry: TimelineEntry,
  active: Set<Classification>
): boolean {
  return active.has(entry.classification);
}

function matchesCreativeProperty(
  entry: TimelineEntry,
  selected: Set<string> | null  // null = no filter active
): boolean {
  if (selected === null) return true;
  if (entry.classification === 'historical') return true; // historical always passes
  return entry.creative_property != null && selected.has(entry.creative_property);
}

function matchesSetting(
  entry: TimelineEntry,
  selected: Set<string> | null  // null = no filter active
): boolean {
  if (selected === null) return true;
  if (selected.has(entry.setting)) return true;
  if (entry.settings?.some(s => selected.has(s))) return true;
  return false;
}
```

### 6.3 View Modes

The app currently has one view mode: the timeline. The evolution adds a second: the People Timeline.

| Mode | Description | Primary Axis | Secondary Grouping |
|------|-------------|-------------|-------------------|
| Timeline (existing) | Events on a horizontal timeline | Time (x-axis) | Layer (y-axis stacking) |
| People Timeline (new) | Lifespan bands on a horizontal timeline | Time (x-axis) | Person (y-axis rows) |

**View mode toggle:** A segmented control in the app header: **Timeline** | **People**.

Both views share the same filter state. Switching views does not reset filters. The People Timeline view ignores the Layer filter (it always shows people) but respects Classification, Setting, Era, and Date Range filters.

### 6.4 FilterPanel Props Evolution

```typescript
interface FilterPanelProps {
  // Existing
  activeLayers: Set<LayerKey>;
  selectedEras: Set<EraKey>;
  dateRange: [number, number];
  fullDateRange: [number, number];
  totalCount: number;
  filteredCount: number;
  onLayerToggle: (layer: LayerKey) => void;
  onEraToggle: (era: EraKey) => void;
  onDateRangeChange: (range: [number, number]) => void;
  onClearAll: () => void;
  // New
  activeClassifications: Set<Classification>;
  selectedCreativeProperties: Set<string> | null;
  selectedSettings: Set<string> | null;
  availableCreativeProperties: CreativeProperty[];
  availableSettings: Setting[];
  viewMode: 'timeline' | 'people';
  onClassificationToggle: (classification: Classification) => void;
  onCreativePropertyToggle: (propertyId: string) => void;
  onSettingToggle: (settingId: string) => void;
  onViewModeChange: (mode: 'timeline' | 'people') => void;
}
```

### 6.5 Layer Colors Evolution

New layers need visual identity:

```typescript
export const LAYER_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  // Existing
  event:       { color: '#9E7430', bg: '#FBF3E4', label: 'Event' },
  person:      { color: '#2B7A7A', bg: '#E4F3F3', label: 'People' },
  place:       { color: '#2D5F3E', bg: '#E4F0E8', label: 'Place' },
  environment: { color: '#8C6B4A', bg: '#F0EBE4', label: 'Environment' },
  // New creative layers
  narrative:   { color: '#7B4B94', bg: '#F3E8F9', label: 'Narrative' },
  character:   { color: '#C4564E', bg: '#FCE8E6', label: 'Character' },
  'world-rule': { color: '#4A7A8C', bg: '#E4F0F5', label: 'World Rule' },
};
```

**Classification visual overlay:** In addition to layer colors, entries carry a classification visual treatment that is applied on top of the layer color:

| Classification | Marker Shape | Card Border | Card Background |
|---------------|-------------|------------|----------------|
| `historical` | Circle (existing) | Solid 1px | White |
| `creative` | Diamond | Dashed 2px | Light purple tint (#FAFAFF) |
| `hybrid` | Square with circle inset | Dotted 2px | Light gold tint (#FFFAF0) |

This ensures that even without color, a user can distinguish historical from creative entries by marker shape and border style. This also satisfies the WCAG non-color indicator requirement.

---

## 7. Search Index Evolution

### 7.1 Current Index

The Fuse.js index currently indexes 303 records with these weighted fields:

| Field | Weight |
|-------|--------|
| `title` | 2.0 |
| `description` | 1.0 |
| `details` | 0.5 |
| `tags` | 1.0 |
| `people` | 0.8 |
| `places` | 0.8 |

### 7.2 New Indexed Fields

```typescript
const FUSE_OPTIONS: IFuseOptions<TimelineEntry> = {
  keys: [
    // Existing
    { name: 'title', weight: 2.0 },
    { name: 'description', weight: 1.0 },
    { name: 'details', weight: 0.5 },
    { name: 'tags', weight: 1.0 },
    { name: 'people', weight: 0.8 },
    { name: 'places', weight: 0.8 },
    // New
    { name: 'creative_property', weight: 0.6 },
    { name: 'setting', weight: 0.4 },
    { name: 'creative_metadata.themes', weight: 0.7 },
    { name: 'creative_metadata.narrator_instructions', weight: 0.3 },
  ],
  threshold: 0.35,
  distance: 200,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
};
```

### 7.3 Classification-Aware Search

The search hook evolves to accept a classification filter:

```typescript
export function useSearch(entries: TimelineEntry[]) {
  const fuse = useMemo(() => new Fuse(entries, FUSE_OPTIONS), [entries]);

  return {
    search(
      query: string,
      options?: { classifications?: Set<Classification>; settings?: Set<string> }
    ): SearchResult[] {
      if (!query || query.length < 2) return [];

      let results = fuse.search(query);

      // Post-filter by classification if specified
      if (options?.classifications) {
        results = results.filter(r =>
          options.classifications!.has(r.item.classification)
        );
      }

      // Post-filter by setting if specified
      if (options?.settings) {
        results = results.filter(r =>
          options.settings!.has(r.item.setting) ||
          r.item.settings?.some(s => options.settings!.has(s))
        );
      }

      return results.map(r => ({
        entry: r.item,
        score: r.score ?? 1,
        matches: r.matches ?? [],
      }));
    },
  };
}
```

**Why post-filter rather than separate indexes:** Fuse.js does not natively support faceted search. Maintaining separate Fuse instances per classification would triple memory usage and index build time. Since the post-filter operates on the already-reduced result set (typically 10-50 results), it adds negligible overhead.

### 7.4 People Search

The people-timeline view needs its own search capability. Rather than building a separate Fuse index for people, we add a dedicated people search hook:

```typescript
const PERSON_FUSE_OPTIONS: IFuseOptions<Person> = {
  keys: [
    { name: 'name', weight: 2.0 },
    { name: 'description', weight: 1.0 },
    { name: 'role', weight: 1.5 },
    { name: 'character_profile.archetype', weight: 0.8 },
    { name: 'character_profile.motivation', weight: 0.6 },
    { name: 'creative_property', weight: 0.5 },
  ],
  threshold: 0.35,
  includeScore: true,
  includeMatches: true,
};
```

### 7.5 Estimated Index Size

| Scenario | Records | Estimated Index Memory |
|----------|---------|----------------------|
| Current (Vashon historical only) | 303 | ~150KB |
| Vashon historical + 50 creative entries | ~353 | ~175KB |
| Vashon + Seattle + Tacoma historical | ~500 | ~250KB |
| Full multi-setting + creative | ~600-700 | ~350KB |

All scenarios remain well within the performance budget. Fuse.js index build time scales linearly; 700 records should index in under 100ms on a mid-range device.

---

## 8. Narrator Export Evolution

### 8.1 Export Schema Changes

The narrator export (currently v2) evolves to v3 with these additions:

```jsonc
{
  "export_metadata": {
    "setting": "Vashon Island, WA",
    "settings_included": ["vashon-island", "seattle", "tacoma"],
    "generated_at": "2026-03-03T12:00:00Z",
    "entry_count": 247,
    "version": "3.0",
    "classification_counts": {
      "historical": 180,
      "creative": 52,
      "hybrid": 15
    }
  },
  // Each entry now includes:
  "entries": [
    {
      // ... existing fields ...
      "classification": "creative",
      "creative_property": "vashon-chronicles",
      "setting": "vashon-island",
      "creative_metadata": { /* ... */ },
      "narrator_trust_level": "fictional"
      // narrator_trust_level: "factual" | "fictional" | "inspired_by_fact"
      // Derived from classification for narrator convenience
    }
  ],
  // New top-level section:
  "creative_properties": [
    {
      "id": "vashon-chronicles",
      "name": "The Vashon Chronicles",
      "description": "...",
      "time_period": "1890-1920",
      "themes": ["identity", "belonging"],
      "character_ids": ["person-c-001", "person-c-002"]
    }
  ],
  // New top-level section:
  "character_relationships": [
    {
      "person_a": "person-c-001",
      "person_b": "person-045",
      "type": "contemporary",
      "overlap_period": "1890-1920",
      "note": "Elena would have encountered the Martinolich family at the Dockton dry dock"
    }
  ],
  // New top-level section:
  "narrative_graph": {
    "nodes": ["c-pio-001", "c-pio-002", "c-pio-003"],
    "edges": [
      { "from": "c-pio-001", "to": "c-pio-002", "type": "enables" },
      { "from": "c-pio-002", "to": "c-pio-003", "type": "depends_on" }
    ]
  }
}
```

### 8.2 Narrator Trust Level

The `narrator_trust_level` field is a convenience mapping for AI narrators:

| Classification | Trust Level | Narrator Guidance |
|---------------|-------------|-------------------|
| `historical` | `factual` | "This is historically documented. Present as fact." |
| `creative` | `fictional` | "This is fictional. Present as part of the story." |
| `hybrid` | `inspired_by_fact` | "This blends real history with fiction. Anchor in real events but embellish with the creative elements." |

### 8.3 Export Scope Options

The ExportDialog gains new scope options:

| Option | Description |
|--------|-------------|
| Classification | Export historical only, creative only, or both |
| Creative Property | Export entries for a specific creative work |
| Settings | Export one setting or all |
| Include Narrative Graph | Whether to include the `depends_on`/`enables` dependency graph |
| Include Character Relationships | Whether to compute and include contemporary relationships |

---

## 9. Migration Strategy

### 9.1 Backward Compatibility Approach

**Zero breaking changes to existing data files.** The migration strategy relies entirely on default values applied at load time.

#### Step 1: Schema Version Bump

Both the JSON Schema files and the TypeScript types are versioned. The new schemas use JSON Schema's `default` keyword so that existing data validates without modification.

```jsonc
// In timeline-entry.schema.json v2
{
  "classification": {
    "type": "string",
    "enum": ["historical", "creative", "hybrid"],
    "default": "historical"
  }
}
```

#### Step 2: Loader Default Injection

The `loadData()` function applies defaults to every loaded entity:

```typescript
function normalizeEntry(raw: any, settingId: string): TimelineEntry {
  return {
    ...raw,
    classification: raw.classification ?? 'historical',
    setting: raw.setting ?? settingId,
    settings: raw.settings ?? [raw.setting ?? settingId],
    creative_property: raw.creative_property ?? undefined,
    creative_metadata: raw.creative_metadata ?? undefined,
  };
}

function normalizePerson(raw: any, settingId: string): Person {
  return {
    ...raw,
    classification: raw.classification ?? 'historical',
    setting: raw.setting ?? settingId,
    settings: raw.settings ?? [raw.setting ?? settingId],
    fictional: raw.fictional ?? false,
    is_alive: raw.is_alive ?? false,
    active_periods: raw.active_periods ?? [],
    character_profile: raw.character_profile ?? undefined,
    contemporaries: raw.contemporaries ?? [],
  };
}
```

#### Step 3: Type Union for Transition Period

During migration, the TypeScript types use a union approach so that old-style data (without new fields) still type-checks:

```typescript
// Transition types — remove after migration is complete
type LegacyTimelineEntry = Omit<TimelineEntry, 'classification' | 'setting'>;
type AnyTimelineEntry = TimelineEntry | LegacyTimelineEntry;
```

The normalizer function converts `AnyTimelineEntry` to `TimelineEntry` at load time.

#### Step 4: Cache Version Bump

The `CACHE_VERSION` constant in `loader.ts` increments from `'2'` to `'3'`. This invalidates all existing localStorage caches and forces a fresh load with the new normalizer.

### 9.2 Existing Test Preservation

The 122 existing tests must continue to pass without modification. Here is why they will:

1. **Test fixtures use the TypeScript interface.** The `buildTestStore()` function in `test-data.ts` constructs data matching the TypeScript types. After the type evolution, we add the new required fields to the fixtures with their default values. Since the new fields are all additive, this is a non-breaking change to the fixtures.

2. **Filter tests check existing behavior.** The new filter dimensions are additive. Existing filter tests do not test classification, setting, or creative property filtering. They continue to pass because the new filter stages are no-ops when their filter sets contain all possible values (the default state).

3. **Export tests validate existing structure.** The export format gains new fields, but existing required fields remain. Export tests that check for the presence of `id`, `title`, `date_start`, etc. continue to pass.

4. **Data validation tests check existing integrity rules.** New validation rules (e.g., "creative entries must have creative_property") are implemented as new test cases, not modifications to existing ones.

### 9.3 Required Fixture Updates

The test fixtures in `src/__fixtures__/test-data.ts` need minimal updates:

```typescript
// Before (e-001):
{
  id: 'e-001',
  title: 'Pioneer Settlement Founded',
  // ... existing fields ...
}

// After (add defaults explicitly):
{
  id: 'e-001',
  title: 'Pioneer Settlement Founded',
  classification: 'historical',
  setting: 'vashon-island',
  // ... existing fields unchanged ...
}
```

**New test fixtures to add:**

```typescript
// Creative entry
{
  id: 'c-e-001',
  title: 'Elena Discovers the Cave',
  classification: 'creative',
  creative_property: 'vashon-chronicles',
  setting: 'vashon-island',
  date_start: '1895',
  era: 'pioneer',
  layers: ['narrative', 'character'],
  description: 'Elena finds a hidden cave beneath Maury Island.',
  people: ['Elena Marchetti'],
  places: [],
  sources: [],
  tags: ['discovery', 'mystery'],
  creative_metadata: {
    narrative_function: 'inciting_incident',
    plot_significance: 'critical',
    historical_anchor: 'e-001',
  },
}

// Hybrid entry
{
  id: 'h-e-001',
  title: 'Elena Witnesses the Logging Operation',
  classification: 'hybrid',
  creative_property: 'vashon-chronicles',
  setting: 'vashon-island',
  date_start: '1880',
  era: 'pioneer',
  layers: ['event', 'narrative'],
  description: 'Elena watches the real logging operations begin.',
  people: ['Elena Marchetti', 'Alice Pioneer'],
  places: [],
  sources: [{ title: 'Logging Company Records', type: 'primary' }],
  tags: ['logging', 'narrative'],
  creative_metadata: {
    narrative_function: 'backstory',
    plot_significance: 'supporting',
    historical_anchor: 'e-002',
  },
}
```

### 9.4 New Test Requirements

| Test Area | New Cases | Description |
|-----------|-----------|-------------|
| Schema validation | ~15 | Validate all three classifications, conditional source requirements, new fields |
| Classification filtering | ~10 | Filter by historical, creative, hybrid, all combinations |
| Setting filtering | ~8 | Filter by single setting, multiple settings, cross-setting entries |
| Creative property filtering | ~6 | Filter by property, verify historical entries always pass |
| People timeline data | ~12 | Lifespan computation, contemporary detection, active period parsing |
| Search evolution | ~8 | Search across classifications, search new fields, people search |
| Export evolution | ~10 | v3 export format, classification counts, narrative graph, trust levels |
| Default injection | ~6 | Verify old data without new fields gets correct defaults |
| **Total new tests** | **~75** | |

Combined with the existing 122, the target is approximately 197 tests.

---

## 10. Implementation Phases

### Phase 1: Schema and Type Foundation (Non-Breaking)

**Goal:** Evolve schemas, types, and loader without changing any UI or breaking any tests.

1. Update JSON Schema files with new optional fields and defaults.
2. Create `setting.schema.json` and `creative-property.schema.json`.
3. Update TypeScript types in `src/types/index.ts`.
4. Update `loader.ts` with normalizer functions and default injection.
5. Bump `CACHE_VERSION` to `'3'`.
6. Update test fixtures with explicit default values.
7. Run all 122 tests, confirm green.
8. Write new tests for default injection and normalization.

**Estimated effort:** 1 sprint

### Phase 2: Data Layer and Indexes

**Goal:** Build the multi-setting data loading pipeline and new indexes.

1. Create `research/settings.json` with Vashon as the initial entry.
2. Create `research/creative-properties.json` (empty array initially).
3. Evolve `loadData()` to read the setting registry and load multi-setting data.
4. Build new indexes: `entriesBySetting`, `entriesByClassification`, `personLifespans`.
5. Implement `computeContemporaries()`.
6. Write integration tests for multi-setting loading.

**Estimated effort:** 1 sprint

### Phase 3: Filter and Search Evolution

**Goal:** Add classification, setting, and creative property filters to the UI.

1. Extend `FilterPanel` with new filter groups.
2. Implement `matchesClassification()`, `matchesCreativeProperty()`, `matchesSetting()`.
3. Extend `useSearch` with classification-aware post-filtering.
4. Add people search hook.
5. Update LAYER_COLORS with new creative layer definitions.
6. Write filter pipeline tests for new dimensions.

**Estimated effort:** 1 sprint

### Phase 4: Visual Distinction and People Timeline

**Goal:** Implement visual differentiation and the people-timeline view.

1. Update `EntryCard` to render classification-specific styling (border, background, marker shape).
2. Update `TimelineTrack` to render creative markers with distinct shapes.
3. Build `PeopleTimeline` component with lifespan bands.
4. Implement view mode toggle (Timeline / People).
5. Implement people-timeline sort/group modes.
6. Write component tests for new visual treatments.

**Estimated effort:** 1-2 sprints

### Phase 5: Export Evolution and Narrator Integration

**Goal:** Update the export format to v3 with creative layer support.

1. Update `narrator-export.schema.json` to v3.
2. Evolve the export engine to include classification, creative properties, narrative graph.
3. Add `narrator_trust_level` derivation.
4. Add new ExportDialog scope options.
5. Write export integration tests.

**Estimated effort:** 1 sprint

### Phase 6: Secondary Settings Data

**Goal:** Populate Seattle and Tacoma settings with initial data.

1. Create `research/seattle/` with high-level timeline, people, places.
2. Create `research/tacoma/` with high-level timeline, people, places.
3. Create `research/regional/` with cross-setting entries.
4. Update `settings.json` with all settings.
5. Validate cross-setting references.

**Estimated effort:** Requires Researcher collaboration; 1-2 sprints

---

## 11. Open Questions

| # | Question | Owner | Blocks |
|---|----------|-------|--------|
| 1 | Should the `creative/` subdirectory structure be mandatory, or can creative entries live in the main data files (distinguished only by `classification`)? | Engineer + PM | Phase 2 |
| 2 | Do we need a dedicated `World Rule` entity type (separate from TimelineEntry), or is a `world-rule` layer on a TimelineEntry sufficient? | Engineer + AI Narrator | Phase 1 |
| 3 | How deep should Seattle/Tacoma research go? 10-20 high-level entries each, or full era-by-era treatment? | PM + Researcher | Phase 6 |
| 4 | Should the people-timeline view support drag-to-reorder (manual vertical positioning), or is algorithmic layout sufficient? | UI/UX + Designer | Phase 4 |
| 5 | Should creative entries support a `draft` status (visible only to the author, hidden from export)? | PM + Engineer | Phase 1 |
| 6 | How should the narrator export handle entries with `depends_on` cycles (A depends on B, B depends on A)? Reject? Warn? Allow? | AI Narrator + Engineer | Phase 5 |
| 7 | Should the `creative_property` field be a free-text string or a strict reference to the creative property registry? | Engineer | Phase 1 |

---

*End of Technical Architecture Plan.*
