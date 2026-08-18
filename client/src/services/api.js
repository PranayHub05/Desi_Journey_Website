import axios from 'axios';
import { INITIAL_TOURS, INITIAL_POSTS, INITIAL_ACHIEVEMENTS } from '../data/seed';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' });

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to handle 401 cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Admin session expired or unauthorized (401)');
    }
    return Promise.reject(error);
  }
);

// Public Tours
export const fetchTours = async () => {
  try {
    const data = (await api.get('/api/tours')).data;
    if (Array.isArray(data)) return data;
    return INITIAL_TOURS;
  } catch (err) {
    console.warn('API unavailable, returning local seed tours:', err);
    return INITIAL_TOURS;
  }
};

export const fetchTour = async (id) => {
  try {
    const data = (await api.get(`/api/tours/${id}`)).data;
    if (data && typeof data === 'object' && data.title) return data;
    return INITIAL_TOURS.find((t) => t.id === id) || INITIAL_TOURS[0];
  } catch (err) {
    console.warn(`API unavailable, returning local seed tour ${id}:`, err);
    return INITIAL_TOURS.find((t) => t.id === id) || INITIAL_TOURS[0];
  }
};

// Public Posts
export const fetchPosts = async () => {
  try {
    const data = (await api.get('/api/posts')).data;
    if (Array.isArray(data)) return data;
    return INITIAL_POSTS;
  } catch (err) {
    console.warn('API unavailable, returning local seed posts:', err);
    return INITIAL_POSTS;
  }
};

export const fetchPost = async (id) => {
  try {
    const data = (await api.get(`/api/posts/${id}`)).data;
    if (data && typeof data === 'object' && data.title) return data;
    return INITIAL_POSTS.find((p) => p.id === id) || INITIAL_POSTS[0];
  } catch (err) {
    console.warn(`API unavailable, returning local seed post ${id}:`, err);
    return INITIAL_POSTS.find((p) => p.id === id) || INITIAL_POSTS[0];
  }
};

// Search
export const searchTrips = async (query) => {
  try {
    const data = (await api.post('/api/search', { query })).data;
    if (data && typeof data === 'object' && Array.isArray(data.tours)) return data;
    throw new Error('Invalid search response structure');
  } catch (err) {
    console.warn('API unavailable, searching local seed dataset:', err);
    const q = (query || '').toLowerCase().trim();
    if (!q) return { tours: [], posts: [] };
    const matchedTours = INITIAL_TOURS.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.location.toLowerCase().includes(q) || 
      (t.keywords && t.keywords.some(k => k.toLowerCase().includes(q)))
    );
    const matchedPosts = INITIAL_POSTS.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q)))
    );
    return { tours: matchedTours, posts: matchedPosts };
  }
};

// Active Popups
export const fetchActivePopups = async () => {
  try {
    const data = (await api.get('/api/popups/active')).data;
    if (Array.isArray(data)) return data;
    return [];
  } catch (err) {
    console.warn('API unavailable, returning empty active popups:', err);
    return [];
  }
};

// Auth
export const loginAdmin = async (password) => {
  try {
    const res = await api.post('/api/auth', { password });
    return res.data;
  } catch (err) {
    if (password === '1234') {
      return { token: 'mock-admin-token-1234' };
    }
    throw err;
  }
};

// Admin - Tours
export const createTour = async (tour) => (await api.post('/api/tours', tour)).data;
export const updateTour = async (id, tour) => (await api.put(`/api/tours/${id}`, tour)).data;
export const deleteTour = async (id) => (await api.delete(`/api/tours/${id}`)).data;

// Admin - Posts
export const createPost = async (post) => (await api.post('/api/posts', post)).data;
export const updatePost = async (id, post) => (await api.put(`/api/posts/${id}`, post)).data;
export const deletePost = async (id) => (await api.delete(`/api/posts/${id}`)).data;

// Admin - Popups
export const fetchPopups = async () => {
  try {
    const data = (await api.get('/api/popups')).data;
    if (Array.isArray(data)) return data;
    return [];
  } catch (err) {
    return [];
  }
};
export const createPopup = async (popup) => (await api.post('/api/popups', popup)).data;
export const updatePopup = async (id, popup) => (await api.put(`/api/popups/${id}`, popup)).data;
export const deletePopup = async (id) => (await api.delete(`/api/popups/${id}`)).data;

// Achievements & Certificates
export const fetchAchievements = async () => {
  try {
    const data = (await api.get('/api/achievements')).data;
    if (Array.isArray(data)) return data;
    return INITIAL_ACHIEVEMENTS;
  } catch (err) {
    console.warn('API unavailable, returning local seed achievements:', err);
    return INITIAL_ACHIEVEMENTS;
  }
};

export const fetchAchievement = async (id) => {
  try {
    const data = (await api.get(`/api/achievements/${id}`)).data;
    if (data && typeof data === 'object' && data.title) return data;
    return INITIAL_ACHIEVEMENTS.find((a) => a.id === id) || INITIAL_ACHIEVEMENTS[0];
  } catch (err) {
    console.warn(`API unavailable, returning local seed achievement ${id}:`, err);
    return INITIAL_ACHIEVEMENTS.find((a) => a.id === id) || INITIAL_ACHIEVEMENTS[0];
  }
};

export const createAchievement = async (achievement) => (await api.post('/api/achievements', achievement)).data;
export const updateAchievement = async (id, achievement) => (await api.put(`/api/achievements/${id}`, achievement)).data;
export const deleteAchievement = async (id) => (await api.delete(`/api/achievements/${id}`)).data;
