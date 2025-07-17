// src/components/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { apiService } from '../services/api';

export const AudioPlayer = ({ song, currentLanguage, isPlaying, onPlayPause }) => {
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentVersion = song.versions.find(v => v.language === currentLanguage);
  // Support both local files and external URLs
  const audioUrl = currentVersion ? 
    (currentVersion.url || currentVersion.audioUrl || apiService.getStreamUrl(song.id, currentLanguage)) : 
    null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
      onPlayPause(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleEnded = () => {
      onPlayPause(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlayPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((e) => {
        console.error('Error playing audio:', e);
        setError('Failed to play audio');
        onPlayPause(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPlayPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (error) {
      setError(null);
    }
    onPlayPause(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  if (!audioUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
        Audio not available for this language
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />

      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          <div className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : currentVersion.singer}
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};
