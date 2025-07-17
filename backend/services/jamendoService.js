// services/jamendoService.js
const config = require('../config/config');

class JamendoService {
  constructor() {
    this.baseUrl = 'https://api.jamendo.com/v3.0';
    this.clientId = config.jamendoClientId || 'your-client-id'; // You'll need to get this from Jamendo
    this.format = 'json';
  }

  // Search for tracks
  async searchTracks(query, options = {}) {
    const {
      limit = 10,
      offset = 0,
      lang = 'en',
      include = 'musicinfo+stats+lyrics'
    } = options;

    const params = new URLSearchParams({
      client_id: this.clientId,
      format: this.format,
      limit: limit.toString(),
      offset: offset.toString(),
      search: query,
      include,
      lang
    });

    try {
      const response = await fetch(`${this.baseUrl}/tracks?${params}`);
      const data = await response.json();
      
      if (data.headers.status === 'success') {
        return this.formatTracks(data.results);
      } else {
        throw new Error(data.headers.error_message || 'Failed to search tracks');
      }
    } catch (error) {
      console.error('Jamendo search error:', error);
      throw error;
    }
  }

  // Get track by ID
  async getTrack(trackId) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      format: this.format,
      id: trackId,
      include: 'musicinfo+stats+lyrics'
    });

    try {
      const response = await fetch(`${this.baseUrl}/tracks?${params}`);
      const data = await response.json();
      
      if (data.headers.status === 'success' && data.results.length > 0) {
        return this.formatTrack(data.results[0]);
      } else {
        throw new Error('Track not found');
      }
    } catch (error) {
      console.error('Jamendo track fetch error:', error);
      throw error;
    }
  }

  // Get popular tracks
  async getPopularTracks(options = {}) {
    const {
      limit = 20,
      offset = 0,
      lang = 'en'
    } = options;

    const params = new URLSearchParams({
      client_id: this.clientId,
      format: this.format,
      limit: limit.toString(),
      offset: offset.toString(),
      order: 'popularity_total',
      include: 'musicinfo+stats+lyrics',
      lang
    });

    try {
      const response = await fetch(`${this.baseUrl}/tracks?${params}`);
      const data = await response.json();
      
      if (data.headers.status === 'success') {
        return this.formatTracks(data.results);
      } else {
        throw new Error(data.headers.error_message || 'Failed to get popular tracks');
      }
    } catch (error) {
      console.error('Jamendo popular tracks error:', error);
      throw error;
    }
  }

  // Get tracks by genre
  async getTracksByGenre(genreId, options = {}) {
    const {
      limit = 20,
      offset = 0,
      lang = 'en'
    } = options;

    const params = new URLSearchParams({
      client_id: this.clientId,
      format: this.format,
      limit: limit.toString(),
      offset: offset.toString(),
      tags: genreId,
      include: 'musicinfo+stats+lyrics',
      lang
    });

    try {
      const response = await fetch(`${this.baseUrl}/tracks?${params}`);
      const data = await response.json();
      
      if (data.headers.status === 'success') {
        return this.formatTracks(data.results);
      } else {
        throw new Error(data.headers.error_message || 'Failed to get tracks by genre');
      }
    } catch (error) {
      console.error('Jamendo genre tracks error:', error);
      throw error;
    }
  }

  // Format track data to match your application's format
  formatTrack(track) {
    return {
      id: `jamendo_${track.id}`,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      genre: track.musicinfo?.tags?.genres?.[0] || 'Unknown',
      duration: this.formatDuration(track.duration),
      releaseYear: track.releasedate ? new Date(track.releasedate).getFullYear() : null,
      poster: track.album_image || track.image,
      audioUrl: track.audio, // Direct streaming URL
      audioDownloadUrl: track.audiodownload, // Download URL (if available)
      lyrics: track.lyrics || '',
      license: track.license_ccurl,
      jamendoId: track.id,
      playCount: track.stats?.rate_listened_total || 0,
      likeCount: track.stats?.rate_liked_total || 0,
      source: 'Jamendo'
    };
  }

  formatTracks(tracks) {
    return tracks.map(track => this.formatTrack(track));
  }

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Get genres
  async getGenres() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      format: this.format
    });

    try {
      const response = await fetch(`${this.baseUrl}/tracks/tags?${params}`);
      const data = await response.json();
      
      if (data.headers.status === 'success') {
        return data.results;
      } else {
        throw new Error(data.headers.error_message || 'Failed to get genres');
      }
    } catch (error) {
      console.error('Jamendo genres error:', error);
      throw error;
    }
  }
}

module.exports = new JamendoService();
