/**
 * Unit tests for EntryCard component
 * Covers: UT-C001, UT-C004
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EntryCard from './EntryCard';
import { TEST_ENTRIES } from '../__fixtures__/test-data';

describe('EntryCard', () => {
  const fullEntry = TEST_ENTRIES[0]; // Pioneer Settlement Founded — has all fields
  const minimalEntry = TEST_ENTRIES[6]; // Minimal Entry — only required fields

  it('UT-C001: renders title, date, description', () => {
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('Pioneer Settlement Founded')).toBeInTheDocument();
    expect(screen.getByText('The first pioneer settlement was founded.')).toBeInTheDocument();
    expect(screen.getByText(/1870/)).toBeInTheDocument();
  });

  it('UT-C001: renders date range when date_end is present', () => {
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText(/1870/)).toBeInTheDocument();
    expect(screen.getByText(/1875/)).toBeInTheDocument();
  });

  it('UT-C001: renders layer dots', () => {
    const { container } = render(<EntryCard entry={fullEntry} isSelected={false} onClick={() => {}} />);

    const dots = container.querySelectorAll('.layer-dot');
    expect(dots.length).toBe(fullEntry.layers.length);
  });

  it('UT-C001: renders people count badge', () => {
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={() => {}} />);
    expect(screen.getByText('1 person')).toBeInTheDocument();
  });

  it('UT-C001: renders places count badge', () => {
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={() => {}} />);
    expect(screen.getByText('1 place')).toBeInTheDocument();
  });

  it('UT-C001: renders sources count badge', () => {
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={() => {}} />);
    expect(screen.getByText('1 source')).toBeInTheDocument();
  });

  it('UT-C004: renders without errors when optional fields are absent', () => {
    render(<EntryCard entry={minimalEntry} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('Minimal Entry')).toBeInTheDocument();
    expect(screen.getByText('Minimal entry with only required fields.')).toBeInTheDocument();
    // No people/places/sources badges
    expect(screen.queryByText(/person/)).not.toBeInTheDocument();
    expect(screen.queryByText(/place/)).not.toBeInTheDocument();
    expect(screen.queryByText(/source/)).not.toBeInTheDocument();
  });

  it('applies selected class when isSelected is true', () => {
    const { container } = render(<EntryCard entry={fullEntry} isSelected={true} onClick={() => {}} />);

    const card = container.querySelector('.entry-card');
    expect(card?.classList.contains('selected')).toBe(true);
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={onClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('calls onClick when Enter key is pressed', () => {
    const onClick = vi.fn();
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={onClick} />);

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has proper aria-label for accessibility', () => {
    render(<EntryCard entry={fullEntry} isSelected={false} onClick={() => {}} />);

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'Pioneer Settlement Founded, 1870');
  });

  it('renders multiple people as plural', () => {
    const multiPeopleEntry = {
      ...fullEntry,
      people: ['Person A', 'Person B'],
    };
    render(<EntryCard entry={multiPeopleEntry} isSelected={false} onClick={() => {}} />);
    expect(screen.getByText('2 people')).toBeInTheDocument();
  });
});
