import { useState, useEffect, useCallback } from 'react';
import { fetchAchievements } from '../services/api';
import { INITIAL_ACHIEVEMENTS } from '../data/seed';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchAchievements();
      if (Array.isArray(data) && data.length > 0) {
        setAchievements(data);
      } else {
        setAchievements(INITIAL_ACHIEVEMENTS);
      }
      setError(null);
    } catch (err) {
      setError(err);
      setAchievements(INITIAL_ACHIEVEMENTS);
      console.error('Failed to fetch achievements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { achievements: Array.isArray(achievements) ? achievements : INITIAL_ACHIEVEMENTS, loading, error, refetch };
};
