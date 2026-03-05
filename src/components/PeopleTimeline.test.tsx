/**
 * Unit tests for PeopleTimeline component
 * Covers: M8 people timeline, lifespan bars, view mode filtering, sorting
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PeopleTimeline from './PeopleTimeline';
import type { DataStore, Person } from '../types';
import { buildTestStore, TEST_PEOPLE } from '../__fixtures__/test-data';

describe('PeopleTimeline', () => {
  // Extend test people with period data for rendering
  function buildStoreWithPeriods(): DataStore {
    const store = buildTestStore();
    const peopleWithPeriods: Person[] = [
      { ...TEST_PEOPLE[0], period: '1850–1920' },      // Alice Pioneer
      { ...TEST_PEOPLE[1], period: 'Active 1792' },     // Bob Explorer
      { ...TEST_PEOPLE[2], period: '~1500–1856' },      // K'Pah Chief
      { ...TEST_PEOPLE[3] },                             // Orphan Person (no period)
      { ...TEST_PEOPLE[4], period: '1940–1945' },        // The Tidewalker (fantasy)
    ];
    return {
      ...store,
      people: peopleWithPeriods,
      peopleById: new Map(peopleWithPeriods.map((p) => [p.id, p])),
      peopleByName: new Map(peopleWithPeriods.map((p) => [p.name, p])),
    };
  }

  it('renders people with valid period data', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="all" onEntrySelect={() => {}} />);

    // People with periods should render
    expect(screen.getByText('Alice Pioneer')).toBeInTheDocument();
    expect(screen.getByText('Bob Explorer')).toBeInTheDocument();
  });

  it('skips people without period data', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="all" onEntrySelect={() => {}} />);

    // Orphan Person has no period, should not render
    expect(screen.queryByText('Orphan Person')).not.toBeInTheDocument();
  });

  it('displays correct count of people', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="all" onEntrySelect={() => {}} />);

    expect(screen.getByText('4 people')).toBeInTheDocument();
  });

  it('filters to historical only in historical view mode', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="historical" onEntrySelect={() => {}} />);

    // Historical people should show
    expect(screen.getByText('Alice Pioneer')).toBeInTheDocument();
    // Fantasy person should be hidden
    expect(screen.queryByText('The Tidewalker')).not.toBeInTheDocument();
    expect(screen.getByText('3 people')).toBeInTheDocument();
  });

  it('filters to creative only in creative view mode', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="creative" onEntrySelect={() => {}} />);

    // Fantasy person should show
    expect(screen.getByText('The Tidewalker')).toBeInTheDocument();
    // Historical people should be hidden
    expect(screen.queryByText('Alice Pioneer')).not.toBeInTheDocument();
    expect(screen.getByText('1 people')).toBeInTheDocument();
  });

  it('shows empty state when no people match view mode', () => {
    const store = buildTestStore();
    // Default store has no periods on people, so should show empty
    render(<PeopleTimeline data={store} viewMode="creative" onEntrySelect={() => {}} />);

    expect(screen.getByText(/no people to display/i)).toBeInTheDocument();
  });

  it('renders sort toggle with By Date and By Name buttons', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="all" onEntrySelect={() => {}} />);

    expect(screen.getByText('By Date')).toBeInTheDocument();
    expect(screen.getByText('By Name')).toBeInTheDocument();
  });

  it('toggles sort mode when clicking By Name', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="all" onEntrySelect={() => {}} />);

    const nameBtn = screen.getByText('By Name');
    fireEvent.click(nameBtn);

    // Should still render the same people
    expect(screen.getByText('Alice Pioneer')).toBeInTheDocument();
    expect(screen.getByText('Bob Explorer')).toBeInTheDocument();
  });

  it('displays header title', () => {
    const store = buildStoreWithPeriods();
    render(<PeopleTimeline data={store} viewMode="all" onEntrySelect={() => {}} />);

    expect(screen.getByText('People Timeline')).toBeInTheDocument();
  });
});
