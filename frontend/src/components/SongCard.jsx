// src/components/SongCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Clock, Music, Calendar, Film, User } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

export const SongCard = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(song.defaultLanguage);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setIsPlaying(false);
  };

  const getCurrentVersion = () => {
    return song.versions.find(v => v.language === currentLanguage) || song.versions[0];
  };

  const currentVersion = getCurrentVersion();

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Song Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
              {song.title}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{song.artist}</span>
              </div>
              <div className="flex items-center">
                <Film className="h-4 w-4 mr-1" />
                <span>{song.movie}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{song.releaseYear}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{song.duration}</span>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {song.genre}
            </span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <div className="flex flex-wrap gap-2">
            {song.versions.map((version) => (
              <button
                key={version.language}
                onClick={() => handleLanguageChange(version.language)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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

        {/* Current Version Details */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Singer:</strong> {currentVersion.singer}</div>
            {currentVersion.lyricist && (
              <div><strong>Lyricist:</strong> {currentVersion.lyricist}</div>
            )}
            {currentVersion.musicDirector && (
              <div><strong>Music Director:</strong> {currentVersion.musicDirector}</div>
            )}
            {currentVersion.lyrics && (
              <div><strong>Lyrics:</strong> {currentVersion.lyrics}</div>
            )}
          </div>
        </div>

        {/* Audio Player */}
        <AudioPlayer
          song={song}
          currentLanguage={currentLanguage}
          isPlaying={isPlaying}
          onPlayPause={setIsPlaying}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <Link
            to={`/songs/${song.id}`}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Music className="h-4 w-4 mr-2" />
            Details
          </Link>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {song.availableLanguages.length} languages
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
