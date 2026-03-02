import { useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import type { TimelineEntry } from '../types';

const FUSE_OPTIONS: Fuse.IFuseOptions<TimelineEntry> = {
  keys: [
    { name: 'title', weight: 2.0 },
    { name: 'description', weight: 1.0 },
    { name: 'details', weight: 0.5 },
    { name: 'tags', weight: 1.0 },
    { name: 'people', weight: 0.8 },
    { name: 'places', weight: 0.8 },
  ],
  threshold: 0.35,
  distance: 200,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
};

export interface SearchResult {
  entry: TimelineEntry;
  score: number;
  matches: Fuse.FuseResultMatch[];
}

export function useSearch(entries: TimelineEntry[]) {
  const fuseRef = useRef<Fuse<TimelineEntry> | null>(null);

  // Build/rebuild the index when entries change
  const fuse = useMemo(() => {
    const f = new Fuse(entries, FUSE_OPTIONS);
    fuseRef.current = f;
    return f;
  }, [entries]);

  return {
    search(query: string): SearchResult[] {
      if (!query || query.length < 2) return [];
      const results = fuse.search(query);
      return results.map((r) => ({
        entry: r.item,
        score: r.score ?? 1,
        matches: r.matches ?? [],
      }));
    },
  };
}
