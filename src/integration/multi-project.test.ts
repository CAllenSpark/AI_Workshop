/**
 * Integration tests for multi-project workflows
 * M11 Validation: Tests project isolation, switching, data integrity, and book management
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  listProjects,
  getProject,
  createProject,
  deleteProject,
  loadProjectData,
  saveProjectData,
  addBook,
  removeBook,
  importProject,
  exportProject,
  getActiveProjectId,
  setActiveProjectId,
  DEFAULT_PROJECT_ID,
} from '../data/project-manager';
import { buildDataStore } from '../data/loader';
import type { TimelineEntry, ProjectData } from '../types';

beforeEach(() => {
  localStorage.clear();
});

describe('Multi-Project Isolation', () => {
  it('projects have fully independent data stores', () => {
    const trance = createProject('Trance', 'Youth crime story', 'Modern New York', 'sci-fi');
    const merlin = createProject("Merlin's Challenge", 'Arthurian legends', 'Medieval England', 'fantasy');

    // Add entries to Trance
    const tranceData = loadProjectData(trance.id)!;
    tranceData.entries = [
      makeEntry('tr-001', 'Psychic Awakening', '2024', 'modern'),
      makeEntry('tr-002', 'First Crime Scene', '2024', 'modern'),
    ];
    tranceData.people = [{ id: 'tp-001', name: 'Alex', description: 'Teen psychic', role: 'protagonist' }];
    saveProjectData(tranceData);

    // Add entries to Merlin's Challenge
    const merlinData = loadProjectData(merlin.id)!;
    merlinData.entries = [
      makeEntry('mc-001', 'Sword in the Stone', '500', 'exploration'),
      makeEntry('mc-002', 'Knights Gather', '501', 'exploration'),
      makeEntry('mc-003', 'The Holy Grail Quest', '510', 'exploration'),
    ];
    merlinData.people = [{ id: 'mp-001', name: 'Merlin', description: 'The wizard', role: 'wizard' }];
    saveProjectData(merlinData);

    // Verify isolation
    const tranceLoaded = loadProjectData(trance.id)!;
    const merlinLoaded = loadProjectData(merlin.id)!;

    expect(tranceLoaded.entries.length).toBe(2);
    expect(merlinLoaded.entries.length).toBe(3);
    expect(tranceLoaded.people[0].name).toBe('Alex');
    expect(merlinLoaded.people[0].name).toBe('Merlin');

    // Trance should not contain Merlin data
    expect(tranceLoaded.entries.find(e => e.title === 'Sword in the Stone')).toBeUndefined();
    // Merlin should not contain Trance data
    expect(merlinLoaded.entries.find(e => e.title === 'Psychic Awakening')).toBeUndefined();
  });

  it('deleting one project does not affect another', () => {
    const p1 = createProject('Project A', 'Desc', 'Setting A');
    const p2 = createProject('Project B', 'Desc', 'Setting B');

    const p2Data = loadProjectData(p2.id)!;
    p2Data.entries = [makeEntry('b-001', 'B Entry', '2020', 'modern')];
    saveProjectData(p2Data);

    deleteProject(p1.id);

    expect(loadProjectData(p1.id)).toBeNull();
    const p2Loaded = loadProjectData(p2.id)!;
    expect(p2Loaded.entries.length).toBe(1);
    expect(p2Loaded.entries[0].title).toBe('B Entry');
  });

  it('buildDataStore produces valid indexes from project data', () => {
    const project = createProject('Index Test', 'Desc', 'Setting');
    const pd = loadProjectData(project.id)!;
    pd.entries = [
      makeEntry('ix-001', 'Historical Event', '1800', 'pioneer', 'historical'),
      makeEntry('ix-002', 'Fantasy Event', '1800', 'pioneer', 'fantasy'),
    ];
    pd.people = [{ id: 'ixp-001', name: 'Test Person', description: 'A test', role: 'hero' }];
    pd.entries[0].people = ['Test Person'];
    saveProjectData(pd);

    const loaded = loadProjectData(project.id)!;
    const store = buildDataStore(loaded.entries, loaded.people, loaded.places, loaded.environment, loaded.universes, loaded.props);

    expect(store.entries.length).toBe(2);
    expect(store.entriesById.get('ix-001')?.title).toBe('Historical Event');
    expect(store.entriesByType.get('fantasy')?.length).toBe(1);
    expect(store.peopleByName.get('Test Person')?.id).toBe('ixp-001');
    expect(store.parsedDates.get('ix-001')).toBe(1800);
  });

  it('project switching preserves active project across calls', () => {
    const p1 = createProject('One', 'Desc', 'Setting');
    const p2 = createProject('Two', 'Desc', 'Setting');

    setActiveProjectId(p1.id);
    expect(getActiveProjectId()).toBe(p1.id);

    setActiveProjectId(p2.id);
    expect(getActiveProjectId()).toBe(p2.id);

    setActiveProjectId(DEFAULT_PROJECT_ID);
    expect(getActiveProjectId()).toBe(DEFAULT_PROJECT_ID);
  });
});

describe('Multi-Book / Season Workflows', () => {
  it('books are added in order with distinct colors', () => {
    const project = createProject('Twin Peaks', 'Mystery drama', 'Twin Peaks, WA', 'mystery');

    const s1 = addBook(project.id, 'Season 1', 'The original mystery')!;
    const s2 = addBook(project.id, 'Season 2', 'The investigation deepens')!;
    const s3 = addBook(project.id, 'Season 3', 'The Return')!;

    expect(s1.order).toBe(1);
    expect(s2.order).toBe(2);
    expect(s3.order).toBe(3);

    // All have distinct colors
    const colors = new Set([s1.color, s2.color, s3.color]);
    expect(colors.size).toBe(3);
  });

  it('entries can be tagged with book/season via narrative.book', () => {
    const project = createProject('Multi-Book', 'Desc', 'Setting');
    addBook(project.id, 'Book 1');
    addBook(project.id, 'Book 2');

    const pd = loadProjectData(project.id)!;
    pd.entries = [
      { ...makeEntry('mb-001', 'Ch 1 Event', '1800', 'pioneer', 'fantasy'), narrative: { book: 'book-1', arc: 'main' } },
      { ...makeEntry('mb-002', 'Ch 2 Event', '1850', 'pioneer', 'fantasy'), narrative: { book: 'book-2', arc: 'main' } },
      makeEntry('mb-003', 'Historical Backdrop', '1800', 'pioneer', 'historical'),
    ];
    saveProjectData(pd);

    const loaded = loadProjectData(project.id)!;
    const store = buildDataStore(loaded.entries, loaded.people, loaded.places, loaded.environment, loaded.universes, loaded.props);

    // Filter by book 1
    const book1Entries = store.entries.filter(e => e.narrative?.book === 'book-1');
    expect(book1Entries.length).toBe(1);
    expect(book1Entries[0].title).toBe('Ch 1 Event');

    // Filter by book 2
    const book2Entries = store.entries.filter(e => e.narrative?.book === 'book-2');
    expect(book2Entries.length).toBe(1);
    expect(book2Entries[0].title).toBe('Ch 2 Event');

    // Historical entries have no book tag
    const untagged = store.entries.filter(e => !e.narrative?.book);
    expect(untagged.length).toBe(1);
    expect(untagged[0].entry_type).toBe('historical');
  });

  it('removing a book does not remove entries', () => {
    const project = createProject('RemoveBook', 'Desc', 'Setting');
    addBook(project.id, 'Season 1');

    const pd = loadProjectData(project.id)!;
    pd.entries = [
      { ...makeEntry('rb-001', 'S1 Event', '2020', 'modern', 'fantasy'), narrative: { book: 'season-1' } },
    ];
    saveProjectData(pd);

    removeBook(project.id, 'season-1');

    // Entries still exist even though book is removed
    const loaded = loadProjectData(project.id)!;
    expect(loaded.entries.length).toBe(1);
    expect(loaded.entries[0].narrative?.book).toBe('season-1');

    // Book is removed from project metadata
    const updated = getProject(project.id)!;
    expect(updated.books.length).toBe(0);
  });
});

describe('Import / Export Round-Trip', () => {
  it('export + import produces identical data', () => {
    const original = createProject('Roundtrip', 'Test export/import', 'Anywhere');
    const pd = loadProjectData(original.id)!;
    pd.entries = [
      makeEntry('rt-001', 'Event One', '1900', 'growth-industry'),
      makeEntry('rt-002', 'Event Two', '1950', 'state-ferry'),
    ];
    pd.people = [{ id: 'rtp-001', name: 'Hero', description: 'The hero', role: 'protagonist' }];
    pd.places = [{ id: 'rtpl-001', name: 'Castle', description: 'A castle', type: 'landmark' }];
    saveProjectData(pd);

    const exported = exportProject(original.id)!;
    expect(exported).toBeDefined();
    expect(exported.entries.length).toBe(2);

    // Import as new project
    const imported = importProject(exported, { name: 'Roundtrip Copy' });
    expect(imported.id).not.toBe(original.id);
    expect(imported.name).toBe('Roundtrip Copy');

    const importedData = loadProjectData(imported.id)!;
    expect(importedData.entries.length).toBe(2);
    expect(importedData.people.length).toBe(1);
    expect(importedData.places.length).toBe(1);
    expect(importedData.entries[0].title).toBe('Event One');
  });

  it('raw JSON import creates a usable project', () => {
    const rawResearch = {
      entries: [
        makeEntry('raw-001', 'Raw Event', '1200', 'exploration'),
      ],
      people: [
        { id: 'rawp-001', name: 'King Arthur', description: 'The king', role: 'monarch' },
      ],
    };

    const project = importProject(rawResearch, {
      name: "Merlin's Challenge",
      setting: 'Medieval England',
      genre: 'Arthurian fantasy',
    });

    expect(project.setting).toBe('Medieval England');
    expect(project.genre).toBe('Arthurian fantasy');

    const data = loadProjectData(project.id)!;
    const store = buildDataStore(data.entries, data.people, data.places, data.environment, data.universes, data.props);

    expect(store.entries.length).toBe(1);
    expect(store.entriesById.get('raw-001')?.title).toBe('Raw Event');
    expect(store.peopleByName.get('King Arthur')).toBeDefined();
  });

  it('three independent projects coexist', () => {
    const trance = createProject('Trance', 'High school psychics', 'Modern New York', 'sci-fi');
    const merlin = createProject("Merlin's Challenge", 'Arthurian legends', 'Medieval England', 'fantasy');
    const room33 = createProject('Room 33', 'Cross-time mystery', 'Vashon Island, WA', 'mystery');

    const projects = listProjects();
    expect(projects.length).toBe(4); // default + 3 user projects
    expect(projects.map(p => p.name)).toContain('Trance');
    expect(projects.map(p => p.name)).toContain("Merlin's Challenge");
    expect(projects.map(p => p.name)).toContain('Room 33');

    // Each has independent data
    for (const p of [trance, merlin, room33]) {
      const data = loadProjectData(p.id);
      expect(data).toBeDefined();
      expect(data!.project.id).toBe(p.id);
    }
  });
});

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

function makeEntry(
  id: string,
  title: string,
  date_start: string,
  era: string,
  entry_type: string = 'historical',
): TimelineEntry {
  return {
    id,
    title,
    date_start,
    era: era as any,
    layers: ['event'],
    description: `Description for ${title}`,
    people: [],
    places: [],
    sources: [],
    tags: [],
    entry_type: entry_type as any,
    scope: 'vashon',
  };
}
