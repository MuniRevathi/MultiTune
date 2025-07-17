// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';
import { SongCard } from '../components/SongCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Play, TrendingUp, Shuffle, Music, Languages, Search } from 'lucide-react';

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [randomSongs, setRandomSongs] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trending songs, random songs, and languages
        const [trendingResponse, randomResponse, languagesResponse] = await Promise.all([
          apiService.getTrendingSongs(6),
          apiService.getRandomSongs(6),
          apiService.getLanguages()
        ]);

        setTrendingSongs(trendingResponse.data.data);
        setRandomSongs(randomResponse.data.data);
        setLanguages(languagesResponse.data.data);

        // Calculate stats
        setStats({
          totalSongs: trendingResponse.data.data.length,
          totalLanguages: languagesResponse.data.data.length,
          totalGenres: [...new Set(trendingResponse.data.data.map(song => song.genre))].length,
        });

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
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl shadow-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-poppins">
            Multi<span className="text-primary-200">Tune</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Discover songs in multiple languages, one tune at a time
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/songs"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" />
              Browse Songs
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <Music className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalSongs}</h3>
          <p className="text-gray-600">Songs Available</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <Languages className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalLanguages}</h3>
          <p className="text-gray-600">Languages</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalGenres}</h3>
          <p className="text-gray-600">Genres</p>
        </div>
      </section>

      {/* Languages Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Languages className="h-6 w-6 mr-2 text-primary-500" />
          Available Languages
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((language) => (
            <Link
              key={language}
              to={`/songs?language=${language}`}
              className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-primary-50"
            >
              <div className="text-2xl mb-2">🎵</div>
              <h3 className="font-medium text-gray-800">{language}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Songs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-primary-500" />
            Trending Songs
          </h2>
          <Link
            to="/songs"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Random Songs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Shuffle className="h-6 w-6 mr-2 text-primary-500" />
            Discover Something New
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
};
