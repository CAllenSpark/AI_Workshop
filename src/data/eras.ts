import type { Era, EraKey } from '../types';

/** Era definitions with display metadata and Design Bible colors */
export const ERAS: Era[] = [
  {
    key: 'prehistory',
    name: 'Prehistory',
    start: -15000,
    end: -1750,
    color: '#8C6B4A',
    colorLight: '#F0EBE4',
  },
  {
    key: 'indigenous',
    name: 'Indigenous Peoples',
    start: -10000,
    end: 1850,
    color: '#2B7A7A',
    colorLight: '#E4F3F3',
  },
  {
    key: 'exploration',
    name: 'Exploration',
    start: 1790,
    end: 1850,
    color: '#4A6D8C',
    colorLight: '#E4EDF3',
  },
  {
    key: 'logging-treaty',
    name: 'Logging & Treaty',
    start: 1850,
    end: 1870,
    color: '#2D5F3E',
    colorLight: '#E4F0E8',
  },
  {
    key: 'pioneer',
    name: 'Pioneer Settlement',
    start: 1865,
    end: 1900,
    color: '#9E7430',
    colorLight: '#FBF3E4',
  },
  {
    key: 'growth-industry',
    name: 'Growth & Industry',
    start: 1890,
    end: 1910,
    color: '#8C6B4A',
    colorLight: '#F0EBE4',
  },
  {
    key: 'early-20th-century',
    name: 'Early 20th Century',
    start: 1900,
    end: 1942,
    color: '#4A6D8C',
    colorLight: '#E4EDF3',
  },
  {
    key: 'wwii',
    name: 'World War II',
    start: 1941,
    end: 1946,
    color: '#B84233',
    colorLight: '#F5E4E2',
  },
  {
    key: 'state-ferry',
    name: 'State Ferry Era',
    start: 1951,
    end: 1970,
    color: '#2B7A7A',
    colorLight: '#E4F3F3',
  },
  {
    key: 'modern',
    name: 'Modern Era',
    start: 1970,
    end: 2026,
    color: '#2D5F3E',
    colorLight: '#E4F0E8',
  },
];

/** Lookup era by key */
export function getEra(key: EraKey): Era | undefined {
  return ERAS.find((e) => e.key === key);
}

/** Layer colors from Design Bible — historical entries */
export const LAYER_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  event: { color: '#9E7430', bg: '#FBF3E4', label: 'Event' },
  person: { color: '#2B7A7A', bg: '#E4F3F3', label: 'People' },
  place: { color: '#2D5F3E', bg: '#E4F0E8', label: 'Place' },
  environment: { color: '#8C6B4A', bg: '#F0EBE4', label: 'Environment' },
};

/** Fantasy layer colors from Design Bible v2 Section 9.2 */
export const FANTASY_LAYER_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  event: { color: '#7B4BAA', bg: '#F3EBF9', label: 'Fantasy Event' },
  person: { color: '#9E3A6E', bg: '#F9EBF2', label: 'Fantasy People' },
  place: { color: '#2A6B7C', bg: '#E4F0F4', label: 'Fantasy Place' },
  environment: { color: '#4A4E8C', bg: '#ECEDF5', label: 'Fantasy Environment' },
};

/** Fantasy core UI colors */
export const FANTASY_COLORS = {
  primary: '#7B4BAA',     // Amethyst
  accent: '#A67BC5',      // Soft Violet
  muted: '#8B7FA0',       // Dusty Lavender
  surface: '#F3EBF9',     // Pale Orchid
  panelHeader: '#2E2840', // Night Purple
} as const;

/** Regional scope colors from Design Bible v2 Section 10 */
export const SCOPE_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  vashon: { color: '#2D5F3E', bg: '#E4F0E8', label: 'Vashon Island' },
  seattle: { color: '#5C6B78', bg: '#EBF0F3', label: 'Seattle' },
  tacoma: { color: '#5E6B5C', bg: '#EDF1EC', label: 'Tacoma' },
  national: { color: '#4A5570', bg: '#ECEDF2', label: 'United States' },
};

/** Entry type display metadata */
export const ENTRY_TYPE_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  historical: { color: '#2D5F3E', bg: '#E4F0E8', label: 'Historical' },
  fantasy: { color: '#7B4BAA', bg: '#F3EBF9', label: 'Fantasy' },
  speculative: { color: '#9E7430', bg: '#FBF3E4', label: 'Speculative' },
};
