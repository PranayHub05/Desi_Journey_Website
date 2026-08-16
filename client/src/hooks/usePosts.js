import { useState, useEffect, useCallback } from 'react';
import { fetchPosts } from '../services/api';
import { INITIAL_POSTS } from '../data/seed';

export const usePosts = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchPosts();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(INITIAL_POSTS);
      }
      setError(null);
    } catch (err) {
      setError(err);
      setPosts(INITIAL_POSTS);
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { posts: Array.isArray(posts) ? posts : INITIAL_POSTS, loading, error, refetch };
};
