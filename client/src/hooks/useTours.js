import { useState, useEffect, useCallback } from 'react';
import { fetchTours } from '../services/api';
import { INITIAL_TOURS } from '../data/seed';

export const useTours = () => {
  const [tours, setTours] = useState(INITIAL_TOURS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchTours();
      if (Array.isArray(data) && data.length > 0) {
        setTours(data);
      } else {
        setTours(INITIAL_TOURS);
      }
      setError(null);
    } catch (err) {
      setError(err);
      setTours(INITIAL_TOURS);
      console.error('Failed to fetch tours:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { tours: Array.isArray(tours) ? tours : INITIAL_TOURS, loading, error, refetch };
};
