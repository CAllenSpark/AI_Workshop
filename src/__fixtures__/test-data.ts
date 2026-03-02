/**
 * Synthetic test fixtures for unit and integration tests.
 * Covers: all eras, all layer types, cross-references, edge cases.
 * Does NOT duplicate production data.
 */
import type { TimelineEntry, Person, Place, EnvironmentFeature, DataStore } from '../types';
import { parseDate } from '../data/loader';

export const TEST_PEOPLE: Person[] = [
  { id: 'p-001', name: 'Alice Pioneer', description: 'A pioneer settler', role: 'homesteader', related_entries: ['e-001', 'e-002'] },
  { id: 'p-002', name: 'Bob Explorer', description: 'An early explorer', role: 'explorer', related_entries: ['e-003'] },
  { id: 'p-003', name: "K'Pah Chief", description: 'Indigenous leader with special chars', role: 'chief', related_entries: ['e-004'] },
  { id: 'p-004', name: 'Orphan Person', description: 'Not referenced by any entry', role: 'unknown' },
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
  },
];

/** Build a complete DataStore from test fixtures */
export function buildTestStore(): DataStore {
  const entries = [...TEST_ENTRIES].sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));
  const people = TEST_PEOPLE;
  const places = TEST_PLACES;
  const environment = TEST_ENVIRONMENT;

  const entriesById = new Map(entries.map((e) => [e.id, e]));
  const peopleById = new Map(people.map((p) => [p.id, p]));
  const placesById = new Map(places.map((p) => [p.id, p]));
  const peopleByName = new Map(people.map((p) => [p.name, p]));
  const placesByName = new Map(places.map((p) => [p.name, p]));

  const parsedDates = new Map(entries.map((e) => [e.id, parseDate(e.date_start)]));

  const entriesByEra = new Map<string, TimelineEntry[]>();
  for (const e of entries) {
    const list = entriesByEra.get(e.era);
    if (list) list.push(e);
    else entriesByEra.set(e.era, [e]);
  }

  return {
    entries, people, places, environment,
    entriesById, peopleById, placesById, peopleByName, placesByName,
    parsedDates, entriesByEra,
    warnings: [],
  };
}
