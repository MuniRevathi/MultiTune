// src/pages/Songs.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';
import { SongCard } from '../components/SongCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Filter, Grid, List, Music } from 'lucide-react';

export const Songs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [filters, setFilters] = useState({
    language: searchParams.get('language') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
  });
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await apiService.getLanguages();
        setLanguages(response.data.data);
      } catch (err) {
        console.error('Error fetching languages:', err);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllSongs(filters);
        setSongs(response.data.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ language: '', genre: '', year: '' });
    setSearchParams({});
  };

  const genres = [...new Set(songs.map(song => song.genre))];
  const years = [...new Set(songs.map(song => song.releaseYear))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" message="Loading songs..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Music className="h-8 w-8 mr-3 text-primary-500" />
            All Songs
          </h1>
          <p className="text-gray-600 mt-2">
            {songs.length} songs available
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Songs Grid/List */}
      {songs.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No songs found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};
