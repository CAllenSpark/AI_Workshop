/**
 * Unit tests for project-manager
 * Covers: CRUD, active project, book management, import/export
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listProjects,
  getProject,
  getActiveProjectId,
  setActiveProjectId,
  createProject,
  updateProject,
  deleteProject,
  loadProjectData,
  saveProjectData,
  addBook,
  removeBook,
  exportProject,
  importProject,
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT,
} from './project-manager';
import type { ProjectData } from '../types';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe('listProjects', () => {
  it('returns default project when no user projects exist', () => {
    const projects = listProjects();
    expect(projects.length).toBe(1);
    expect(projects[0].id).toBe(DEFAULT_PROJECT_ID);
    expect(projects[0].name).toBe('Vashon Island Research');
  });

  it('returns default project first then user projects', () => {
    createProject('Trance', 'A youth crime story', 'Modern New York');
    const projects = listProjects();
    expect(projects.length).toBe(2);
    expect(projects[0].id).toBe(DEFAULT_PROJECT_ID);
    expect(projects[1].name).toBe('Trance');
  });
});

describe('getProject', () => {
  it('returns default project by id', () => {
    const project = getProject(DEFAULT_PROJECT_ID);
    expect(project).toBeDefined();
    expect(project!.name).toBe('Vashon Island Research');
  });

  it('returns user project by id', () => {
    const created = createProject('Room 33', 'A mystery', 'Vashon Island, WA', 'mystery');
    const found = getProject(created.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe('Room 33');
    expect(found!.genre).toBe('mystery');
  });

  it('returns undefined for unknown id', () => {
    expect(getProject('nonexistent')).toBeUndefined();
  });
});

describe('getActiveProjectId / setActiveProjectId', () => {
  it('defaults to default project id', () => {
    expect(getActiveProjectId()).toBe(DEFAULT_PROJECT_ID);
  });

  it('returns the id that was set', () => {
    setActiveProjectId('some-project-id');
    expect(getActiveProjectId()).toBe('some-project-id');
  });
});

describe('createProject', () => {
  it('creates a project with the given fields', () => {
    const project = createProject('Trance', 'Youth crime', 'Modern New York', 'sci-fi');
    expect(project.name).toBe('Trance');
    expect(project.description).toBe('Youth crime');
    expect(project.setting).toBe('Modern New York');
    expect(project.genre).toBe('sci-fi');
    expect(project.books).toEqual([]);
    expect(project.id).toMatch(/^trance-/);
  });

  it('generates IDs based on the project name slug', () => {
    const p1 = createProject('My Cool Project', 'Desc', 'Setting');
    expect(p1.id).toMatch(/^my-cool-project-/);
  });

  it('stores empty project data', () => {
    const project = createProject('Empty World', 'Nothing yet', 'Nowhere');
    const data = loadProjectData(project.id);
    expect(data).toBeDefined();
    expect(data!.entries).toEqual([]);
    expect(data!.people).toEqual([]);
    expect(data!.places).toEqual([]);
    expect(data!.props).toEqual([]);
  });
});

describe('updateProject', () => {
  it('updates project metadata', () => {
    const project = createProject('Original', 'Desc', 'Setting');
    project.name = 'Updated';
    project.genre = 'thriller';
    updateProject(project);

    const found = getProject(project.id);
    expect(found!.name).toBe('Updated');
    expect(found!.genre).toBe('thriller');
  });

  it('does not modify default project', () => {
    const defaultCopy = { ...DEFAULT_PROJECT, name: 'Hacked' };
    updateProject(defaultCopy);
    expect(getProject(DEFAULT_PROJECT_ID)!.name).toBe('Vashon Island Research');
  });
});

describe('deleteProject', () => {
  it('removes a project from the registry', () => {
    const project = createProject('ToDelete', 'Desc', 'Setting');
    expect(listProjects().length).toBe(2);
    deleteProject(project.id);
    expect(listProjects().length).toBe(1);
  });

  it('removes project data from storage', () => {
    const project = createProject('ToDelete', 'Desc', 'Setting');
    deleteProject(project.id);
    expect(loadProjectData(project.id)).toBeNull();
  });

  it('resets active project to default if deleted project was active', () => {
    const project = createProject('Active', 'Desc', 'Setting');
    setActiveProjectId(project.id);
    deleteProject(project.id);
    expect(getActiveProjectId()).toBe(DEFAULT_PROJECT_ID);
  });

  it('does not delete the default project', () => {
    deleteProject(DEFAULT_PROJECT_ID);
    expect(listProjects().length).toBe(1);
    expect(listProjects()[0].id).toBe(DEFAULT_PROJECT_ID);
  });
});

describe('loadProjectData / saveProjectData', () => {
  it('returns null for default project (loads from static files)', () => {
    expect(loadProjectData(DEFAULT_PROJECT_ID)).toBeNull();
  });

  it('loads project data that was created', () => {
    const project = createProject('Test', 'Desc', 'Setting');
    const data = loadProjectData(project.id);
    expect(data).toBeDefined();
    expect(data!.project.id).toBe(project.id);
  });

  it('saves and loads updated project data', () => {
    const project = createProject('Test', 'Desc', 'Setting');
    const data = loadProjectData(project.id)!;
    data.entries = [
      {
        id: 'e-test-001',
        title: 'Test Entry',
        date_start: '2020',
        era: 'modern' as any,
        layers: ['event'],
        description: 'A test entry',
        people: [],
        places: [],
        sources: [],
        tags: [],
      },
    ];
    saveProjectData(data);

    const loaded = loadProjectData(project.id)!;
    expect(loaded.entries.length).toBe(1);
    expect(loaded.entries[0].title).toBe('Test Entry');
  });

  it('does not save data for default project', () => {
    const data: ProjectData = {
      project: DEFAULT_PROJECT,
      entries: [],
      people: [],
      places: [],
      environment: [],
      universes: [],
      props: [],
    };
    saveProjectData(data);
    // Should not have stored anything for default
    expect(localStorage.getItem('wrc_project_default')).toBeNull();
  });
});

describe('addBook / removeBook', () => {
  it('adds a book to a project', () => {
    const project = createProject('Story', 'Desc', 'Setting');
    const book = addBook(project.id, 'Season 1', 'The first season');
    expect(book).toBeDefined();
    expect(book!.name).toBe('Season 1');
    expect(book!.id).toBe('season-1');
    expect(book!.order).toBe(1);
  });

  it('assigns incrementing order numbers', () => {
    const project = createProject('Story', 'Desc', 'Setting');
    const b1 = addBook(project.id, 'Season 1')!;
    const b2 = addBook(project.id, 'Season 2')!;
    expect(b1.order).toBe(1);
    expect(b2.order).toBe(2);
  });

  it('cycles through colors', () => {
    const project = createProject('Story', 'Desc', 'Setting');
    const b1 = addBook(project.id, 'S1')!;
    const b2 = addBook(project.id, 'S2')!;
    expect(b1.color).not.toBe(b2.color);
  });

  it('does not add books to default project', () => {
    const result = addBook(DEFAULT_PROJECT_ID, 'Book 1');
    expect(result).toBeNull();
  });

  it('removes a book from a project', () => {
    const project = createProject('Story', 'Desc', 'Setting');
    const book = addBook(project.id, 'Season 1')!;
    removeBook(project.id, book.id);

    const updated = getProject(project.id)!;
    expect(updated.books.length).toBe(0);
  });
});

describe('exportProject / importProject', () => {
  it('exports null for default project', () => {
    expect(exportProject(DEFAULT_PROJECT_ID)).toBeNull();
  });

  it('exports user project data', () => {
    const project = createProject('Exportable', 'Desc', 'Setting');
    const exported = exportProject(project.id);
    expect(exported).toBeDefined();
    expect(exported!.project.name).toBe('Exportable');
  });

  it('imports a full ProjectData object', () => {
    const original = createProject('Original', 'Desc', 'Setting A');
    const data = loadProjectData(original.id)!;

    const imported = importProject(data, { name: 'Imported Copy' });
    expect(imported.name).toBe('Imported Copy');
    expect(imported.id).not.toBe(original.id); // New ID

    // Should appear in project list
    const projects = listProjects();
    expect(projects.find((p) => p.id === imported.id)).toBeDefined();
  });

  it('imports raw research data', () => {
    const rawData = {
      entries: [
        {
          id: 'e-raw-001',
          title: 'Raw Entry',
          date_start: '1500',
          era: 'indigenous' as any,
          layers: ['event' as const],
          description: 'A raw entry',
          people: [],
          places: [],
          sources: [],
          tags: [],
        },
      ],
    };

    const project = importProject(rawData, {
      name: 'Imported Research',
      setting: 'England',
      genre: 'Arthurian',
    });

    expect(project.name).toBe('Imported Research');
    expect(project.setting).toBe('England');
    expect(project.genre).toBe('Arthurian');

    const data = loadProjectData(project.id)!;
    expect(data.entries.length).toBe(1);
    expect(data.entries[0].title).toBe('Raw Entry');
  });

  it('handles raw data with environment_features alias', () => {
    const rawData = {
      environment_features: [
        { id: 'env-001', name: 'Forest', type: 'biome', description: 'Dense', time_relevance: 'always' },
      ],
    };

    const project = importProject(rawData, { name: 'Env Test' });
    const data = loadProjectData(project.id)!;
    expect(data.environment.length).toBe(1);
  });
});
