// src/pages/SongDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';
import { AudioPlayer } from '../components/AudioPlayer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, Calendar, Clock, Film, Music, User, Globe, Mic } from 'lucide-react';

export const SongDetails = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const response = await apiService.getSongById(id);
        setSong(response.data.data);
        setCurrentLanguage(response.data.data.defaultLanguage);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setIsPlaying(false);
  };

  const getCurrentVersion = () => {
    if (!song) return null;
    return song.versions.find(v => v.language === currentLanguage) || song.versions[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" message="Loading song details..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }

  if (!song) {
    return (
      <div className="text-center py-12">
        <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Song not found
        </h3>
        <Link
          to="/songs"
          className="text-primary-600 hover:text-primary-700"
        >
          Back to songs
        </Link>
      </div>
    );
  }

  const currentVersion = getCurrentVersion();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/songs"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Songs
      </Link>

      {/* Song Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {song.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">Artist:</span>
                  <span className="ml-2">{song.artist}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Film className="h-5 w-5 mr-2" />
                  <span className="font-medium">Movie:</span>
                  <span className="ml-2">{song.movie}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-medium">Year:</span>
                  <span className="ml-2">{song.releaseYear}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">{song.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Music className="h-5 w-5 mr-2" />
                  <span className="font-medium">Genre:</span>
                  <span className="ml-2">{song.genre}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-2" />
                  <span className="font-medium">Default Language:</span>
                  <span className="ml-2">{song.defaultLanguage}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {song.genre}
            </span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Available Languages
          </h3>
          <div className="flex flex-wrap gap-3">
            {song.versions.map((version) => (
              <button
                key={version.language}
                onClick={() => handleLanguageChange(version.language)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentLanguage === version.language
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {version.language}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Player */}
        <AudioPlayer
          song={song}
          currentLanguage={currentLanguage}
          isPlaying={isPlaying}
          onPlayPause={setIsPlaying}
        />
      </div>

      {/* Current Version Details */}
      {currentVersion && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mic className="h-5 w-5 mr-2" />
            {currentLanguage} Version Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Singer</h4>
                <p className="text-gray-600">{currentVersion.singer}</p>
              </div>
              
              {currentVersion.lyricist && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Lyricist</h4>
                  <p className="text-gray-600">{currentVersion.lyricist}</p>
                </div>
              )}
              
              {currentVersion.musicDirector && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Music Director</h4>
                  <p className="text-gray-600">{currentVersion.musicDirector}</p>
                </div>
              )}
            </div>
            
            <div>
              {currentVersion.lyrics && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Lyrics Preview</h4>
                  <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                    "{currentVersion.lyrics}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Versions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          All Language Versions
        </h3>
        
        <div className="space-y-4">
          {song.versions.map((version) => (
            <div
              key={version.language}
              className={`p-4 rounded-lg border-2 transition-colors ${
                currentLanguage === version.language
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">
                    {version.language}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Singer: {version.singer}
                  </p>
                  {version.lyrics && (
                    <p className="text-sm text-gray-500 italic mt-1">
                      "{version.lyrics}"
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleLanguageChange(version.language)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentLanguage === version.language
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {currentLanguage === version.language ? 'Current' : 'Select'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
