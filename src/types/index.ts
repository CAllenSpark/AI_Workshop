/** Source citation embedded within entities */
export interface Source {
  title: string;
  url?: string;
  type: 'primary' | 'secondary' | 'tertiary';
}

/** Entry factuality classification */
export type EntryType = 'historical' | 'fantasy' | 'speculative';

/** Geographic scope of an entry */
export type ScopeKey = 'vashon' | 'seattle' | 'tacoma' | 'national';

/** Narrative story beat classification */
export type NarrativeBeat =
  | 'setup'
  | 'inciting-incident'
  | 'rising-action'
  | 'midpoint'
  | 'climax'
  | 'falling-action'
  | 'resolution'
  | 'epilogue'
  | 'foreshadowing';

/** Relationship between a fantasy entry and a historical anchor */
export type AnchorRelationship =
  | 'divergence_point'
  | 'parallel_event'
  | 'consequence_of'
  | 'backdrop'
  | 'inspired_by'
  | 'contradiction';

/** A narrative anchor linking a fantasy entry to a historical entry */
export interface NarrativeAnchor {
  entry_id: string;
  relationship: AnchorRelationship;
  description?: string;
}

/** Narrative metadata for fantasy/speculative entries */
export interface NarrativeMetadata {
  arc?: string;
  beat?: NarrativeBeat;
  anchors?: NarrativeAnchor[];
  /** Book/season/volume this entry belongs to (for multi-book narratives) */
  book?: string;
}

/** A single timeline entry — the core entity */
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
  /** Entry factuality: historical (default), fantasy, or speculative */
  entry_type?: EntryType;
  /** Geographic scope: vashon (default), seattle, tacoma, national */
  scope?: ScopeKey;
  /** Fantasy universe/campaign ID (required for fantasy/speculative entries) */
  universe_id?: string;
  /** Narrative metadata: arc, beat, anchors (fantasy/speculative only) */
  narrative?: NarrativeMetadata;
}

/** Person entity */
export interface Person {
  id: string;
  name: string;
  description: string;
  role: string;
  period?: string;
  related_entries?: string[];
  /** Whether this person is historical or fantasy */
  entry_type?: 'historical' | 'fantasy';
  /** Fantasy universe this person belongs to */
  universe_id?: string;
  /** Personality traits (for AI narrator use with fantasy characters) */
  personality?: string;
  /** Core motivation or goal (for AI narrator use) */
  motivation?: string;
  /** Speech patterns (for AI narrator dialogue generation) */
  speech_style?: string;
}

/** Place entity */
export interface Place {
  id: string;
  name: string;
  type: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  related_entries?: string[];
  /** Whether this place is historical or fantasy */
  entry_type?: 'historical' | 'fantasy';
  /** Fantasy universe this place belongs to */
  universe_id?: string;
}

/** Environment feature entity */
export interface EnvironmentFeature {
  id: string;
  name: string;
  type: string;
  description: string;
  time_relevance: string;
  related_entries?: string[];
}

/**
 * Narrative prop / device — a key item that serves a critical
 * function in moving the plot forward (e.g., a map, a key, an artifact).
 */
export type PropFunction =
  | 'macguffin'       // Object everyone is after
  | 'key'             // Opens/unlocks the next sequence
  | 'clue'            // Reveals information to advance the plot
  | 'weapon'          // Used to resolve conflict
  | 'symbol'          // Carries thematic meaning
  | 'catalyst'        // Triggers a change or event
  | 'heirloom'        // Connects characters across time
  | 'evidence'        // Proves or disproves something
  | 'transport'       // Enables movement or access
  | 'other';

export interface NarrativeProp {
  id: string;
  name: string;
  description: string;
  /** Critical narrative function */
  narrative_function: PropFunction;
  /** How this prop advances the plot — plain-language explanation */
  plot_significance: string;
  /** Entry IDs where this prop appears or is referenced */
  appears_in: string[];
  /** Person IDs who possess or interact with this prop */
  associated_people?: string[];
  /** Place IDs where this prop can be found */
  associated_places?: string[];
  /** Which arc this prop belongs to (matches narrative.arc) */
  arc?: string;
  /** Historical or fantasy */
  entry_type?: EntryType;
  /** Universe this prop belongs to */
  universe_id?: string;
}

// ────────────────────────────────────────────
// Lore (folk tales, oral traditions, cultural knowledge)
// ────────────────────────────────────────────

/** Classification of a lore entry */
export type LoreType =
  | 'folk_tale'
  | 'oral_tradition'
  | 'legend'
  | 'myth'
  | 'superstition'
  | 'song'
  | 'proverb'
  | 'ritual'
  | 'custom'
  | 'prophecy';

/** How well a character knows a piece of lore */
export interface LoreKnowledge {
  person_id: string;
  level: 'deep' | 'familiar' | 'vague' | 'by_name_only';
  context?: string;
}

/**
 * A piece of cultural lore — folk tales, oral traditions, myths, legends,
 * superstitions, songs, rituals, customs, or prophecies.
 */
export interface Lore {
  id: string;
  name: string;
  type: LoreType;
  description: string;
  full_text?: string;
  origin_culture?: string;
  origin_era?: string;
  known_by?: LoreKnowledge[];
  related_entries?: string[];
  related_places?: string[];
  related_people?: string[];
  themes?: string[];
  narrative_use?: string;
  entry_type?: EntryType;
  scope?: ScopeKey;
  universe_id?: string;
}

// ────────────────────────────────────────────
// World Rules (governing laws of the fiction)
// ────────────────────────────────────────────

/** Category of a world rule */
export type WorldRuleCategory =
  | 'supernatural'
  | 'physics'
  | 'social'
  | 'narrative'
  | 'setting'
  | 'magic'
  | 'technology'
  | 'other';

/**
 * A governing rule of the fictional world.
 * Defines what is and isn't possible — constraints that
 * the AI narrator must respect and writers should stay consistent with.
 */
export interface WorldRule {
  id: string;
  name: string;
  description: string;
  category: WorldRuleCategory;
  implications: string[];
  exceptions?: string[];
  related_entries?: string[];
  universe_id?: string;
}

/** Fantasy universe / campaign definition */
export interface Universe {
  id: string;
  name: string;
  description: string;
  genre?: string;
  themes?: string[];
  created_by?: string;
  created_at?: string;
}

/**
 * A book, season, or volume within a project.
 * Allows multiple narrative threads on a shared timeline.
 */
export interface Book {
  id: string;
  name: string;
  description?: string;
  /** Sort order (lower = earlier) */
  order: number;
  /** Display color for badges and filters */
  color: string;
  colorLight: string;
}

/**
 * A project — a fully isolated creative workspace.
 * Each project has its own entries, people, places, etc.
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  /** The real-world or fictional setting (e.g., "Vashon Island, WA", "Modern New York") */
  setting: string;
  /** Genre tag for display */
  genre?: string;
  /** Books/seasons/volumes within this project */
  books: Book[];
  created_at: string;
  updated_at: string;
}

/**
 * Full project data — everything needed for a self-contained project.
 * Used for import/export between projects.
 */
export interface ProjectData {
  project: Project;
  entries: TimelineEntry[];
  people: Person[];
  places: Place[];
  environment: EnvironmentFeature[];
  universes: Universe[];
  props: NarrativeProp[];
  lore: Lore[];
  worldRules: WorldRule[];
}

/** Valid era keys matching the schema */
export type EraKey =
  | 'prehistory'
  | 'indigenous'
  | 'exploration'
  | 'logging-treaty'
  | 'pioneer'
  | 'growth-industry'
  | 'early-20th-century'
  | 'wwii'
  | 'state-ferry'
  | 'modern';

/** Valid layer keys */
export type LayerKey = 'event' | 'person' | 'place' | 'environment';

/** Era display metadata */
export interface Era {
  key: EraKey;
  name: string;
  start: number; // numeric year (negative for BCE)
  end: number;
  color: string;
  colorLight: string;
}

/** Zoom levels for the timeline */
export type ZoomLevel = 1 | 2 | 3 | 4;

/** Data validation warning */
export interface DataWarning {
  type: 'missing_reference' | 'orphaned_entry' | 'invalid_date' | 'missing_field' | 'invalid_fantasy';
  entityType: string;
  entityId: string;
  message: string;
}

/** Complete loaded dataset with indexed lookups */
export interface DataStore {
  entries: TimelineEntry[];
  people: Person[];
  places: Place[];
  environment: EnvironmentFeature[];
  universes: Universe[];
  props: NarrativeProp[];
  lore: Lore[];
  worldRules: WorldRule[];
  // O(1) lookup maps
  entriesById: Map<string, TimelineEntry>;
  peopleById: Map<string, Person>;
  placesById: Map<string, Place>;
  peopleByName: Map<string, Person>;
  placesByName: Map<string, Place>;
  loreById: Map<string, Lore>;
  worldRulesById: Map<string, WorldRule>;
  // Pre-computed date cache (entry.id -> numeric year)
  parsedDates: Map<string, number>;
  // Entries grouped by era for fast era filtering
  entriesByEra: Map<string, TimelineEntry[]>;
  // Entries grouped by scope for fast scope filtering
  entriesByScope: Map<string, TimelineEntry[]>;
  // Entries grouped by entry_type for fast type filtering
  entriesByType: Map<string, TimelineEntry[]>;
  // Data validation warnings
  warnings: DataWarning[];
}
