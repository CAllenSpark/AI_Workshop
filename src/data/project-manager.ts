/**
 * Project Manager
 *
 * Manages multiple isolated projects using localStorage.
 * Each project has its own entries, people, places, props, etc.
 *
 * Storage layout:
 *   wrc_projects        → Project[] (registry of all projects)
 *   wrc_active_project  → string (active project ID)
 *   wrc_project_{id}    → ProjectData (full data for one project)
 *
 * The "default" project loads from public/data/ static files (Vashon Island).
 * User-created projects live entirely in localStorage.
 */
import type {
  Project,
  ProjectData,
  Book,
  TimelineEntry,
  Person,
  Place,
  EnvironmentFeature,
  Universe,
  NarrativeProp,
} from '../types';

const PROJECTS_KEY = 'wrc_projects';
const ACTIVE_PROJECT_KEY = 'wrc_active_project';
const PROJECT_DATA_PREFIX = 'wrc_project_';

/** The built-in default project ID (loads from static files) */
export const DEFAULT_PROJECT_ID = 'default';

/** Default project metadata */
export const DEFAULT_PROJECT: Project = {
  id: DEFAULT_PROJECT_ID,
  name: 'Vashon Island Research',
  description: 'Historical and geographical research for Vashon Island, WA — prehistory to present.',
  setting: 'Vashon Island, WA',
  genre: 'historical research',
  books: [],
  created_at: '2026-03-02T00:00:00Z',
  updated_at: '2026-03-03T00:00:00Z',
};

// ────────────────────────────────────────────
// Project Registry
// ────────────────────────────────────────────

/** Get all projects (always includes the default project first) */
export function listProjects(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    const userProjects: Project[] = stored ? JSON.parse(stored) : [];
    return [DEFAULT_PROJECT, ...userProjects];
  } catch {
    return [DEFAULT_PROJECT];
  }
}

/** Get a project by ID */
export function getProject(id: string): Project | undefined {
  if (id === DEFAULT_PROJECT_ID) return DEFAULT_PROJECT;
  return listProjects().find((p) => p.id === id);
}

/** Get the active project ID */
export function getActiveProjectId(): string {
  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY) ?? DEFAULT_PROJECT_ID;
  } catch {
    return DEFAULT_PROJECT_ID;
  }
}

/** Set the active project */
export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch {
    // localStorage might be unavailable
  }
}

/** Generate a URL-friendly project ID from a name */
function generateProjectId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40);
  const suffix = Date.now().toString(36).slice(-4);
  return `${slug}-${suffix}`;
}

// ────────────────────────────────────────────
// Project CRUD
// ────────────────────────────────────────────

/** Create a new empty project */
export function createProject(
  name: string,
  description: string,
  setting: string,
  genre?: string,
): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: generateProjectId(name),
    name,
    description,
    setting,
    genre,
    books: [],
    created_at: now,
    updated_at: now,
  };

  // Add to registry
  const projects = listProjects().filter((p) => p.id !== DEFAULT_PROJECT_ID);
  projects.push(project);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

  // Create empty data store
  const data: ProjectData = {
    project,
    entries: [],
    people: [],
    places: [],
    environment: [],
    universes: [],
    props: [],
  };
  localStorage.setItem(PROJECT_DATA_PREFIX + project.id, JSON.stringify(data));

  return project;
}

/** Update project metadata (name, description, setting, genre, books) */
export function updateProject(project: Project): void {
  if (project.id === DEFAULT_PROJECT_ID) return; // Can't modify default

  project.updated_at = new Date().toISOString();

  // Update registry
  const projects = listProjects().filter((p) => p.id !== DEFAULT_PROJECT_ID);
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

  // Update project field in stored data
  const dataStr = localStorage.getItem(PROJECT_DATA_PREFIX + project.id);
  if (dataStr) {
    const data: ProjectData = JSON.parse(dataStr);
    data.project = project;
    localStorage.setItem(PROJECT_DATA_PREFIX + project.id, JSON.stringify(data));
  }
}

/** Delete a project and all its data */
export function deleteProject(id: string): void {
  if (id === DEFAULT_PROJECT_ID) return; // Can't delete default

  // Remove from registry
  const projects = listProjects().filter((p) => p.id !== DEFAULT_PROJECT_ID && p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

  // Remove data
  localStorage.removeItem(PROJECT_DATA_PREFIX + id);

  // If this was the active project, switch to default
  if (getActiveProjectId() === id) {
    setActiveProjectId(DEFAULT_PROJECT_ID);
  }
}

// ────────────────────────────────────────────
// Project Data
// ────────────────────────────────────────────

/** Load project data from localStorage (not for default project) */
export function loadProjectData(id: string): ProjectData | null {
  if (id === DEFAULT_PROJECT_ID) return null; // Default loads from static files

  try {
    const stored = localStorage.getItem(PROJECT_DATA_PREFIX + id);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/** Save project data to localStorage */
export function saveProjectData(data: ProjectData): void {
  if (data.project.id === DEFAULT_PROJECT_ID) return;

  data.project.updated_at = new Date().toISOString();
  try {
    localStorage.setItem(PROJECT_DATA_PREFIX + data.project.id, JSON.stringify(data));
  } catch {
    // localStorage might be full
  }
}

// ────────────────────────────────────────────
// Book Management
// ────────────────────────────────────────────

const BOOK_COLORS = [
  { color: '#8B2252', colorLight: '#F5E4EC' },   // Ruby
  { color: '#1B6B4A', colorLight: '#E4F0EA' },   // Emerald
  { color: '#4A3B8C', colorLight: '#ECEAF5' },   // Indigo
  { color: '#8C5E1A', colorLight: '#F5EFE4' },   // Amber
  { color: '#2B5F8C', colorLight: '#E4EDF5' },   // Steel Blue
  { color: '#6B3A5E', colorLight: '#F2E9F0' },   // Plum
];

/** Add a book/season to a project */
export function addBook(projectId: string, name: string, description?: string): Book | null {
  const project = getProject(projectId);
  if (!project || projectId === DEFAULT_PROJECT_ID) return null;

  const colorIdx = project.books.length % BOOK_COLORS.length;
  const maxOrder = project.books.reduce((max, b) => Math.max(max, b.order), 0);

  const book: Book = {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name,
    description,
    order: maxOrder + 1,
    color: BOOK_COLORS[colorIdx].color,
    colorLight: BOOK_COLORS[colorIdx].colorLight,
  };

  project.books.push(book);
  updateProject(project);
  return book;
}

/** Remove a book/season from a project */
export function removeBook(projectId: string, bookId: string): void {
  const project = getProject(projectId);
  if (!project || projectId === DEFAULT_PROJECT_ID) return;

  project.books = project.books.filter((b) => b.id !== bookId);
  updateProject(project);
}

// ────────────────────────────────────────────
// Import / Export
// ────────────────────────────────────────────

/** Export a project as a portable JSON object */
export function exportProject(id: string): ProjectData | null {
  if (id === DEFAULT_PROJECT_ID) return null; // Default project exports via ExportDialog
  return loadProjectData(id);
}

/**
 * Import a project from a JSON object.
 * Accepts either:
 * 1. A full ProjectData object (from a previous export)
 * 2. A raw research dataset (entries[], people[], places[], etc.) — converted to a project
 */
export function importProject(
  input: ProjectData | RawImportData,
  overrides?: { name?: string; setting?: string; genre?: string },
): Project {
  let data: ProjectData;

  if ('project' in input && input.project?.id) {
    // Full ProjectData — use as-is but generate a new ID to avoid collisions
    const now = new Date().toISOString();
    const name = overrides?.name ?? input.project.name;
    data = {
      ...input,
      project: {
        ...input.project,
        id: generateProjectId(name),
        name,
        setting: overrides?.setting ?? input.project.setting,
        genre: overrides?.genre ?? input.project.genre,
        created_at: now,
        updated_at: now,
      },
    };
  } else {
    // Raw research data — wrap in a project
    const raw = input as RawImportData;
    const name = overrides?.name ?? 'Imported Project';
    const now = new Date().toISOString();
    data = {
      project: {
        id: generateProjectId(name),
        name,
        description: overrides?.setting ? `Research data for ${overrides.setting}` : 'Imported research data',
        setting: overrides?.setting ?? 'Unknown',
        genre: overrides?.genre,
        books: [],
        created_at: now,
        updated_at: now,
      },
      entries: raw.entries ?? [],
      people: raw.people ?? [],
      places: raw.places ?? [],
      environment: raw.environment ?? raw.environment_features ?? [],
      universes: raw.universes ?? [],
      props: raw.props ?? [],
    };
  }

  // Save to localStorage
  const projects = listProjects().filter((p) => p.id !== DEFAULT_PROJECT_ID);
  projects.push(data.project);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  localStorage.setItem(PROJECT_DATA_PREFIX + data.project.id, JSON.stringify(data));

  return data.project;
}

/** Shape of raw research data that can be imported */
export interface RawImportData {
  entries?: TimelineEntry[];
  people?: Person[];
  places?: Place[];
  environment?: EnvironmentFeature[];
  environment_features?: EnvironmentFeature[];
  universes?: Universe[];
  props?: NarrativeProp[];
}
