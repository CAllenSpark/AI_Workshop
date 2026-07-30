/**
 * Project Templates
 *
 * Built-in starter templates for new projects. Templates are assembled
 * entirely from the static data bundled with the app (public/data/) —
 * no API key or external generation is required to initialize a project.
 */
import type { ProjectData, TimelineEntry, Person, Place, Universe, NarrativeProp, Lore, WorldRule } from '../types';
import { importProject } from './project-manager';
import type { Project } from '../types';

const BASE_PATH = import.meta.env.BASE_URL + 'data/';

async function fetchJson<T>(filename: string): Promise<T> {
  const res = await fetch(BASE_PATH + filename);
  if (!res.ok) throw new Error(`Failed to load ${filename}: ${res.statusText}`);
  return res.json();
}

/** Metadata describing an available starter template */
export interface ProjectTemplate {
  id: string;
  name: string;
  setting: string;
  genre: string;
  description: string;
  /** Short summary of what the template pre-populates */
  contents: string;
}

/** Registry of built-in templates shown in the New Project form */
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    setting: '',
    genre: '',
    description: 'Start from scratch with an empty workspace.',
    contents: 'No starting data',
  },
  {
    id: 'room-33',
    name: 'Room 33 — Whispering Pines',
    setting: 'Vashon Island, WA',
    genre: 'historical fantasy / literary mystery',
    description:
      'The Room 33 creative universe: a remote Pacific Northwest lodge where time moves differently. '
      + 'Pre-populated with the full series bible — characters, locations, timeline, world rules, lore, and props.',
    contents: '25 timeline events, 19 characters, 18 locations, 15 world rules, 11 lore entries, 10 props, season arcs & episodes',
  },
];

/** Whether a record belongs to the Room 33 creative universe */
function isRoom33(record: { entry_type?: string; universe_id?: string }): boolean {
  return record.universe_id === 'room-33' || record.entry_type === 'fantasy' || record.entry_type === 'speculative';
}

/**
 * Build the Room 33 starter data by filtering the bundled static dataset
 * down to creative-universe records, plus the historical people, places, and
 * anchor entries the creative content references (the universe is layered
 * on real history). Runs entirely client-side — no API key required.
 */
async function buildRoom33Data(): Promise<Omit<ProjectData, 'project'>> {
  const [timeline, people, places, universes, worldRules, lore, props] = await Promise.all([
    fetchJson<{ entries: TimelineEntry[] }>('timeline.json'),
    fetchJson<{ people: Person[] }>('people.json'),
    fetchJson<{ places: Place[] }>('places.json'),
    fetchJson<{ universes: Universe[] }>('universes.json').catch(() => ({ universes: [] as Universe[] })),
    fetchJson<{ worldRules: WorldRule[] }>('world-rules.json').catch(() => ({ worldRules: [] as WorldRule[] })),
    fetchJson<{ lore: Lore[] }>('lore.json').catch(() => ({ lore: [] as Lore[] })),
    fetchJson<{ props: NarrativeProp[] }>('props.json').catch(() => ({ props: [] as NarrativeProp[] })),
  ]);

  const creativeEntries = timeline.entries.filter(isRoom33);
  const creativeLore = lore.lore.filter(isRoom33);
  const creativeProps = props.props.filter(isRoom33);

  // Collect names of people/places the creative entries reference
  const neededPeopleNames = new Set<string>();
  const neededPlaceNames = new Set<string>();
  // Historical entries referenced as narrative anchors or prop appearances
  const neededEntryIds = new Set<string>();

  for (const e of creativeEntries) {
    for (const n of e.people ?? []) neededPeopleNames.add(n);
    for (const n of e.places ?? []) neededPlaceNames.add(n);
    for (const a of e.narrative?.anchors ?? []) neededEntryIds.add(a.entry_id);
  }

  // Lore and props reference people/places/entries by ID
  const neededPeopleIds = new Set<string>();
  const neededPlaceIds = new Set<string>();
  for (const l of creativeLore) {
    for (const pid of l.related_people ?? []) neededPeopleIds.add(pid);
    for (const k of l.known_by ?? []) neededPeopleIds.add(k.person_id);
    for (const plid of l.related_places ?? []) neededPlaceIds.add(plid);
    for (const eid of l.related_entries ?? []) neededEntryIds.add(eid);
  }
  for (const pr of creativeProps) {
    for (const pid of pr.associated_people ?? []) neededPeopleIds.add(pid);
    for (const plid of pr.associated_places ?? []) neededPlaceIds.add(plid);
    for (const eid of pr.appears_in ?? []) neededEntryIds.add(eid);
  }

  const anchorEntries = timeline.entries.filter(
    (e) => !isRoom33(e) && neededEntryIds.has(e.id),
  );

  // Second pass: anchor entries reference their own historical people/places
  for (const e of anchorEntries) {
    for (const n of e.people ?? []) neededPeopleNames.add(n);
    for (const n of e.places ?? []) neededPlaceNames.add(n);
  }

  const templatePeople = people.people.filter(
    (p) => isRoom33(p) || neededPeopleNames.has(p.name) || neededPeopleIds.has(p.id),
  );
  const templatePlaces = places.places.filter(
    (p) => isRoom33(p) || neededPlaceNames.has(p.name) || neededPlaceIds.has(p.id),
  );

  return {
    entries: [...creativeEntries, ...anchorEntries],
    people: templatePeople,
    places: templatePlaces,
    environment: [],
    universes: universes.universes.filter((u) => u.id === 'room-33'),
    props: creativeProps,
    lore: creativeLore,
    worldRules: worldRules.worldRules.filter((r) => r.universe_id === 'room-33'),
  };
}

/**
 * Create a new project from a built-in template.
 * For the blank template, callers should use createProject() directly.
 * Returns the created Project.
 */
export async function createProjectFromTemplate(
  templateId: string,
  overrides?: { name?: string; setting?: string; genre?: string },
): Promise<Project> {
  if (templateId !== 'room-33') {
    throw new Error(`Unknown template: ${templateId}`);
  }

  const template = PROJECT_TEMPLATES.find((t) => t.id === templateId)!;
  const data = await buildRoom33Data();

  return importProject(data, {
    name: overrides?.name || template.name,
    setting: overrides?.setting || template.setting,
    genre: overrides?.genre || template.genre,
  });
}
