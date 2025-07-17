// src/components/FreeMusicBrowser.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Play, Pause, Download, ExternalLink, Music, Star } from 'lucide-react';
import { apiService } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const FreeMusicBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('jamendo');
  const [searchResults, setSearchResults] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('search');

  // Load available music services
  const loadAvailableServices = useCallback(async () => {
    try {
      const response = await apiService.getAvailableServices();
      setAvailableServices(response.data.data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  }, []);

  // Load popular tracks
  const loadPopularTracks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getPopularTracks({ service: selectedService, limit: 10 });
      setPopularTracks(response.data.data);
    } catch (error) {
      console.error('Failed to load popular tracks:', error);
      setError('Failed to load popular tracks');
    } finally {
      setLoading(false);
    }
  }, [selectedService]);

  // Initialize
  useEffect(() => {
    loadAvailableServices();
    loadPopularTracks();
  }, [loadAvailableServices, loadPopularTracks]);

  // Search for music
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.freeMusicSearch(searchQuery, {
        service: selectedService,
        limit: 20
      });
      
      setSearchResults(response.data.data);
      setActiveTab('search');
    } catch (error) {
      console.error('Search failed:', error);
      setError(error.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Multi-service search
  const handleMultiSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.multiServiceSearch(searchQuery, { limit: 5 });
      setSearchResults(response.data.data);
      setActiveTab('multi-search');
    } catch (error) {
      console.error('Multi-search failed:', error);
      setError(error.response?.data?.error || 'Multi-search failed');
    } finally {
      setLoading(false);
    }
  };

  // Play/pause track
  const togglePlayPause = (track) => {
    if (currentlyPlaying === track.id) {
      // Pause current track
      if (audioPlayer) {
        audioPlayer.pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Play new track
      if (audioPlayer) {
        audioPlayer.pause();
      }
      
      const newPlayer = new Audio(track.audioUrl);
      newPlayer.play();
      newPlayer.onended = () => setCurrentlyPlaying(null);
      newPlayer.onerror = () => {
        setError('Failed to play audio');
        setCurrentlyPlaying(null);
      };
      
      setAudioPlayer(newPlayer);
      setCurrentlyPlaying(track.id);
    }
  };

  // Service change handler
  const handleServiceChange = (service) => {
    setSelectedService(service);
    setSearchResults([]);
    setActiveTab('search');
  };

  // Render track card
  const renderTrackCard = (track) => (
    <div key={track.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Album Art */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          {track.poster ? (
            <img 
              src={track.poster} 
              alt={track.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Music className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{track.title}</h3>
          <p className="text-sm text-gray-600 truncate">{track.artist}</p>
          {track.album && (
            <p className="text-xs text-gray-500 truncate">{track.album}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            {track.duration && (
              <span className="text-xs text-gray-500">{track.duration}</span>
            )}
            {track.genre && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {track.genre}
              </span>
            )}
            {track.source && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {track.source}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => togglePlayPause(track)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            disabled={!track.audioUrl}
          >
            {currentlyPlaying === track.id ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          
          {track.downloadUrl && (
            <a
              href={track.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          
          {track.spotifyUrl && (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  // Render multi-search results
  const renderMultiSearchResults = () => {
    if (!searchResults.results) return null;

    return (
      <div className="space-y-6">
        {searchResults.results.map((serviceResult) => (
          <div key={serviceResult.service} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {serviceResult.service} Results
            </h3>
            <div className="space-y-3">
              {serviceResult.tracks.map(renderTrackCard)}
            </div>
          </div>
        ))}
        
        {searchResults.errors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">Service Errors:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              {searchResults.errors.map((error, index) => (
                <li key={index}>
                  <strong>{error.service}:</strong> {error.error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Free Music Browser</h1>
        
        {/* Service Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Music Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceChange(service.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedService === service.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-gray-600">{service.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for songs, artists, or albums..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={handleMultiSearch}
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Multi-Search</span>
            </button>
          </div>
        </form>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Search Results
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'popular'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Popular Tracks
            </button>
          </nav>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {!loading && !error && (
          <div className="space-y-4">
            {activeTab === 'search' && (
              <>
                {activeTab === 'multi-search' ? (
                  renderMultiSearchResults()
                ) : (
                  searchResults.map(renderTrackCard)
                )}
                {searchResults.length === 0 && searchQuery && (
                  <p className="text-gray-500 text-center py-8">
                    No results found for "{searchQuery}"
                  </p>
                )}
              </>
            )}
            
            {activeTab === 'popular' && (
              <>
                {popularTracks.map(renderTrackCard)}
                {popularTracks.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No popular tracks available
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeMusicBrowser;
