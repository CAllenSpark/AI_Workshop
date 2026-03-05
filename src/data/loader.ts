import type { TimelineEntry, Person, Place, EnvironmentFeature, Universe, NarrativeProp, Lore, WorldRule, DataStore, DataWarning } from '../types';

const BASE_PATH = import.meta.env.BASE_URL + 'data/';
const CACHE_KEY = 'wrc_data_cache';
const CACHE_VERSION = '8';
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
  lore: Lore[] = [],
  worldRules: WorldRule[] = [],
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

  // Validate lore references
  for (const l of lore) {
    if (!l.name) {
      warnings.push({ type: 'missing_field', entityType: 'lore', entityId: l.id, message: `Lore ${l.id} missing name` });
    }
    if (l.related_entries) {
      for (const eid of l.related_entries) {
        if (!entryIds.has(eid)) {
          warnings.push({ type: 'missing_reference', entityType: 'lore', entityId: l.id, message: `Lore "${l.name}" references unknown entry: "${eid}"` });
        }
      }
    }
    if (l.related_people) {
      for (const pid of l.related_people) {
        if (!people.some((p) => p.id === pid)) {
          warnings.push({ type: 'missing_reference', entityType: 'lore', entityId: l.id, message: `Lore "${l.name}" references unknown person: "${pid}"` });
        }
      }
    }
    if (l.related_places) {
      for (const plid of l.related_places) {
        if (!places.some((p) => p.id === plid)) {
          warnings.push({ type: 'missing_reference', entityType: 'lore', entityId: l.id, message: `Lore "${l.name}" references unknown place: "${plid}"` });
        }
      }
    }
    if (l.entry_type === 'fantasy' && !l.universe_id) {
      warnings.push({ type: 'invalid_fantasy', entityType: 'lore', entityId: l.id, message: `Fantasy lore "${l.name}" missing universe_id` });
    }
  }

  // Validate world rule references
  for (const rule of worldRules) {
    if (!rule.name) {
      warnings.push({ type: 'missing_field', entityType: 'worldRule', entityId: rule.id, message: `World rule ${rule.id} missing name` });
    }
    if (rule.related_entries) {
      for (const eid of rule.related_entries) {
        if (!entryIds.has(eid)) {
          warnings.push({ type: 'missing_reference', entityType: 'worldRule', entityId: rule.id, message: `World rule "${rule.name}" references unknown entry: "${eid}"` });
        }
      }
    }
    if (rule.universe_id && universes.length > 0 && !universeIds.has(rule.universe_id)) {
      warnings.push({ type: 'missing_reference', entityType: 'worldRule', entityId: rule.id, message: `World rule "${rule.name}" references unknown universe: "${rule.universe_id}"` });
    }
  }

  return warnings;
}

/** Build all index maps for O(1) lookups */
function buildIndexes(
  entries: TimelineEntry[],
  people: Person[],
  places: Place[],
  lore: Lore[] = [],
  worldRules: WorldRule[] = [],
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

  const loreById = new Map<string, Lore>();
  for (const l of lore) {
    loreById.set(l.id, l);
  }

  const worldRulesById = new Map<string, WorldRule>();
  for (const r of worldRules) {
    worldRulesById.set(r.id, r);
  }

  return { entriesById, peopleById, placesById, peopleByName, placesByName, loreById, worldRulesById, parsedDates, entriesByEra, entriesByScope, entriesByType };
}

/** Try to load data from localStorage cache */
function loadFromCache(): { entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[]; universes: Universe[]; props: NarrativeProp[]; lore: Lore[]; worldRules: WorldRule[] } | null {
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
function saveToCache(data: { entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[]; universes: Universe[]; props: NarrativeProp[]; lore: Lore[]; worldRules: WorldRule[] }): void {
  try {
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail — localStorage might be full or unavailable
  }
}

/** Build a DataStore from raw fetched data (shared by loadData and background refresh) */
function buildStoreFromRaw(raw: {
  entries: TimelineEntry[];
  people: Person[];
  places: Place[];
  environment: EnvironmentFeature[];
  universes: Universe[];
  props: NarrativeProp[];
  lore: Lore[];
  worldRules: WorldRule[];
}): DataStore {
  let entries = raw.entries.map(applyEntryDefaults);
  const people = raw.people.map(applyPersonDefaults);
  entries.sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));
  const indexes = buildIndexes(entries, people, raw.places, raw.lore, raw.worldRules);
  const warnings = validateData(entries, people, raw.places, raw.universes, raw.lore, raw.worldRules);
  if (warnings.length > 0) {
    console.warn(`[DataStore] ${warnings.length} data validation warnings:`);
    for (const w of warnings) {
      console.warn(`  [${w.type}] ${w.message}`);
    }
  }
  return {
    entries,
    people,
    places: raw.places,
    environment: raw.environment,
    universes: raw.universes,
    props: raw.props,
    lore: raw.lore,
    worldRules: raw.worldRules,
    warnings,
    ...indexes,
  };
}

/**
 * Load all data files and build the in-memory store with indexes.
 *
 * When cached data is available, it is returned immediately for fast startup.
 * A background refresh then fetches fresh data from the server. If the fresh
 * data differs from the cache (e.g., new entries were added), the onRefresh
 * callback is invoked with the updated DataStore so the UI can re-render.
 */
export async function loadData(onRefresh?: (store: DataStore) => void): Promise<DataStore> {
  // Try cache first for faster startup
  const cached = loadFromCache();

  if (cached) {
    const raw = {
      entries: cached.entries,
      people: cached.people,
      places: cached.places,
      environment: cached.environment,
      universes: cached.universes ?? [],
      props: cached.props ?? [],
      lore: cached.lore ?? [],
      worldRules: cached.worldRules ?? [],
    };
    const store = buildStoreFromRaw(raw);

    // Background refresh: fetch fresh data, update cache, and notify caller if data changed
    fetchFreshData().then((fresh) => {
      if (!fresh) return;
      // Detect if fresh data differs from cache (entry count, IDs, or entry_type changes)
      const cachedById = new Map(cached.entries.map((e: TimelineEntry) => [e.id, e]));
      const freshIds = new Set(fresh.entries.map((e: TimelineEntry) => e.id));
      const dataChanged = fresh.entries.length !== cached.entries.length
        || fresh.entries.some((e: TimelineEntry) => {
          const cachedEntry = cachedById.get(e.id);
          // New entry not in cache, or entry_type changed
          return !cachedEntry || cachedEntry.entry_type !== e.entry_type;
        })
        || cached.entries.some((e: TimelineEntry) => !freshIds.has(e.id));

      saveToCache(fresh);

      if (dataChanged && onRefresh) {
        const freshStore = buildStoreFromRaw(fresh);
        onRefresh(freshStore);
      }
    }).catch(() => { /* ignore background refresh failures */ });

    return store;
  }

  // No cache — fetch fresh data synchronously
  const fresh = await fetchFreshData();
  if (!fresh) throw new Error('Failed to load data files');
  saveToCache(fresh);
  return buildStoreFromRaw(fresh);
}

/** Fetch all data files from disk */
async function fetchFreshData(): Promise<{ entries: TimelineEntry[]; people: Person[]; places: Place[]; environment: EnvironmentFeature[]; universes: Universe[]; props: NarrativeProp[]; lore: Lore[]; worldRules: WorldRule[] } | null> {
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

    // Try loading lore (may not exist yet)
    let loreData: Lore[] = [];
    try {
      const lData = await fetchJson<{ lore: Lore[] }>('lore.json');
      loreData = lData.lore ?? [];
    } catch {
      // lore.json may not exist yet — that's fine
    }

    // Try loading world rules (may not exist yet)
    let worldRulesData: WorldRule[] = [];
    try {
      const wrData = await fetchJson<{ worldRules: WorldRule[] }>('world-rules.json');
      worldRulesData = wrData.worldRules ?? [];
    } catch {
      // world-rules.json may not exist yet — that's fine
    }

    return {
      entries: timelineData.entries,
      people: peopleData.people,
      places: placesData.places,
      environment: envData.environment_features,
      universes: universesData,
      props: propsData,
      lore: loreData,
      worldRules: worldRulesData,
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
  lore: Lore[] = [],
  worldRules: WorldRule[] = [],
): DataStore {
  return buildStoreFromRaw({ entries, people, places, environment, universes, props, lore, worldRules });
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
