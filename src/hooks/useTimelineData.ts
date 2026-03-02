import { useState, useEffect } from 'react';
import type { DataStore } from '../types';
import { loadData } from '../data/loader';

export function useTimelineData() {
  const [data, setData] = useState<DataStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData()
      .then((store) => {
        setData(store);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
