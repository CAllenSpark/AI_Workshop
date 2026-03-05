# Room 33 Import Gap Analysis

**Date:** 2026-03-05
**Reviewed by:** AI Writer & AI Narrator (evaluation sprint)
**Input:** Room 33 creative writing JSON export (~2000 lines)

## Purpose

Evaluate the Room 33 JSON export format against the WRC type system to determine:
1. How well the format maps to existing WRC types
2. What features are missing from WRC that a writer or AI narrator would need
3. Recommended priority for closing gaps

---

## Section 1: What Maps Cleanly

| Room 33 Section | WRC Type | Notes |
|---|---|---|
| `overview.title/genre/setting/logline` | `Project` | `.name`, `.genre`, `.setting`, `.description` |
| `characters[].name/description/role` | `Person` | Direct field mapping |
| `characters[].personality/motivation/speechStyle` | `Person` | We have `.personality`, `.motivation`, `.speech_style` (flat strings vs. structured objects) |
| `locations[].name/description/type/coordinates` | `Place` | Direct mapping |
| `items[]` | `NarrativeProp` | Our `.narrative_function`, `.plot_significance`, `.appears_in` cover Room 33's items |
| `timeline[]` | `TimelineEntry` | `date_start`, `era`, `description`, `entry_type`, `narrative` |
| `overview.seasons` | `Book[]` | `Project.books` maps to seasons with name/description/order |

**Verdict:** The core data model is solid. Basic import of characters, locations, items, timeline, and project metadata would work today.

---

## Section 2: Partial Mappings (Needs Extension)

### Character Psychology
- **Room 33:** Structured `psychology` object with `strengths[]`, `flaws[]`, `contradictions[]`, `fears[]`, `desires[]`
- **WRC:** Flat strings for `personality`, `motivation`
- **Impact:** Medium. Writers need richer character psychology. Narrators embodying a character need to know fears and contradictions.
- **Recommendation:** Add optional `psychology` field to `Person` type.

### Character Voice + Samples
- **Room 33:** `voice.style` description + `voice.sampleDialogue[]` (actual dialogue lines)
- **WRC:** `speech_style` as a single string
- **Impact:** High for narrators. Sample dialogue is essential for maintaining character voice consistency.
- **Recommendation:** Add `voice_samples` string array to `Person`.

### Character Arc (Per-Season)
- **Room 33:** Structured per-season arc with `journey`, `keyMoments[]`, `growth`
- **WRC:** `NarrativeMetadata.arc` is a flat string label
- **Impact:** Medium. Useful for writers tracking character development across books.
- **Recommendation:** Consider `character_arcs` field on `Person` or per-book arc metadata.

### Character Type Classification
- **Room 33:** `type` field (core/regular/visitor/lodge/supernatural)
- **WRC:** Only `entry_type` (historical/fantasy)
- **Impact:** Low. Could be represented as tags.
- **Recommendation:** Use tags or a `character_type` string field.

### Location Era Descriptions
- **Room 33:** `eraDescriptions{}` — how a place looks in different time periods
- **WRC:** Single `description` field
- **Impact:** High. A lodge in 1920 looks entirely different from 2024. Time-travel narratives require era-aware location descriptions.
- **Recommendation:** Add `era_descriptions` map to `Place`.

### Location Sensory Profile
- **Room 33:** `sensoryProfile` with `sounds[]`, `smells[]`, `tactile[]`, `visual[]`
- **WRC:** Not modeled. Narrator prompt says "ground every scene in sensory detail" but provides no sensory data.
- **Impact:** High for narrators.
- **Recommendation:** Add `sensory` object to `Place`.

### Location Connected Locations
- **Room 33:** `connectedLocations[]` — spatial relationships
- **WRC:** No location graph
- **Impact:** Medium. Spatial navigation for narrators.
- **Recommendation:** Add `connected_places` array to `Place`.

---

## Section 3: Entirely Missing Concepts

### 3.1 World Rules / Story Bible (HIGH PRIORITY)

Room 33 has `worldRules` containing:
- `supernatural`: rules governing supernatural elements
- `timeTravel`: rules for how time travel works
- `storyRules`: narrative constraints (e.g., "the past cannot be changed")
- `setting`: environmental/atmospheric rules

**Why it matters:** An AI narrator must know the rules to avoid contradicting the fiction. If time travel doesn't allow changing the past, the narrator must never suggest it can. If supernatural events only happen during storms, the narrator must respect that constraint.

**Proposed type:** `WorldRule`
```typescript
interface WorldRule {
  id: string;
  name: string;
  description: string;
  category: 'supernatural' | 'physics' | 'social' | 'narrative' | 'setting' | 'magic' | 'technology' | 'other';
  implications: string[];  // What this rule means for narration
  exceptions?: string[];   // Known exceptions to the rule
  related_entries?: string[];
}
```

### 3.2 Folk Tales / Oral Traditions / Cultural Lore (HIGH PRIORITY)

**The problem:** A folk tale about a sea sprite passed down by indigenous people:
- Has no specific date (not a timeline entry)
- Isn't tied to a single character (not a person)
- Isn't a physical object (not a prop)
- Is critical cultural context that informs the world
- Some characters know it, others don't — knowledge distribution matters

**Why it matters:** Cultural lore is the connective tissue of a setting. It's what makes a place feel lived-in. For indigenous settings especially, oral traditions are primary culture carriers. An AI narrator asked "what do the locals say about this bay?" needs access to the relevant folk tales, knowing which characters would share them and which wouldn't.

**Proposed type:** `Lore`
```typescript
type LoreType = 'folk_tale' | 'oral_tradition' | 'legend' | 'myth' | 'superstition'
  | 'song' | 'proverb' | 'ritual' | 'custom' | 'prophecy';

interface LoreKnowledge {
  person_id: string;
  level: 'deep' | 'familiar' | 'vague' | 'by_name_only';
  context?: string;  // How/why they know it
}

interface Lore {
  id: string;
  name: string;
  type: LoreType;
  description: string;       // Summary of the tale/tradition
  full_text?: string;         // The actual tale, lyrics, or recitation
  origin_culture?: string;    // Which culture/people it comes from
  origin_era?: string;        // Approximate era of origin
  known_by?: LoreKnowledge[]; // Who knows this and how well
  related_entries?: string[];  // Timeline entries where this lore is relevant
  related_places?: string[];   // Places associated with the lore
  related_people?: string[];   // People who feature in the lore itself
  themes?: string[];
  narrative_use?: string;      // How a narrator should deploy this
  entry_type?: EntryType;      // historical, fantasy, or speculative
  scope?: ScopeKey;
}
```

**Example:**
```json
{
  "id": "lore-001",
  "name": "The Tide Keeper of Quartermaster Harbor",
  "type": "folk_tale",
  "description": "A s'Homamish tale of a spirit that lives beneath Quartermaster Harbor, controlling the tides and protecting the salmon runs.",
  "full_text": "Long before the cedar people came to cut the great trees...",
  "origin_culture": "s'Homamish / sx\u030cx\u0323\u02b7\u0259bab\u0161",
  "origin_era": "indigenous",
  "known_by": [
    { "person_id": "elder-001", "level": "deep", "context": "Learned from grandmother" },
    { "person_id": "jake-rivers", "level": "by_name_only", "context": "Overheard at the general store" }
  ],
  "related_places": ["quartermaster-harbor"],
  "themes": ["stewardship", "respect-for-nature", "reciprocity"],
  "narrative_use": "Reveal gradually. The elder shares fragments when trust is built. Full tale unlocks understanding of the harbor's supernatural properties.",
  "entry_type": "speculative"
}
```

### 3.3 Character Relationships (HIGH PRIORITY)

Room 33 has `relationships[]` per character with `character`, `nature`, `dynamic` fields.

**Why it matters:** A narrator playing Margaret Stone needs to know her relationship with Elias Blackwood. Writers tracking character dynamics need a relationship web. Currently, we can only infer relationships from shared timeline entries.

**Proposed extension to `Person`:**
```typescript
interface CharacterRelationship {
  person_id: string;
  nature: string;        // "mentor", "rival", "spouse", "employer", etc.
  dynamic: string;       // Description of how the relationship works
  arc?: string;          // How it changes (optional)
}
```

### 3.4 Episode / Chapter Structure (MEDIUM PRIORITY)

Room 33 has `episodes[]` with cold opens, 3-act structure, mystery elements, setup/payoff tracking, and ending hooks.

**Why it matters:** Writers planning story structure need containers for scenes. Our `Book` is a flat label. There's no way to sequence narrative beats within a book.

**Proposed type:** `Episode`
```typescript
interface Episode {
  id: string;
  book_id: string;
  title: string;
  order: number;
  summary?: string;
  entry_ids?: string[];  // Timeline entries that belong to this episode
  notes?: string;
}
```

### 3.5 Narrative Threads / Setup-Payoff (MEDIUM PRIORITY)

Room 33 tracks `setupPayoff` per episode and `mysteryElements` (planted/revealed states).

**Proposed type:** `Thread`
```typescript
interface Thread {
  id: string;
  name: string;
  type: 'mystery' | 'relationship' | 'thematic' | 'plot' | 'foreshadowing';
  status: 'planted' | 'developing' | 'revealed' | 'resolved';
  setup_entry_ids: string[];
  payoff_entry_ids?: string[];
  description: string;
  book_id?: string;
}
```

### 3.6 Writers' Notes (LOW PRIORITY)

Room 33 has `writersNotes` with themes, tonal guidelines, research notes, and future setup ideas.

**Recommendation:** Extend `Project` with optional `notes` object or add a generic `WritersNote` type.

---

## Section 4: Import Feasibility

### Today (no changes)
A Room 33 import would successfully capture:
- Project metadata, seasons/books
- Characters (basic: name, role, description, personality, motivation, speech style)
- Locations (basic: name, type, description, coordinates)
- Items as props (good fit)
- Timeline entries (good fit)

**Lost on import:** World rules, episode structure, character psychology depth, voice samples, character relationships, era-specific location descriptions, sensory profiles, spatial connections, folk tales/oral traditions, setup/payoff threads, mystery tracking, writers' notes.

### After Phase 1 (Lore + WorldRule)
Adds folk tale/oral tradition support and world rules. The most culturally important and narrator-critical gaps are closed.

### After Phase 2 (Character Depth)
Adds structured psychology, voice samples, relationships. Characters become fully embodied for narration.

### After Phase 3 (Location Depth)
Adds era descriptions, sensory profiles, spatial connections. Locations become time-aware and sensory-rich.

### After Phase 4 (Narrative Structure)
Adds episodes, threads, setup/payoff. Full story planning capability.

---

## Section 5: Format Evaluation

**Is the Room 33 JSON a good export format?**

**Yes, with caveats:**
- **Structure is excellent.** Hierarchical, well-organized, clearly named fields.
- **Character depth is a model to aspire to.** Psychology, voice samples, per-season arcs.
- **Location era descriptions are brilliant.** Every setting-based story needs this.
- **World rules are essential.** Any AI narrator integration needs governing rules.
- **Episode structure is too format-specific.** The 3-act/cold-open structure assumes a specific TV/screenplay format. A more flexible scene/beat system would be more universal.
- **Missing: cultural lore layer.** Even Room 33 doesn't model folk tales and oral traditions. This is a gap in both systems.

**Recommended interchange format:** A superset of our current `ProjectData` type, extended with the new types proposed in this analysis. The WRC should be able to import Room 33 JSON with a transformer that maps fields, and export in a format that Room 33's application can consume.

---

## Section 6: Implementation Priority

| Phase | Milestone | New Types | Estimated Impact |
|---|---|---|---|
| 1 | M12: Lore & World Rules | `Lore`, `LoreKnowledge`, `WorldRule` | Unlocks cultural storytelling + narrator rule compliance |
| 2 | M13: Character Depth | Extend `Person` with `psychology`, `voice_samples`, `relationships` | Characters become embodied for AI narration |
| 3 | M14: Location Depth | Extend `Place` with `era_descriptions`, `sensory`, `connected_places` | Locations become time-aware and immersive |
| 4 | M15: Narrative Structure | `Episode`, `Thread` | Full story planning and mystery tracking |
