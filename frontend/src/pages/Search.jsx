// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';
import { SongCard } from '../components/SongCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Search as SearchIcon, Filter, X } from 'lucide-react';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [filters, setFilters] = useState({
    language: searchParams.get('language') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
  });

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
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.searchSongs(searchQuery, filters);
      setResults(response.data.data);
      setHasSearched(true);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Update URL params
      const params = new URLSearchParams();
      params.set('q', query);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      setSearchParams(params);
      
      performSearch();
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (hasSearched) {
      performSearch();
    }
  };

  const clearFilters = () => {
    setFilters({ language: '', genre: '', year: '' });
    if (hasSearched) {
      performSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const genres = ['Folk/Dance', 'Romance', 'Action', 'Drama', 'Comedy'];
  const years = [2023, 2022, 2021, 2020, 2019, 2018];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          <SearchIcon className="h-8 w-8 mr-3 text-primary-500" />
          Search Songs
        </h1>
        <p className="text-gray-600">
          Find your favorite songs across multiple languages
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for songs, artists, movies..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="lg" message="Searching..." />
        </div>
      )}

      {/* Error State */}
      {error && <ErrorMessage error={error} onRetry={() => performSearch()} />}

      {/* Results */}
      {hasSearched && !loading && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Search Results
            </h2>
            <span className="text-sm text-gray-600">
              {results.length} results found
            </span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {!hasSearched && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Naatu Naatu', 'Kesariya', 'RRR', 'Telugu', 'Hindi', 'Romance'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  performSearch(suggestion);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
