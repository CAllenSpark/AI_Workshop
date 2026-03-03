/**
 * Synthetic test fixtures for unit and integration tests.
 * Covers: all eras, all layer types, cross-references, edge cases,
 * fantasy entries, regional entries, universe management.
 * Does NOT duplicate production data.
 */
import type { TimelineEntry, Person, Place, EnvironmentFeature, Universe, NarrativeProp, DataStore } from '../types';
import { parseDate } from '../data/loader';

export const TEST_UNIVERSES: Universe[] = [
  {
    id: 'test-campaign',
    name: 'Test Campaign',
    description: 'A test fantasy universe for unit testing',
    genre: 'dark fantasy',
    themes: ['memory', 'displacement'],
  },
];

export const TEST_PEOPLE: Person[] = [
  { id: 'p-001', name: 'Alice Pioneer', description: 'A pioneer settler', role: 'homesteader', related_entries: ['e-001', 'e-002'] },
  { id: 'p-002', name: 'Bob Explorer', description: 'An early explorer', role: 'explorer', related_entries: ['e-003'] },
  { id: 'p-003', name: "K'Pah Chief", description: 'Indigenous leader with special chars', role: 'chief', related_entries: ['e-004'] },
  { id: 'p-004', name: 'Orphan Person', description: 'Not referenced by any entry', role: 'unknown' },
  {
    id: 'p-005',
    name: 'The Tidewalker',
    description: 'A spirit entity tied to glacial memory',
    role: 'spirit entity',
    entry_type: 'fantasy',
    universe_id: 'test-campaign',
    personality: 'Ancient and patient',
    motivation: 'Restore ecological memory',
    speech_style: 'Archaic, rhythmic',
    related_entries: ['e-fan-001'],
  },
];

export const TEST_PLACES: Place[] = [
  { id: 'pl-001', name: 'Test Landing', description: 'A test landing site', type: 'landmark', coordinates: { lat: 47.44, lng: -122.46 }, related_entries: ['e-001'] },
  { id: 'pl-002', name: 'Test Harbor', description: 'A test harbor', type: 'waterway', related_entries: ['e-003'] },
  { id: 'pl-003', name: 'Test Forest', description: 'An old-growth forest', type: 'area' },
];

export const TEST_ENVIRONMENT: EnvironmentFeature[] = [
  { id: 'env-001', name: 'Glacial Deposits', type: 'geology', description: 'Deposits from glacial retreat', time_relevance: '~15000 BCE to present' },
  { id: 'env-002', name: 'Douglas Fir Canopy', type: 'ecology', description: 'Old growth forest canopy', time_relevance: '~5000 BCE to present' },
];

export const TEST_ENTRIES: TimelineEntry[] = [
  {
    id: 'e-001',
    title: 'Pioneer Settlement Founded',
    date_start: '1870',
    date_end: '1875',
    era: 'pioneer',
    layers: ['event', 'person'],
    description: 'The first pioneer settlement was founded.',
    details: 'Extended details about the settlement founding.',
    people: ['Alice Pioneer'],
    places: ['Test Landing'],
    sources: [{ title: 'Settlement Records', type: 'primary' }],
    tags: ['settlement', 'founding'],
    entry_type: 'historical',
    scope: 'vashon',
  },
  {
    id: 'e-002',
    title: 'Logging Operation Begins',
    date_start: '1880',
    era: 'pioneer',
    layers: ['event'],
    description: 'Commercial logging operations began.',
    people: ['Alice Pioneer'],
    places: [],
    sources: [{ title: 'Logging Company Records', type: 'primary' }, { title: 'Historical Review', type: 'secondary' }],
    tags: ['logging'],
    entry_type: 'historical',
    scope: 'vashon',
  },
  {
    id: 'e-003',
    title: 'Explorer Arrives',
    date_start: '1792-05-20',
    era: 'exploration',
    layers: ['event', 'person'],
    description: 'An explorer arrived at the harbor.',
    people: ['Bob Explorer'],
    places: ['Test Harbor'],
    sources: [{ title: 'Ship Logs', type: 'primary' }],
    tags: ['exploration'],
    entry_type: 'historical',
    scope: 'vashon',
  },
  {
    id: 'e-004',
    title: 'Indigenous Gathering',
    date_start: '~10000 BCE',
    era: 'indigenous',
    layers: ['event', 'person'],
    description: 'A gathering of indigenous peoples.',
    people: ["K'Pah Chief"],
    places: [],
    sources: [{ title: 'Archaeological Study', type: 'secondary' }],
    tags: ['indigenous', 'gathering'],
    entry_type: 'historical',
    scope: 'vashon',
  },
  {
    id: 'e-005',
    title: 'Glacial Retreat',
    date_start: '~15000 BCE',
    era: 'prehistory',
    layers: ['environment'],
    description: 'The Vashon glacier retreated.',
    people: [],
    places: [],
    sources: [{ title: 'Geological Survey', type: 'primary' }],
    tags: ['geology', 'glacier'],
    entry_type: 'historical',
    scope: 'vashon',
  },
  {
    id: 'e-006',
    title: 'Modern Community Event',
    date_start: '2020',
    era: 'modern',
    layers: ['event', 'place'],
    description: 'A community gathering in the modern era.',
    people: [],
    places: ['Test Forest'],
    sources: [{ title: 'Community Newsletter', type: 'tertiary' }],
    tags: ['community'],
    entry_type: 'historical',
    scope: 'vashon',
  },
  {
    id: 'e-007',
    title: 'Minimal Entry',
    date_start: '1950',
    era: 'state-ferry',
    layers: ['event'],
    description: 'Minimal entry with only required fields.',
    people: [],
    places: [],
    sources: [],
    tags: [],
    entry_type: 'historical',
    scope: 'vashon',
  },
  // Fantasy entry
  {
    id: 'e-fan-001',
    title: 'The Tidewalker Emerges',
    date_start: '1942',
    era: 'wwii',
    layers: ['event', 'person'],
    description: 'An ancient spirit rises from the harbor.',
    people: ['The Tidewalker'],
    places: ['Test Harbor'],
    sources: [],
    tags: ['fantasy', 'universe:test-campaign', 'arc:tidewalker-awakening'],
    entry_type: 'fantasy',
    scope: 'vashon',
    universe_id: 'test-campaign',
    narrative: {
      arc: 'tidewalker-awakening',
      beat: 'inciting-incident',
      anchors: [
        {
          entry_id: 'e-005',
          relationship: 'consequence_of',
          description: 'The spirit dates to the glacial retreat',
        },
      ],
    },
  },
  // Regional entry (Seattle)
  {
    id: 'e-sea-001',
    title: 'Great Seattle Fire',
    date_start: '1889',
    era: 'growth-industry',
    layers: ['event'],
    description: 'A massive fire destroyed 25 blocks of downtown Seattle.',
    people: [],
    places: [],
    sources: [{ title: 'HistoryLink', type: 'secondary' }],
    tags: ['fire', 'seattle', 'regional-context'],
    entry_type: 'historical',
    scope: 'seattle',
  },
];

export const TEST_PROPS: NarrativeProp[] = [
  {
    id: 'prop-001',
    name: 'Glacial Memory Stone',
    description: 'A smooth basalt stone etched with patterns that resemble tidal charts, found in the glacial deposits near the harbor.',
    narrative_function: 'key',
    plot_significance: 'The stone unlocks the Tidewalker\'s memory and must be returned to the harbor to advance the plot.',
    appears_in: ['e-fan-001', 'e-005'],
    associated_people: ['p-005'],
    associated_places: ['pl-002'],
    arc: 'tidewalker-awakening',
    entry_type: 'fantasy',
    universe_id: 'test-campaign',
  },
];

/** Build a complete DataStore from test fixtures */
export function buildTestStore(): DataStore {
  const entries = [...TEST_ENTRIES].sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));
  const people = TEST_PEOPLE;
  const places = TEST_PLACES;
  const environment = TEST_ENVIRONMENT;
  const universes = TEST_UNIVERSES;
  const props = TEST_PROPS;

  const entriesById = new Map(entries.map((e) => [e.id, e]));
  const peopleById = new Map(people.map((p) => [p.id, p]));
  const placesById = new Map(places.map((p) => [p.id, p]));
  const peopleByName = new Map(people.map((p) => [p.name, p]));
  const placesByName = new Map(places.map((p) => [p.name, p]));

  const parsedDates = new Map(entries.map((e) => [e.id, parseDate(e.date_start)]));

  const entriesByEra = new Map<string, TimelineEntry[]>();
  const entriesByScope = new Map<string, TimelineEntry[]>();
  const entriesByType = new Map<string, TimelineEntry[]>();

  for (const e of entries) {
    // By era
    const eraList = entriesByEra.get(e.era);
    if (eraList) eraList.push(e);
    else entriesByEra.set(e.era, [e]);

    // By scope
    const scope = e.scope ?? 'vashon';
    const scopeList = entriesByScope.get(scope);
    if (scopeList) scopeList.push(e);
    else entriesByScope.set(scope, [e]);

    // By type
    const type = e.entry_type ?? 'historical';
    const typeList = entriesByType.get(type);
    if (typeList) typeList.push(e);
    else entriesByType.set(type, [e]);
  }

  return {
    entries, people, places, environment, universes, props,
    entriesById, peopleById, placesById, peopleByName, placesByName,
    parsedDates, entriesByEra, entriesByScope, entriesByType,
    warnings: [],
  };
}
