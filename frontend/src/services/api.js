// src/services/api.js
import axios from 'axios';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Production environment - use your Render backend URL
    return import.meta.env.VITE_API_BASE_URL || 'https://multitune.onrender.com/api';
  } else {
    // Development environment
    return 'http://localhost:3000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Songs (Local/Original)
  getAllSongs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.language) params.append('language', filters.language);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    
    return api.get(`/songs?${params.toString()}`);
  },

  // Free Music APIs
  freeMusicSearch: (query, options = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (options.service) params.append('service', options.service);
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    
    return api.get(`/free-music/search?${params.toString()}`);
  },

  getPopularTracks: (options = {}) => {
    const params = new URLSearchParams();
    if (options.service) params.append('service', options.service);
    if (options.limit) params.append('limit', options.limit);
    
    return api.get(`/free-music/popular?${params.toString()}`);
  },

  getTracksByGenre: (genreId, options = {}) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    
    return api.get(`/free-music/genre/${genreId}?${params.toString()}`);
  },

  getAvailableServices: () => {
    return api.get('/free-music/services');
  },

  getTrackDetails: (service, id) => {
    return api.get(`/free-music/track/${service}/${id}`);
  },

  getGenres: () => {
    return api.get('/free-music/genres');
  },

  multiServiceSearch: (query, options = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (options.limit) params.append('limit', options.limit);
    
    return api.get(`/free-music/multi-search?${params.toString()}`);
  },

  getSongById: (id) => api.get(`/songs/${id}`),

  getSongByLanguage: (id, language) => api.get(`/songs/${id}/language/${language}`),

  getSongsByGenre: (genre) => api.get(`/songs/genre/${genre}`),

  getSongsByYear: (year) => api.get(`/songs/year/${year}`),

  getRandomSongs: (count = 5) => api.get(`/songs/random${count ? `/${count}` : ''}`),

  getTrendingSongs: (limit = 10) => api.get(`/songs/trending${limit ? `/${limit}` : ''}`),

  // Languages
  getLanguages: () => api.get('/languages'),

  // Search
  searchSongs: (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters.language) params.append('language', filters.language);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    
    return api.get(`/search?${params.toString()}`);
  },

  // Audio streaming
  getStreamUrl: (songId, language) => `${API_BASE_URL}/stream/${songId}/${language}`,

  getAudioUrl: (filename) => `http://localhost:3000/audio/${filename}`,

  // For external URLs, return the URL directly
  getExternalAudioUrl: (url) => url,
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with an error status
    return {
      success: false,
      error: error.response.data.error || 'An error occurred',
      message: error.response.data.message || 'Please try again later',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      error: 'Network Error',
      message: 'Please check your internet connection and try again',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      success: false,
      error: 'Unexpected Error',
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

export default api;
