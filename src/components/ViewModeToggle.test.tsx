/**
 * Unit tests for ViewModeToggle component
 * Covers: M8 view mode switching, counts display, active state
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewModeToggle from './ViewModeToggle';

describe('ViewModeToggle', () => {
  const counts = { historical: 100, fantasy: 5, speculative: 3, all: 108 };

  it('renders all three mode buttons', () => {
    render(<ViewModeToggle viewMode="all" onChange={() => {}} counts={counts} />);

    expect(screen.getByText('Historical')).toBeInTheDocument();
    expect(screen.getByText('Creative')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('marks the active mode as selected', () => {
    render(<ViewModeToggle viewMode="historical" onChange={() => {}} counts={counts} />);

    const historicalBtn = screen.getByRole('radio', { name: /historical/i });
    expect(historicalBtn).toHaveAttribute('aria-checked', 'true');

    const creativeBtn = screen.getByRole('radio', { name: /fantasy/i });
    expect(creativeBtn).toHaveAttribute('aria-checked', 'false');
  });

  it('displays entry counts', () => {
    render(<ViewModeToggle viewMode="all" onChange={() => {}} counts={counts} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('108')).toBeInTheDocument();
  });

  it('calls onChange when a mode button is clicked', () => {
    const onChange = vi.fn();
    render(<ViewModeToggle viewMode="all" onChange={onChange} counts={counts} />);

    fireEvent.click(screen.getByText('Historical'));
    expect(onChange).toHaveBeenCalledWith('historical');
  });

  it('calls onChange with creative when Creative button clicked', () => {
    const onChange = vi.fn();
    render(<ViewModeToggle viewMode="all" onChange={onChange} counts={counts} />);

    fireEvent.click(screen.getByText('Creative'));
    expect(onChange).toHaveBeenCalledWith('creative');
  });

  it('has proper radiogroup role', () => {
    render(<ViewModeToggle viewMode="all" onChange={() => {}} counts={counts} />);

    expect(screen.getByRole('radiogroup', { name: /view mode/i })).toBeInTheDocument();
  });
});
