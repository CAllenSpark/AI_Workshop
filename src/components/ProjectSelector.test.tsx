/**
 * Unit tests for ProjectSelector component
 * Covers: trigger display, dropdown, project selection, create form, delete
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectSelector from './ProjectSelector';
import { DEFAULT_PROJECT } from '../data/project-manager';
import type { Project } from '../types';

beforeEach(() => {
  localStorage.clear();
});

function renderSelector(overrides: Partial<{ activeProject: Project; onProjectChange: (id: string) => void }> = {}) {
  const props = {
    activeProject: DEFAULT_PROJECT,
    onProjectChange: vi.fn(),
    ...overrides,
  };
  return { ...render(<ProjectSelector {...props} />), props };
}

describe('ProjectSelector', () => {
  it('renders the trigger button with project name and setting', () => {
    renderSelector();
    expect(screen.getByText('Vashon Island Research')).toBeInTheDocument();
    expect(screen.getByText('Vashon Island, WA')).toBeInTheDocument();
  });

  it('opens dropdown on trigger click', () => {
    renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('shows the default project in the list', () => {
    renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    // Project name appears in both trigger and list
    const names = screen.getAllByText('Vashon Island Research');
    expect(names.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onProjectChange when a project is selected', () => {
    const { props } = renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));

    // Click the default project in the list (it's the only project item)
    const listItems = screen.getAllByText('Vashon Island Research');
    // The second one is in the dropdown list
    const listItem = listItems[listItems.length - 1].closest('button.project-item');
    if (listItem) fireEvent.click(listItem);

    expect(props.onProjectChange).toHaveBeenCalledWith('default');
  });

  it('shows create form when + New is clicked', () => {
    renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    fireEvent.click(screen.getByText('+ New'));
    expect(screen.getByText('New Project')).toBeInTheDocument();
    expect(screen.getByText('Project Name *')).toBeInTheDocument();
  });

  it('shows import form when Import is clicked', () => {
    renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    fireEvent.click(screen.getByText('Import'));
    expect(screen.getByText('Import Project')).toBeInTheDocument();
    expect(screen.getByText('JSON File *')).toBeInTheDocument();
  });

  it('has back button on create form', () => {
    renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    fireEvent.click(screen.getByText('+ New'));
    fireEvent.click(screen.getByText('← Back'));
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('does not show delete button for default project', () => {
    const { container } = renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    const deleteButtons = container.querySelectorAll('.project-delete-btn');
    expect(deleteButtons.length).toBe(0);
  });

  it('create button is disabled when name is empty', () => {
    renderSelector();
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    fireEvent.click(screen.getByText('+ New'));
    const submitBtn = screen.getByText('Create Project');
    expect(submitBtn).toBeDisabled();
  });
});
