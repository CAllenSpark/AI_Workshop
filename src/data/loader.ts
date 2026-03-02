import type { TimelineEntry, Person, Place, EnvironmentFeature, DataStore, DataWarning } from '../types';

const BASE_PATH = import.meta.env.BASE_URL + 'data/';
const CACHE_KEY = 'wrc_data_cache';
const CACHE_VERSION = '2';
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

/** Validate data integrity and return warnings */
function validateData(
  entries: TimelineEntry[],
  people: Person[],
  places: Place[],
): DataWarning[] {
  const warnings: DataWarning[] = [];
  const peopleNames = new Set(people.map((p) => p.name));
  const placeNames = new Set(places.map((p) => p.name));
  const entryIds = new Set(entries.map((e) => e.id));

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

  for (const entry of entries) {
    entriesById.set(entry.id, entry);
    parsedDates.set(entry.id, parseDate(entry.date_start));

    const eraList = entriesByEra.get(entry.era);
    if (eraList) eraList.push(entry);
    else entriesByEra.set(entry.era, [entry]);
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

  return { entriesById, peopleById, placesById, peopleByName, placesByName, parsedDates, entriesByEra };
}

/** Try to load data from localStorage cache */
function loadFromCache(): { entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[] } | null {
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
function saveToCache(data: { entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[] }): void {
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

  if (cached) {
    entries = cached.entries;
    people = cached.people;
    places = cached.places;
    environment = cached.environment;

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
    saveToCache(fresh);
  }

  // Sort entries by pre-computed date
  entries.sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));

  // Build all indexes
  const indexes = buildIndexes(entries, people, places);

  // Validate data integrity
  const warnings = validateData(entries, people, places);
  if (warnings.length > 0) {
    console.warn(`[DataStore] ${warnings.length} data validation warnings:`);
    for (const w of warnings) {
      console.warn(`  [${w.type}] ${w.message}`);
    }
  }

  return { entries, people, places, environment, warnings, ...indexes };
}

/** Fetch all data files from disk */
async function fetchFreshData(): Promise<{ entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[] } | null> {
  try {
    const [timelineData, peopleData, placesData, envData] = await Promise.all([
      fetchJson<{ entries: TimelineEntry[] }>('timeline.json'),
      fetchJson<{ people: Person[] }>('people.json'),
      fetchJson<{ places: Place[] }>('places.json'),
      fetchJson<{ environment_features: EnvironmentFeature[] }>('environment.json'),
    ]);

    return {
      entries: timelineData.entries,
      people: peopleData.people,
      places: placesData.places,
      environment: envData.environment_features,
    };
  } catch {
    return null;
  }
}

/** Add a new entry to the data store (in-memory only for prototype) */
export function addEntry(store: DataStore, entry: TimelineEntry): DataStore {
  const entries = [...store.entries, entry].sort(
    (a, b) => parseDate(a.date_start) - parseDate(b.date_start)
  );

  const entriesById = new Map(store.entriesById);
  entriesById.set(entry.id, entry);

  const parsedDates = new Map(store.parsedDates);
  parsedDates.set(entry.id, parseDate(entry.date_start));

  const entriesByEra = new Map(store.entriesByEra);
  const eraList = entriesByEra.get(entry.era);
  if (eraList) entriesByEra.set(entry.era, [...eraList, entry]);
  else entriesByEra.set(entry.era, [entry]);

  return { ...store, entries, entriesById, parsedDates, entriesByEra };
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

  return { ...store, entries, entriesById, parsedDates, entriesByEra };
}
