/** Source citation embedded within entities */
export interface Source {
  title: string;
  url?: string;
  type: 'primary' | 'secondary' | 'tertiary';
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
}

/** Person entity */
export interface Person {
  id: string;
  name: string;
  description: string;
  role: string;
  period?: string;
  related_entries?: string[];
}

/** Place entity */
export interface Place {
  id: string;
  name: string;
  type: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  related_entries?: string[];
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
  type: 'missing_reference' | 'orphaned_entry' | 'invalid_date' | 'missing_field';
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
  // O(1) lookup maps
  entriesById: Map<string, TimelineEntry>;
  peopleById: Map<string, Person>;
  placesById: Map<string, Place>;
  peopleByName: Map<string, Person>;
  placesByName: Map<string, Place>;
  // Pre-computed date cache (entry.id -> numeric year)
  parsedDates: Map<string, number>;
  // Entries grouped by era for fast era filtering
  entriesByEra: Map<string, TimelineEntry[]>;
  // Data validation warnings
  warnings: DataWarning[];
}
