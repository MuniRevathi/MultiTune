// src/pages/Languages.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Globe, Music, ArrowRight } from 'lucide-react';

export const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languageStats, setLanguageStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [languagesResponse, songsResponse] = await Promise.all([
          apiService.getLanguages(),
          apiService.getAllSongs()
        ]);

        setLanguages(languagesResponse.data.data);
        
        // Calculate stats for each language
        const stats = {};
        const allSongs = songsResponse.data.data;
        
        languagesResponse.data.data.forEach(language => {
          const songsInLanguage = allSongs.filter(song => 
            song.versions.some(version => version.language === language)
          );
          
          stats[language] = {
            songCount: songsInLanguage.length,
            genres: [...new Set(songsInLanguage.map(song => song.genre))],
            years: [...new Set(songsInLanguage.map(song => song.releaseYear))].sort((a, b) => b - a),
            artists: [...new Set(songsInLanguage.map(song => song.artist))],
          };
        });
        
        setLanguageStats(stats);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" message="Loading languages..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }

  const getLanguageFlag = (language) => {
    const flags = {
      'Telugu': '🇮🇳',
      'Hindi': '🇮🇳',
      'Tamil': '🇮🇳',
      'English': '🇺🇸',
      'Kannada': '🇮🇳',
      'Malayalam': '🇮🇳',
      'Bengali': '🇮🇳',
      'Gujarati': '🇮🇳',
      'Marathi': '🇮🇳',
      'Punjabi': '🇮🇳',
    };
    return flags[language] || '🎵';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          <Globe className="h-8 w-8 mr-3 text-primary-500" />
          Languages
        </h1>
        <p className="text-gray-600">
          Explore songs in different languages and discover new music
        </p>
      </div>

      {/* Language Stats Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Language Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <Globe className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary-600">
              {languages.length}
            </div>
            <div className="text-sm text-primary-700">
              Languages Available
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Music className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {Object.values(languageStats).reduce((sum, stats) => sum + stats.songCount, 0)}
            </div>
            <div className="text-sm text-green-700">
              Total Songs
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <ArrowRight className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(languageStats).reduce((sum, stats) => sum + stats.artists.length, 0)}
            </div>
            <div className="text-sm text-purple-700">
              Total Artists
            </div>
          </div>
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {languages.map((language) => {
          const stats = languageStats[language] || {};
          
          return (
            <div
              key={language}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Language Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">
                      {getLanguageFlag(language)}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800">
                      {language}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {stats.songCount || 0} songs
                  </span>
                </div>

                {/* Language Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Genres:</span>
                    <span className="font-medium text-gray-800">
                      {stats.genres?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Artists:</span>
                    <span className="font-medium text-gray-800">
                      {stats.artists?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Years:</span>
                    <span className="font-medium text-gray-800">
                      {stats.years?.length > 0 
                        ? `${stats.years[stats.years.length - 1]} - ${stats.years[0]}`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>

                {/* Popular Genres */}
                {stats.genres && stats.genres.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Popular Genres
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {stats.genres.slice(0, 3).map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/songs?language=${language}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Music className="h-4 w-4 mr-2" />
                  View Songs
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Language Features */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Multi-Language Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Switch Languages
            </h3>
            <p className="text-gray-600 text-sm">
              Listen to the same song in different languages with one click
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Music className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Original Artists
            </h3>
            <p className="text-gray-600 text-sm">
              Each language version features original artists and singers
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Seamless Experience
            </h3>
            <p className="text-gray-600 text-sm">
              Smooth transitions between languages without interruption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
