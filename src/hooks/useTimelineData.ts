import { useState, useEffect, useCallback, useRef } from 'react';
import type { DataStore } from '../types';
import { loadData } from '../data/loader';

export function useTimelineData() {
  const [data, setDataState] = useState<DataStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref so the onRefresh callback always sees the latest setter
  // without causing the useEffect to re-run.
  const setDataRef = useRef(setDataState);
  setDataRef.current = setDataState;

  useEffect(() => {
    loadData((freshStore) => {
      // Background refresh detected new data — update the UI
      console.info('[DataStore] Background refresh detected new data, updating UI');
      setDataRef.current(freshStore);
    })
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
