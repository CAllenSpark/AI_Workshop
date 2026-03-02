import type { TimelineEntry, Person, Place, EnvironmentFeature, DataStore } from '../types';

const BASE_PATH = import.meta.env.BASE_URL + 'data/';

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

/** Load all data files and build the in-memory store */
export async function loadData(): Promise<DataStore> {
  const [timelineData, peopleData, placesData, envData] = await Promise.all([
    fetchJson<{ entries: TimelineEntry[] }>('timeline.json'),
    fetchJson<{ people: Person[] }>('people.json'),
    fetchJson<{ places: Place[] }>('places.json'),
    fetchJson<{ environment_features: EnvironmentFeature[] }>('environment.json'),
  ]);

  const entries = timelineData.entries;
  const people = peopleData.people;
  const places = placesData.places;
  const environment = envData.environment_features;

  // Build lookup maps
  const peopleByName = new Map<string, Person>();
  for (const p of people) {
    peopleByName.set(p.name, p);
  }

  const placesByName = new Map<string, Place>();
  for (const p of places) {
    placesByName.set(p.name, p);
  }

  // Sort entries by date
  entries.sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));

  return { entries, people, places, environment, peopleByName, placesByName };
}
