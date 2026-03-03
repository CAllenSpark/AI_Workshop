/**
 * M11 Validation: Worldbuilding Workflow Walkthrough
 *
 * Tests the complete writer workflow: create project -> add data -> filter -> export
 * This is the E2E-style integration test that validates the entire data pipeline.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createProject,
  loadProjectData,
  saveProjectData,
  addBook,
  exportProject,
  importProject,
  deleteProject,
  listProjects,
  DEFAULT_PROJECT_ID,
} from '../data/project-manager';
import { buildDataStore } from '../data/loader';
import {
  buildCharacterDossiers,
  buildLocationGuides,
  buildPropsCatalog,
  buildWriterExport,
} from '../data/writer-export';
import type { TimelineEntry, Person, Place, NarrativeProp } from '../types';

beforeEach(() => {
  localStorage.clear();
});

describe('Worldbuilding Workflow: Room 33', () => {
  it('complete workflow from project creation to export', () => {
    // ── Step 1: Create a new project ──
    const project = createProject(
      'Room 33',
      'A mystery across time set in an imagined lodge on Vashon Island',
      'Vashon Island, WA',
      'mystery',
    );
    expect(project.name).toBe('Room 33');
    expect(project.setting).toBe('Vashon Island, WA');
    expect(project.genre).toBe('mystery');

    // ── Step 2: Add books/seasons ──
    const book1 = addBook(project.id, 'Season 1: The Lodge', 'Discovery of Room 33')!;
    const book2 = addBook(project.id, 'Season 2: The Past', 'Time-travel investigations')!;
    expect(book1.order).toBe(1);
    expect(book2.order).toBe(2);

    // ── Step 3: Populate research data ──
    const data = loadProjectData(project.id)!;

    const entries: TimelineEntry[] = [
      // Historical backdrop
      {
        id: 'r33-h001', title: 'Lodge Built', date_start: '1920', era: 'early-20th' as any,
        layers: ['event', 'place'], description: 'The Vashon Lodge was built overlooking Quartermaster Harbor.',
        people: [], places: ['Vashon Lodge'], sources: [{ title: 'County Records', type: 'primary' }],
        tags: ['lodge', 'construction'], entry_type: 'historical', scope: 'vashon',
      },
      {
        id: 'r33-h002', title: 'Room 33 Sealed', date_start: '1942', era: 'wwii' as any,
        layers: ['event'], description: 'Room 33 was mysteriously sealed during wartime.',
        people: ['Margaret Stone'], places: ['Vashon Lodge'], sources: [],
        tags: ['mystery', 'room-33'], entry_type: 'historical', scope: 'vashon',
      },
      // Fantasy/creative entries — Season 1
      {
        id: 'r33-f001', title: 'Room 33 Discovered', date_start: '2024', era: 'modern' as any,
        layers: ['event', 'person'], description: 'A renovation crew discovers the sealed Room 33.',
        people: ['Jake Rivers'], places: ['Vashon Lodge'],
        sources: [], tags: ['discovery', 'mystery'],
        entry_type: 'fantasy', scope: 'vashon',
        narrative: { arc: 'the-discovery', beat: 'inciting-incident', book: 'season-1-the-lodge',
          anchors: [{ entry_id: 'r33-h002', relationship: 'consequence_of', description: 'The sealed room from 1942 is finally opened' }],
        },
      },
      {
        id: 'r33-f002', title: 'The Journal Found', date_start: '2024', era: 'modern' as any,
        layers: ['event'], description: 'Jake finds Margaret Stone\'s journal hidden in a wall cavity.',
        people: ['Jake Rivers', 'Margaret Stone'], places: ['Vashon Lodge'],
        sources: [], tags: ['clue', 'journal'],
        entry_type: 'fantasy', scope: 'vashon',
        narrative: { arc: 'the-discovery', beat: 'rising-action', book: 'season-1-the-lodge' },
      },
      // Season 2 entries
      {
        id: 'r33-f003', title: 'Time Slip Begins', date_start: '2024', era: 'modern' as any,
        layers: ['event', 'person'], description: 'Jake experiences his first time slip to 1942.',
        people: ['Jake Rivers'], places: ['Vashon Lodge'],
        sources: [], tags: ['time-travel', 'supernatural'],
        entry_type: 'fantasy', scope: 'vashon',
        narrative: { arc: 'time-investigations', beat: 'inciting-incident', book: 'season-2-the-past' },
      },
    ];

    const people: Person[] = [
      { id: 'r33-p001', name: 'Jake Rivers', description: 'A renovation contractor who discovers Room 33', role: 'protagonist', entry_type: 'fantasy' },
      { id: 'r33-p002', name: 'Margaret Stone', description: 'The 1940s lodge owner who sealed Room 33', role: 'key historical figure', entry_type: 'historical' },
    ];

    const places: Place[] = [
      { id: 'r33-pl001', name: 'Vashon Lodge', description: 'A historic lodge overlooking Quartermaster Harbor, containing the mysterious Room 33', type: 'building', coordinates: { lat: 47.38, lng: -122.46 } },
    ];

    const props: NarrativeProp[] = [
      {
        id: 'r33-prop001', name: "Margaret's Journal", description: 'A leather-bound journal from 1942 containing coded entries about Room 33',
        narrative_function: 'clue', plot_significance: 'The journal contains coded references that guide Jake\'s investigation',
        appears_in: ['r33-f002'], associated_people: ['r33-p001', 'r33-p002'], associated_places: ['r33-pl001'],
        arc: 'the-discovery', entry_type: 'fantasy',
      },
      {
        id: 'r33-prop002', name: 'Room 33 Key', description: 'An ornate brass key with unusual symbols',
        narrative_function: 'key', plot_significance: 'Unlocks the time slip mechanism in Room 33',
        appears_in: ['r33-f001', 'r33-f003'], associated_people: ['r33-p001'], associated_places: ['r33-pl001'],
        arc: 'the-discovery', entry_type: 'fantasy',
      },
    ];

    data.entries = entries;
    data.people = people;
    data.places = places;
    data.props = props;
    saveProjectData(data);

    // ── Step 4: Build a DataStore and verify indexes ──
    const loaded = loadProjectData(project.id)!;
    const store = buildDataStore(
      loaded.entries, loaded.people, loaded.places,
      loaded.environment, loaded.universes, loaded.props,
    );

    expect(store.entries.length).toBe(5);
    expect(store.people.length).toBe(2);
    expect(store.places.length).toBe(1);
    expect(store.props.length).toBe(2);

    // Indexes work
    expect(store.entriesById.get('r33-f001')?.title).toBe('Room 33 Discovered');
    expect(store.peopleByName.get('Jake Rivers')?.role).toBe('protagonist');
    expect(store.placesByName.get('Vashon Lodge')?.type).toBe('building');

    // Type filtering works
    const historical = store.entries.filter(e => (e.entry_type ?? 'historical') === 'historical');
    const fantasy = store.entries.filter(e => e.entry_type === 'fantasy');
    expect(historical.length).toBe(2);
    expect(fantasy.length).toBe(3);

    // Book filtering works
    const s1 = store.entries.filter(e => e.narrative?.book === 'season-1-the-lodge');
    const s2 = store.entries.filter(e => e.narrative?.book === 'season-2-the-past');
    expect(s1.length).toBe(2);
    expect(s2.length).toBe(1);

    // ── Step 5: Generate writer exports ──
    const charExport = buildCharacterDossiers(store);
    expect(charExport.characters.length).toBe(2);

    const jake = charExport.characters.find(c => c.name === 'Jake Rivers')!;
    expect(jake.appearances.length).toBe(3); // f001, f002, f003
    expect(jake.arcs['the-discovery']).toBeDefined();
    expect(jake.props.length).toBeGreaterThan(0);

    const margaret = charExport.characters.find(c => c.name === 'Margaret Stone')!;
    expect(margaret.appearances.length).toBe(2); // h002, f002

    const locExport = buildLocationGuides(store);
    const lodge = locExport.locations.find(l => l.name === 'Vashon Lodge')!;
    expect(lodge.event_count).toBe(5); // All entries reference the lodge
    expect(lodge.timeline.length).toBeGreaterThan(0);
    expect(lodge.props.length).toBe(2);
    expect(lodge.associated_people).toContain('Jake Rivers');
    expect(lodge.associated_people).toContain('Margaret Stone');

    const propExport = buildPropsCatalog(store);
    expect(propExport.props.length).toBe(2);
    const journal = propExport.props.find(p => p.name === "Margaret's Journal")!;
    expect(journal.narrative_function).toBe('clue');
    expect(journal.people.length).toBe(2);
    const key = propExport.props.find(p => p.name === 'Room 33 Key')!;
    expect(key.narrative_function).toBe('key');
    expect(key.appearances.length).toBe(2);

    // Combined export
    const fullExport = buildWriterExport(store);
    expect(fullExport.export_metadata.type).toBe('writer-full');

    // ── Step 6: JSON round-trip the full export ──
    const json = JSON.stringify(fullExport);
    const parsed = JSON.parse(json);
    expect(parsed.characters.characters.length).toBe(2);
    expect(parsed.locations.locations.length).toBe(1);
    expect(parsed.props.props.length).toBe(2);

    // ── Step 7: Export project and re-import as a copy ──
    const projectExport = exportProject(project.id)!;
    expect(projectExport.entries.length).toBe(5);

    const copy = importProject(projectExport, { name: 'Room 33 (Backup)' });
    expect(copy.name).toBe('Room 33 (Backup)');
    const copyData = loadProjectData(copy.id)!;
    expect(copyData.entries.length).toBe(5);
    expect(copyData.people.length).toBe(2);
    expect(copyData.props.length).toBe(2);

    // ── Step 8: Verify project isolation ──
    deleteProject(project.id);
    expect(loadProjectData(project.id)).toBeNull();

    // The copy still exists independently
    const copyStillExists = loadProjectData(copy.id);
    expect(copyStillExists).toBeDefined();
    expect(copyStillExists!.entries.length).toBe(5);

    // Project list shows only default + copy
    const remaining = listProjects();
    expect(remaining.length).toBe(2);
    expect(remaining[0].id).toBe(DEFAULT_PROJECT_ID);
    expect(remaining[1].name).toBe('Room 33 (Backup)');
  });
});

describe('Worldbuilding Workflow: Content Classification', () => {
  it('entries maintain correct classification through the pipeline', () => {
    const project = createProject('ClassTest', 'Desc', 'Setting');
    const pd = loadProjectData(project.id)!;

    pd.entries = [
      makeEntry('ct-001', 'Real Event', '1900', 'historical'),
      makeEntry('ct-002', 'Fantasy Event', '1900', 'fantasy'),
      makeEntry('ct-003', 'Speculative Event', '1900', 'speculative'),
    ];
    saveProjectData(pd);

    const loaded = loadProjectData(project.id)!;
    const store = buildDataStore(loaded.entries, loaded.people, loaded.places, loaded.environment, loaded.universes, loaded.props);

    // Type index is correct
    expect(store.entriesByType.get('historical')?.length).toBe(1);
    expect(store.entriesByType.get('fantasy')?.length).toBe(1);
    expect(store.entriesByType.get('speculative')?.length).toBe(1);

    // Export preserves types
    const chars = buildCharacterDossiers(store);
    const json = JSON.stringify(chars);
    const parsed = JSON.parse(json);
    expect(parsed.export_metadata.type).toBe('character-dossiers');
  });
});

describe('Worldbuilding Workflow: Empty Project', () => {
  it('exports work correctly with no data', () => {
    const project = createProject('Empty', 'Nothing here', 'Nowhere');
    const pd = loadProjectData(project.id)!;
    const store = buildDataStore(pd.entries, pd.people, pd.places, pd.environment, pd.universes, pd.props);

    expect(store.entries.length).toBe(0);

    const chars = buildCharacterDossiers(store);
    expect(chars.characters.length).toBe(0);

    const locs = buildLocationGuides(store);
    expect(locs.locations.length).toBe(0);

    const props = buildPropsCatalog(store);
    expect(props.props.length).toBe(0);

    const full = buildWriterExport(store);
    const json = JSON.stringify(full);
    expect(json).toBeTruthy();
    expect(JSON.parse(json).export_metadata.type).toBe('writer-full');
  });
});

describe('Worldbuilding Workflow: Cross-Reference Integrity', () => {
  it('narrative anchors reference valid entries', () => {
    const project = createProject('AnchorTest', 'Desc', 'Setting');
    const pd = loadProjectData(project.id)!;

    pd.entries = [
      { ...makeEntry('anc-hist', 'Historical Anchor', '1800', 'historical') },
      {
        ...makeEntry('anc-fan', 'Fantasy Event', '2024', 'fantasy'),
        narrative: {
          arc: 'test-arc',
          beat: 'inciting-incident' as any,
          anchors: [{ entry_id: 'anc-hist', relationship: 'consequence_of' as any, description: 'Based on real event' }],
        },
      },
    ];
    saveProjectData(pd);

    const loaded = loadProjectData(project.id)!;
    const store = buildDataStore(loaded.entries, loaded.people, loaded.places, loaded.environment, loaded.universes, loaded.props);

    // Verify the anchor target exists
    const fantasyEntry = store.entriesById.get('anc-fan')!;
    expect(fantasyEntry.narrative?.anchors).toHaveLength(1);
    const anchorTarget = store.entriesById.get(fantasyEntry.narrative!.anchors![0].entry_id);
    expect(anchorTarget).toBeDefined();
    expect(anchorTarget!.title).toBe('Historical Anchor');

    // Warnings should be clean (no missing references)
    const missingRefWarnings = store.warnings.filter(w => w.type === 'missing_reference');
    expect(missingRefWarnings.length).toBe(0);
  });

  it('prop references resolve correctly', () => {
    const project = createProject('PropRefTest', 'Desc', 'Setting');
    const pd = loadProjectData(project.id)!;

    pd.entries = [makeEntry('pr-001', 'Entry One', '2020', 'fantasy')];
    pd.people = [{ id: 'pr-p001', name: 'Hero', description: 'A hero', role: 'hero' }];
    pd.places = [{ id: 'pr-pl001', name: 'Castle', description: 'A castle', type: 'building' }];
    pd.props = [{
      id: 'pr-prop001', name: 'Magic Sword', description: 'A magic sword',
      narrative_function: 'weapon', plot_significance: 'The chosen weapon',
      appears_in: ['pr-001'], associated_people: ['pr-p001'], associated_places: ['pr-pl001'],
      entry_type: 'fantasy',
    }];
    saveProjectData(pd);

    const loaded = loadProjectData(project.id)!;
    const store = buildDataStore(loaded.entries, loaded.people, loaded.places, loaded.environment, loaded.universes, loaded.props);

    const catalog = buildPropsCatalog(store);
    const sword = catalog.props.find(p => p.name === 'Magic Sword')!;
    expect(sword.appearances.length).toBe(1);
    expect(sword.appearances[0].title).toBe('Entry One');
    expect(sword.people.length).toBe(1);
    expect(sword.people[0].name).toBe('Hero');
    expect(sword.places.length).toBe(1);
    expect(sword.places[0].name).toBe('Castle');
  });
});

function makeEntry(id: string, title: string, date_start: string, entry_type: string): TimelineEntry {
  return {
    id, title, date_start, era: 'modern' as any, layers: ['event'],
    description: `Description for ${title}`, people: [], places: [],
    sources: [], tags: [], entry_type: entry_type as any, scope: 'vashon',
  };
}
