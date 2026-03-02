import { useState, useEffect, useCallback } from 'react';
import type { DataStore } from '../types';
import { loadData } from '../data/loader';

export function useTimelineData() {
  const [data, setDataState] = useState<DataStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData()
      .then((store) => {
        setDataState(store);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const setData = useCallback((store: DataStore) => {
    setDataState(store);
  }, []);

  return { data, loading, error, setData };
}
