/**
 * Unit tests for TabNav component
 * Covers: M8 tab navigation, active state, accessibility
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabNav from './TabNav';

describe('TabNav', () => {
  it('renders Timeline and People tabs', () => {
    render(<TabNav activeTab="timeline" onChange={() => {}} />);

    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
  });

  it('marks active tab with aria-selected', () => {
    render(<TabNav activeTab="timeline" onChange={() => {}} />);

    const timelineTab = screen.getByRole('tab', { name: /timeline/i });
    expect(timelineTab).toHaveAttribute('aria-selected', 'true');

    const peopleTab = screen.getByRole('tab', { name: /people/i });
    expect(peopleTab).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange when People tab is clicked', () => {
    const onChange = vi.fn();
    render(<TabNav activeTab="timeline" onChange={onChange} />);

    fireEvent.click(screen.getByText('People'));
    expect(onChange).toHaveBeenCalledWith('people');
  });

  it('calls onChange when Timeline tab is clicked', () => {
    const onChange = vi.fn();
    render(<TabNav activeTab="people" onChange={onChange} />);

    fireEvent.click(screen.getByText('Timeline'));
    expect(onChange).toHaveBeenCalledWith('timeline');
  });

  it('has proper tablist role', () => {
    render(<TabNav activeTab="timeline" onChange={() => {}} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});
