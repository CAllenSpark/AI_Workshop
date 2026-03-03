/**
 * Tests for narrator system prompt generation
 */
import { describe, it, expect } from 'vitest';
import { buildNarratorPrompt } from './narrator-prompt';
import { DEFAULT_PROJECT } from './project-manager';
import type { Project } from '../types';

describe('buildNarratorPrompt', () => {
  it('generates a prompt with default project context', () => {
    const prompt = buildNarratorPrompt();
    expect(prompt).toContain('Vashon Island, WA');
    expect(prompt).toContain('historical research');
    expect(prompt).toContain('NEVER CONTRADICT ESTABLISHED FACT');
  });

  it('uses custom project setting and genre', () => {
    const project: Project = {
      id: 'test',
      name: 'Room 33',
      description: 'A mystery',
      setting: 'Vashon Island Lodge',
      genre: 'supernatural mystery',
      books: [],
      created_at: '',
      updated_at: '',
    };
    const prompt = buildNarratorPrompt(project);
    expect(prompt).toContain('Vashon Island Lodge');
    expect(prompt).toContain('supernatural mystery');
  });

  it('includes book/season section when books exist', () => {
    const project: Project = {
      id: 'test',
      name: 'Twin Peaks',
      description: 'Mystery drama',
      setting: 'Twin Peaks, WA',
      genre: 'mystery',
      books: [
        { id: 's1', name: 'Season 1', description: 'The original mystery', order: 1, color: '#8B2252', colorLight: '#F5E4EC' },
        { id: 's2', name: 'Season 2', description: 'The investigation deepens', order: 2, color: '#1B6B4A', colorLight: '#E4F0EA' },
      ],
      created_at: '',
      updated_at: '',
    };
    const prompt = buildNarratorPrompt(project);
    expect(prompt).toContain('Books / Seasons');
    expect(prompt).toContain('Season 1');
    expect(prompt).toContain('Season 2');
    expect(prompt).toContain('The original mystery');
  });

  it('omits book section when no books exist', () => {
    const prompt = buildNarratorPrompt(DEFAULT_PROJECT);
    expect(prompt).not.toContain('Books / Seasons');
  });

  it('covers all key knowledge base sections', () => {
    const prompt = buildNarratorPrompt();
    expect(prompt).toContain('Entries');
    expect(prompt).toContain('People (NPCs)');
    expect(prompt).toContain('Places');
    expect(prompt).toContain('Props');
    expect(prompt).toContain('Content Classification');
    expect(prompt).toContain("When You Don't Know");
  });

  it('includes ethical guidelines', () => {
    const prompt = buildNarratorPrompt();
    expect(prompt).toContain('sensitive topics');
    expect(prompt).toContain('Never fabricate historical facts');
  });
});
