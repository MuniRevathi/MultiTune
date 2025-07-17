// src/pages/FreeMusicDemo.jsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Play, Pause, Music, Search, Star } from 'lucide-react';

export const FreeMusicDemo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [selectedService, setSelectedService] = useState('jamendo');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPopularTracks({ service: selectedService, limit: 20 });
        setPopularTracks(response.data.data);
      } catch (error) {
        setError('Failed to load popular tracks');
        console.error('Error loading popular tracks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedService]);

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
    } catch (error) {
      setError(error.response?.data?.error || 'Search failed');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {track.source}
            </span>
          </div>
        </div>

        {/* Play Button */}
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
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🎵 Free Music Player</h1>
        
        {/* Service Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Music Service</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedService('jamendo')}
              className={`px-4 py-2 rounded-lg ${
                selectedService === 'jamendo'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Jamendo (Free Music)
            </button>
            <button
              onClick={() => setSelectedService('internetarchive')}
              className={`px-4 py-2 rounded-lg ${
                selectedService === 'internetarchive'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Internet Archive
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Loading and Error States */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">🔍 Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map(renderTrackCard)}
            </div>
          </div>
        )}

        {/* Popular Tracks */}
        {popularTracks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Popular Tracks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularTracks.map(renderTrackCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeMusicDemo;
