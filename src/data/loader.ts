import type { TimelineEntry, Person, Place, EnvironmentFeature, Universe, NarrativeProp, DataStore, DataWarning } from '../types';

const BASE_PATH = import.meta.env.BASE_URL + 'data/';
const CACHE_KEY = 'wrc_data_cache';
const CACHE_VERSION = '4';
const CACHE_VERSION_KEY = 'wrc_cache_version';

async function fetchJson<T>(filename: string): Promise<T> {
  const res = await fetch(BASE_PATH + filename);
  if (!res.ok) throw new Error(`Failed to load ${filename}: ${res.statusText}`);
  return res.json();
}

/** Parse approximate date strings into numeric years (negative for BCE) */
export function parseDate(dateStr: string): number {
  if (!dateStr) return 0;
  const s = dateStr.trim();

  // Handle "~NNNNN BCE" or "NNNNN BCE"
  const bceMatch = s.match(/~?(\d+)\s*BCE/i);
  if (bceMatch) return -parseInt(bceMatch[1], 10);

  // Handle ISO dates: "1792-05-20" or "1792"
  const isoMatch = s.match(/^~?(\d{4})/);
  if (isoMatch) return parseInt(isoMatch[1], 10);

  // Handle "present"
  if (s.toLowerCase().includes('present')) return new Date().getFullYear();

  return 0;
}

/** Apply default values for new v2 fields on entries missing them */
function applyEntryDefaults(entry: TimelineEntry): TimelineEntry {
  return {
    ...entry,
    entry_type: entry.entry_type ?? 'historical',
    scope: entry.scope ?? 'vashon',
    people: entry.people ?? [],
    places: entry.places ?? [],
    sources: entry.sources ?? [],
    tags: entry.tags ?? [],
  };
}

/** Apply default values for new v2 fields on persons */
function applyPersonDefaults(person: Person): Person {
  return {
    ...person,
    entry_type: person.entry_type ?? 'historical',
  };
}

/** Validate data integrity and return warnings */
function validateData(
  entries: TimelineEntry[],
  people: Person[],
  places: Place[],
  universes: Universe[],
): DataWarning[] {
  const warnings: DataWarning[] = [];
  const peopleNames = new Set(people.map((p) => p.name));
  const placeNames = new Set(places.map((p) => p.name));
  const entryIds = new Set(entries.map((e) => e.id));
  const universeIds = new Set(universes.map((u) => u.id));

  for (const entry of entries) {
    // Validate required fields
    if (!entry.title) {
      warnings.push({ type: 'missing_field', entityType: 'entry', entityId: entry.id, message: `Entry ${entry.id} missing title` });
    }
    if (!entry.description) {
      warnings.push({ type: 'missing_field', entityType: 'entry', entityId: entry.id, message: `Entry ${entry.id} missing description` });
    }

    // Validate date parses
    const year = parseDate(entry.date_start);
    if (year === 0 && entry.date_start && !entry.date_start.toLowerCase().includes('present')) {
      warnings.push({ type: 'invalid_date', entityType: 'entry', entityId: entry.id, message: `Entry "${entry.title}" has unparseable date: ${entry.date_start}` });
    }

    // Validate people references
    for (const name of entry.people) {
      if (!peopleNames.has(name)) {
        warnings.push({ type: 'missing_reference', entityType: 'entry', entityId: entry.id, message: `Entry "${entry.title}" references unknown person: "${name}"` });
      }
    }

    // Validate place references
    for (const name of entry.places) {
      if (!placeNames.has(name)) {
        warnings.push({ type: 'missing_reference', entityType: 'entry', entityId: entry.id, message: `Entry "${entry.title}" references unknown place: "${name}"` });
      }
    }

    // Validate fantasy entries have a universe_id
    if (entry.entry_type === 'fantasy' && !entry.universe_id) {
      warnings.push({ type: 'invalid_fantasy', entityType: 'entry', entityId: entry.id, message: `Fantasy entry "${entry.title}" missing universe_id` });
    }

    // Validate universe_id references a known universe (if universes exist)
    if (entry.universe_id && universes.length > 0 && !universeIds.has(entry.universe_id)) {
      warnings.push({ type: 'missing_reference', entityType: 'entry', entityId: entry.id, message: `Entry "${entry.title}" references unknown universe: "${entry.universe_id}"` });
    }

    // Validate narrative anchors reference existing entries
    if (entry.narrative?.anchors) {
      for (const anchor of entry.narrative.anchors) {
        if (!entryIds.has(anchor.entry_id)) {
          warnings.push({ type: 'missing_reference', entityType: 'entry', entityId: entry.id, message: `Entry "${entry.title}" narrative anchor references unknown entry: "${anchor.entry_id}"` });
        }
      }
    }
  }

  // Check for orphaned people (not referenced by any entry)
  for (const person of people) {
    const isReferenced = entries.some((e) => e.people.includes(person.name));
    if (!isReferenced) {
      warnings.push({ type: 'orphaned_entry', entityType: 'person', entityId: person.id, message: `Person "${person.name}" not referenced by any timeline entry` });
    }
  }

  // Validate back-references
  for (const person of people) {
    if (person.related_entries) {
      for (const eid of person.related_entries) {
        if (!entryIds.has(eid)) {
          warnings.push({ type: 'missing_reference', entityType: 'person', entityId: person.id, message: `Person "${person.name}" references unknown entry ID: ${eid}` });
        }
      }
    }
  }

  // Validate fantasy person universe_id
  for (const person of people) {
    if (person.entry_type === 'fantasy' && !person.universe_id) {
      warnings.push({ type: 'invalid_fantasy', entityType: 'person', entityId: person.id, message: `Fantasy person "${person.name}" missing universe_id` });
    }
  }

  return warnings;
}

/** Build all index maps for O(1) lookups */
function buildIndexes(
  entries: TimelineEntry[],
  people: Person[],
  places: Place[],
) {
  const entriesById = new Map<string, TimelineEntry>();
  const parsedDates = new Map<string, number>();
  const entriesByEra = new Map<string, TimelineEntry[]>();
  const entriesByScope = new Map<string, TimelineEntry[]>();
  const entriesByType = new Map<string, TimelineEntry[]>();

  for (const entry of entries) {
    entriesById.set(entry.id, entry);
    parsedDates.set(entry.id, parseDate(entry.date_start));

    // Index by era
    const eraList = entriesByEra.get(entry.era);
    if (eraList) eraList.push(entry);
    else entriesByEra.set(entry.era, [entry]);

    // Index by scope
    const scope = entry.scope ?? 'vashon';
    const scopeList = entriesByScope.get(scope);
    if (scopeList) scopeList.push(entry);
    else entriesByScope.set(scope, [entry]);

    // Index by entry_type
    const type = entry.entry_type ?? 'historical';
    const typeList = entriesByType.get(type);
    if (typeList) typeList.push(entry);
    else entriesByType.set(type, [entry]);
  }

  const peopleById = new Map<string, Person>();
  const peopleByName = new Map<string, Person>();
  for (const p of people) {
    peopleById.set(p.id, p);
    peopleByName.set(p.name, p);
  }

  const placesById = new Map<string, Place>();
  const placesByName = new Map<string, Place>();
  for (const p of places) {
    placesById.set(p.id, p);
    placesByName.set(p.name, p);
  }

  return { entriesById, peopleById, placesById, peopleByName, placesByName, parsedDates, entriesByEra, entriesByScope, entriesByType };
}

/** Try to load data from localStorage cache */
function loadFromCache(): { entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[]; universes: Universe[]; props: NarrativeProp[] } | null {
  try {
    const version = localStorage.getItem(CACHE_VERSION_KEY);
    if (version !== CACHE_VERSION) return null;

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    return JSON.parse(cached);
  } catch {
    return null;
  }
}

/** Save data to localStorage cache */
function saveToCache(data: { entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[]; universes: Universe[]; props: NarrativeProp[] }): void {
  try {
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail — localStorage might be full or unavailable
  }
}

/** Load all data files and build the in-memory store with indexes */
export async function loadData(): Promise<DataStore> {
  // Try cache first for faster startup
  const cached = loadFromCache();
  let entries: TimelineEntry[];
  let people: Person[];
  let places: Place[];
  let environment: EnvironmentFeature[];
  let universes: Universe[];
  let props: NarrativeProp[];

  if (cached) {
    entries = cached.entries;
    people = cached.people;
    places = cached.places;
    environment = cached.environment;
    universes = cached.universes ?? [];
    props = cached.props ?? [];

    // Background refresh: fetch fresh data and update cache
    fetchFreshData().then((fresh) => {
      if (fresh) saveToCache(fresh);
    }).catch(() => { /* ignore background refresh failures */ });
  } else {
    const fresh = await fetchFreshData();
    if (!fresh) throw new Error('Failed to load data files');
    entries = fresh.entries;
    people = fresh.people;
    places = fresh.places;
    environment = fresh.environment;
    universes = fresh.universes;
    props = fresh.props;
    saveToCache(fresh);
  }

  // Apply v2 defaults for backward compatibility
  entries = entries.map(applyEntryDefaults);
  people = people.map(applyPersonDefaults);

  // Sort entries by pre-computed date
  entries.sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));

  // Build all indexes
  const indexes = buildIndexes(entries, people, places);

  // Validate data integrity
  const warnings = validateData(entries, people, places, universes);
  if (warnings.length > 0) {
    console.warn(`[DataStore] ${warnings.length} data validation warnings:`);
    for (const w of warnings) {
      console.warn(`  [${w.type}] ${w.message}`);
    }
  }

  return { entries, people, places, environment, universes, props, warnings, ...indexes };
}

/** Fetch all data files from disk */
async function fetchFreshData(): Promise<{ entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[]; universes: Universe[]; props: NarrativeProp[] } | null> {
  try {
    const [timelineData, peopleData, placesData, envData] = await Promise.all([
      fetchJson<{ entries: TimelineEntry[] }>('timeline.json'),
      fetchJson<{ people: Person[] }>('people.json'),
      fetchJson<{ places: Place[] }>('places.json'),
      fetchJson<{ environment_features: EnvironmentFeature[] }>('environment.json'),
    ]);

    // Try loading universes (may not exist yet)
    let universesData: Universe[] = [];
    try {
      const uData = await fetchJson<{ universes: Universe[] }>('universes.json');
      universesData = uData.universes ?? [];
    } catch {
      // universes.json may not exist yet — that's fine
    }

    // Try loading narrative props (may not exist yet)
    let propsData: NarrativeProp[] = [];
    try {
      const pData = await fetchJson<{ props: NarrativeProp[] }>('props.json');
      propsData = pData.props ?? [];
    } catch {
      // props.json may not exist yet — that's fine
    }

    return {
      entries: timelineData.entries,
      people: peopleData.people,
      places: placesData.places,
      environment: envData.environment_features,
      universes: universesData,
      props: propsData,
    };
  } catch {
    return null;
  }
}

/** Build a DataStore from raw arrays (used for project data loaded from localStorage) */
export function buildDataStore(
  entries: TimelineEntry[],
  people: Person[],
  places: Place[],
  environment: EnvironmentFeature[],
  universes: Universe[],
  props: NarrativeProp[],
): DataStore {
  entries = entries.map(applyEntryDefaults);
  people = people.map(applyPersonDefaults);
  entries.sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));
  const indexes = buildIndexes(entries, people, places);
  const warnings = validateData(entries, people, places, universes);
  return { entries, people, places, environment, universes, props, warnings, ...indexes };
}

/** Add a new entry to the data store (in-memory only for prototype) */
export function addEntry(store: DataStore, entry: TimelineEntry): DataStore {
  const withDefaults = applyEntryDefaults(entry);
  const entries = [...store.entries, withDefaults].sort(
    (a, b) => parseDate(a.date_start) - parseDate(b.date_start)
  );

  const entriesById = new Map(store.entriesById);
  entriesById.set(withDefaults.id, withDefaults);

  const parsedDates = new Map(store.parsedDates);
  parsedDates.set(withDefaults.id, parseDate(withDefaults.date_start));

  const entriesByEra = new Map(store.entriesByEra);
  const eraList = entriesByEra.get(withDefaults.era);
  if (eraList) entriesByEra.set(withDefaults.era, [...eraList, withDefaults]);
  else entriesByEra.set(withDefaults.era, [withDefaults]);

  const entriesByScope = new Map(store.entriesByScope);
  const scope = withDefaults.scope ?? 'vashon';
  const scopeList = entriesByScope.get(scope);
  if (scopeList) entriesByScope.set(scope, [...scopeList, withDefaults]);
  else entriesByScope.set(scope, [withDefaults]);

  const entriesByType = new Map(store.entriesByType);
  const type = withDefaults.entry_type ?? 'historical';
  const typeList = entriesByType.get(type);
  if (typeList) entriesByType.set(type, [...typeList, withDefaults]);
  else entriesByType.set(type, [withDefaults]);

  return { ...store, entries, entriesById, parsedDates, entriesByEra, entriesByScope, entriesByType };
}

/** Remove an entry from the data store (in-memory only) */
export function removeEntry(store: DataStore, entryId: string): DataStore {
  const entry = store.entriesById.get(entryId);
  if (!entry) return store;

  const entries = store.entries.filter((e) => e.id !== entryId);

  const entriesById = new Map(store.entriesById);
  entriesById.delete(entryId);

  const parsedDates = new Map(store.parsedDates);
  parsedDates.delete(entryId);

  const entriesByEra = new Map(store.entriesByEra);
  const eraList = entriesByEra.get(entry.era);
  if (eraList) entriesByEra.set(entry.era, eraList.filter((e) => e.id !== entryId));

  const entriesByScope = new Map(store.entriesByScope);
  const scope = entry.scope ?? 'vashon';
  const scopeList = entriesByScope.get(scope);
  if (scopeList) entriesByScope.set(scope, scopeList.filter((e) => e.id !== entryId));

  const entriesByType = new Map(store.entriesByType);
  const type = entry.entry_type ?? 'historical';
  const typeList = entriesByType.get(type);
  if (typeList) entriesByType.set(type, typeList.filter((e) => e.id !== entryId));

  return { ...store, entries, entriesById, parsedDates, entriesByEra, entriesByScope, entriesByType };
}
