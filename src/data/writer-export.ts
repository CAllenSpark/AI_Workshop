/**
 * Writer Export Generators
 *
 * Produces structured exports designed for writers reviewing their story:
 * 1. Character Dossiers — person + all related entries organized by arc/beat
 * 2. Location Guides — place + timeline of changes across eras
 * 3. Props Catalog — narrative devices with plot function and appearances
 */
import type {
  DataStore,
  TimelineEntry,
  Person,
  Place,
  NarrativeProp,
  NarrativeBeat,
  EntryType,
} from '../types';
import { parseDate } from './loader';
import { ERAS } from './eras';

// ────────────────────────────────────────────
// Character Dossier
// ────────────────────────────────────────────

export interface CharacterAppearance {
  entry_id: string;
  title: string;
  date_start: string;
  era: string;
  description: string;
  entry_type: EntryType;
  arc?: string;
  beat?: NarrativeBeat;
}

export interface CharacterDossier {
  id: string;
  name: string;
  description: string;
  role: string;
  period?: string;
  entry_type: EntryType;
  universe_id?: string;
  personality?: string;
  motivation?: string;
  speech_style?: string;
  /** All timeline entries this character appears in, sorted chronologically */
  appearances: CharacterAppearance[];
  /** Appearances grouped by narrative arc (fantasy/speculative entries only) */
  arcs: Record<string, CharacterAppearance[]>;
  /** Associated props */
  props: Array<{ id: string; name: string; narrative_function: string; plot_significance: string }>;
  /** Places this character is associated with */
  associated_places: string[];
}

export interface CharacterDossierExport {
  export_metadata: {
    type: 'character-dossiers';
    generated_at: string;
    character_count: number;
    version: string;
  };
  characters: CharacterDossier[];
}

export function buildCharacterDossiers(data: DataStore): CharacterDossierExport {
  const characters: CharacterDossier[] = [];

  for (const person of data.people) {
    // Find all entries that reference this person
    const appearances: CharacterAppearance[] = [];
    const associatedPlaces = new Set<string>();

    for (const entry of data.entries) {
      if (entry.people.includes(person.name)) {
        appearances.push({
          entry_id: entry.id,
          title: entry.title,
          date_start: entry.date_start,
          era: entry.era,
          description: entry.description,
          entry_type: (entry.entry_type ?? 'historical') as EntryType,
          arc: entry.narrative?.arc,
          beat: entry.narrative?.beat,
        });
        for (const place of entry.places) {
          associatedPlaces.add(place);
        }
      }
    }

    // Sort appearances chronologically
    appearances.sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));

    // Group by arc
    const arcs: Record<string, CharacterAppearance[]> = {};
    for (const app of appearances) {
      if (app.arc) {
        if (!arcs[app.arc]) arcs[app.arc] = [];
        arcs[app.arc].push(app);
      }
    }

    // Find associated props
    const personProps = (data.props ?? [])
      .filter((p) => p.associated_people?.includes(person.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        narrative_function: p.narrative_function,
        plot_significance: p.plot_significance,
      }));

    characters.push({
      id: person.id,
      name: person.name,
      description: person.description,
      role: person.role,
      period: person.period,
      entry_type: (person.entry_type ?? 'historical') as EntryType,
      universe_id: person.universe_id,
      personality: person.personality,
      motivation: person.motivation,
      speech_style: person.speech_style,
      appearances,
      arcs,
      props: personProps,
      associated_places: Array.from(associatedPlaces),
    });
  }

  // Sort: fantasy characters first (they're more likely to be story characters), then alphabetical
  characters.sort((a, b) => {
    if (a.entry_type !== b.entry_type) {
      return a.entry_type === 'fantasy' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return {
    export_metadata: {
      type: 'character-dossiers',
      generated_at: new Date().toISOString(),
      character_count: characters.length,
      version: '1.0',
    },
    characters,
  };
}

// ────────────────────────────────────────────
// Location Guide
// ────────────────────────────────────────────

export interface LocationEvent {
  entry_id: string;
  title: string;
  date_start: string;
  era: string;
  description: string;
  entry_type: EntryType;
  people: string[];
}

export interface LocationEraSection {
  era_key: string;
  era_name: string;
  events: LocationEvent[];
}

export interface LocationGuide {
  id: string;
  name: string;
  type: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  entry_type?: string;
  /** Events at this location organized by era, in chronological order */
  timeline: LocationEraSection[];
  /** Total number of events at this location */
  event_count: number;
  /** Props found at this location */
  props: Array<{ id: string; name: string; narrative_function: string; plot_significance: string }>;
  /** People associated with this location */
  associated_people: string[];
}

export interface LocationGuideExport {
  export_metadata: {
    type: 'location-guides';
    generated_at: string;
    location_count: number;
    version: string;
  };
  locations: LocationGuide[];
}

export function buildLocationGuides(data: DataStore): LocationGuideExport {
  const locations: LocationGuide[] = [];

  for (const place of data.places) {
    // Find all entries that reference this place
    const events: LocationEvent[] = [];
    const associatedPeople = new Set<string>();

    for (const entry of data.entries) {
      if (entry.places.includes(place.name)) {
        events.push({
          entry_id: entry.id,
          title: entry.title,
          date_start: entry.date_start,
          era: entry.era,
          description: entry.description,
          entry_type: (entry.entry_type ?? 'historical') as EntryType,
          people: entry.people,
        });
        for (const person of entry.people) {
          associatedPeople.add(person);
        }
      }
    }

    // Sort events chronologically
    events.sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));

    // Group events by era
    const eraMap = new Map<string, LocationEvent[]>();
    for (const event of events) {
      const list = eraMap.get(event.era) ?? [];
      list.push(event);
      eraMap.set(event.era, list);
    }

    // Build era sections in canonical era order
    const timeline: LocationEraSection[] = [];
    for (const era of ERAS) {
      const eraEvents = eraMap.get(era.key);
      if (eraEvents && eraEvents.length > 0) {
        timeline.push({
          era_key: era.key,
          era_name: era.name,
          events: eraEvents,
        });
      }
    }

    // Find associated props
    const placeProps = (data.props ?? [])
      .filter((p) => p.associated_places?.includes(place.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        narrative_function: p.narrative_function,
        plot_significance: p.plot_significance,
      }));

    locations.push({
      id: place.id,
      name: place.name,
      type: place.type,
      description: place.description,
      coordinates: place.coordinates,
      entry_type: place.entry_type,
      timeline,
      event_count: events.length,
      props: placeProps,
      associated_people: Array.from(associatedPeople),
    });
  }

  // Sort by event count descending (most active locations first)
  locations.sort((a, b) => b.event_count - a.event_count);

  return {
    export_metadata: {
      type: 'location-guides',
      generated_at: new Date().toISOString(),
      location_count: locations.length,
      version: '1.0',
    },
    locations,
  };
}

// ────────────────────────────────────────────
// Props Catalog
// ────────────────────────────────────────────

export interface PropEntry {
  entry_id: string;
  title: string;
  date_start: string;
  era: string;
  description: string;
}

export interface PropCatalogItem {
  id: string;
  name: string;
  description: string;
  narrative_function: string;
  plot_significance: string;
  entry_type: EntryType;
  arc?: string;
  universe_id?: string;
  /** Entries where this prop appears, sorted chronologically */
  appearances: PropEntry[];
  /** People who interact with this prop */
  people: Array<{ id: string; name: string; role: string }>;
  /** Places where this prop can be found */
  places: Array<{ id: string; name: string; type: string }>;
}

export interface PropsCatalogExport {
  export_metadata: {
    type: 'props-catalog';
    generated_at: string;
    prop_count: number;
    version: string;
  };
  props: PropCatalogItem[];
}

export function buildPropsCatalog(data: DataStore): PropsCatalogExport {
  const props: PropCatalogItem[] = [];

  for (const prop of (data.props ?? [])) {
    // Resolve appearances
    const appearances: PropEntry[] = prop.appears_in
      .map((eid) => data.entriesById.get(eid))
      .filter(Boolean)
      .map((entry) => ({
        entry_id: entry!.id,
        title: entry!.title,
        date_start: entry!.date_start,
        era: entry!.era,
        description: entry!.description,
      }))
      .sort((a, b) => parseDate(a.date_start) - parseDate(b.date_start));

    // Resolve people
    const people = (prop.associated_people ?? [])
      .map((pid) => data.peopleById.get(pid))
      .filter(Boolean)
      .map((p) => ({ id: p!.id, name: p!.name, role: p!.role }));

    // Resolve places
    const places = (prop.associated_places ?? [])
      .map((pid) => data.placesById.get(pid))
      .filter(Boolean)
      .map((p) => ({ id: p!.id, name: p!.name, type: p!.type }));

    props.push({
      id: prop.id,
      name: prop.name,
      description: prop.description,
      narrative_function: prop.narrative_function,
      plot_significance: prop.plot_significance,
      entry_type: (prop.entry_type ?? 'fantasy') as EntryType,
      arc: prop.arc,
      universe_id: prop.universe_id,
      appearances,
      people,
      places,
    });
  }

  return {
    export_metadata: {
      type: 'props-catalog',
      generated_at: new Date().toISOString(),
      prop_count: props.length,
      version: '1.0',
    },
    props,
  };
}

// ────────────────────────────────────────────
// Combined Writer Export
// ────────────────────────────────────────────

export interface WriterExport {
  export_metadata: {
    type: 'writer-full';
    generated_at: string;
    version: string;
  };
  characters: CharacterDossierExport;
  locations: LocationGuideExport;
  props: PropsCatalogExport;
}

export function buildWriterExport(data: DataStore): WriterExport {
  return {
    export_metadata: {
      type: 'writer-full',
      generated_at: new Date().toISOString(),
      version: '1.0',
    },
    characters: buildCharacterDossiers(data),
    locations: buildLocationGuides(data),
    props: buildPropsCatalog(data),
  };
}
