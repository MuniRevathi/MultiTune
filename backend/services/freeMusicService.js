// services/freeMusicService.js
const jamendoService = require('./jamendoService');
const config = require('../config/config');

class FreeMusicService {
  constructor() {
    this.services = {
      jamendo: jamendoService,
      // Add other services here as needed
    };
  }

  // Search across multiple APIs
  async searchTracks(query, options = {}) {
    const { 
      service = 'jamendo', 
      limit = 10, 
      offset = 0 
    } = options;

    try {
      switch (service) {
        case 'jamendo':
          return await this.services.jamendo.searchTracks(query, { limit, offset });
        
        case 'internetarchive':
          return await this.searchInternetArchive(query, { limit, offset });
        
        case 'freesound':
          return await this.searchFreesound(query, { limit, offset });
        
        default:
          throw new Error(`Unknown service: ${service}`);
      }
    } catch (error) {
      console.error(`Error searching ${service}:`, error);
      throw error;
    }
  }

  // Get popular tracks from different services
  async getPopularTracks(options = {}) {
    const { service = 'jamendo', limit = 20 } = options;

    try {
      switch (service) {
        case 'jamendo':
          return await this.services.jamendo.getPopularTracks({ limit });
        
        default:
          throw new Error(`Popular tracks not supported for: ${service}`);
      }
    } catch (error) {
      console.error(`Error getting popular tracks from ${service}:`, error);
      throw error;
    }
  }

  // Internet Archive search implementation
  async searchInternetArchive(query, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const params = new URLSearchParams({
      q: `${query} AND collection:opensource_audio`,
      fl: 'identifier,title,creator,date,description,downloads,format',
      rows: limit.toString(),
      start: offset.toString(),
      sort: 'downloads desc'
    });

    try {
      const response = await fetch(`https://archive.org/advancedsearch.php?${params}&output=json`);
      const data = await response.json();
      
      if (data.response && data.response.docs) {
        return this.formatInternetArchiveResults(data.response.docs);
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Internet Archive search error:', error);
      throw error;
    }
  }

  // Format Internet Archive results
  formatInternetArchiveResults(docs) {
    return docs.map(doc => ({
      id: `ia_${doc.identifier}`,
      title: doc.title || 'Unknown Title',
      artist: doc.creator || 'Unknown Artist',
      description: doc.description || '',
      releaseYear: doc.date ? new Date(doc.date).getFullYear() : null,
      audioUrl: `https://archive.org/download/${doc.identifier}/${doc.identifier}.mp3`,
      poster: `https://archive.org/services/img/${doc.identifier}`,
      downloads: doc.downloads || 0,
      source: 'Internet Archive',
      license: 'Public Domain',
      formats: doc.format || []
    }));
  }

  // Freesound.org search implementation
  async searchFreesound(query, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    // Note: You'll need to get an API key from freesound.org
    const apiKey = config.freesoundApiKey;
    
    if (!apiKey) {
      throw new Error('Freesound API key not configured');
    }

    const params = new URLSearchParams({
      query: query,
      page_size: limit.toString(),
      page: Math.floor(offset / limit) + 1,
      fields: 'id,name,description,username,duration,download,previews,images',
      token: apiKey
    });

    try {
      const response = await fetch(`https://freesound.org/apiv2/search/text/?${params}`);
      const data = await response.json();
      
      if (data.results) {
        return this.formatFreesoundResults(data.results);
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Freesound search error:', error);
      throw error;
    }
  }

  // Format Freesound results
  formatFreesoundResults(results) {
    return results.map(result => ({
      id: `fs_${result.id}`,
      title: result.name,
      artist: result.username,
      description: result.description,
      duration: this.formatDuration(result.duration),
      audioUrl: result.previews['preview-hq-mp3'] || result.previews['preview-lq-mp3'],
      downloadUrl: result.download,
      poster: result.images?.waveform_m || result.images?.spectral_m,
      source: 'Freesound',
      license: 'Creative Commons'
    }));
  }

  // Spotify Web API for preview clips (30 seconds)
  async searchSpotifyPreviews(query, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    // Note: You'll need to implement Spotify OAuth for access token
    const accessToken = await this.getSpotifyAccessToken();
    
    if (!accessToken) {
      throw new Error('Spotify access token not available');
    }

    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: limit.toString(),
      offset: offset.toString()
    });

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.tracks && data.tracks.items) {
        return this.formatSpotifyResults(data.tracks.items);
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Spotify search error:', error);
      throw error;
    }
  }

  // Format Spotify results
  formatSpotifyResults(tracks) {
    return tracks.map(track => ({
      id: `spotify_${track.id}`,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      releaseYear: track.album.release_date ? new Date(track.album.release_date).getFullYear() : null,
      duration: this.formatDuration(track.duration_ms / 1000),
      audioUrl: track.preview_url, // 30-second preview
      poster: track.album.images?.[0]?.url,
      spotifyUrl: track.external_urls.spotify,
      source: 'Spotify',
      isPreview: true,
      previewDuration: '0:30'
    }));
  }

  // Get Spotify access token (Client Credentials Flow)
  async getSpotifyAccessToken() {
    const clientId = config.spotifyClientId;
    const clientSecret = config.spotifyClientSecret;
    
    if (!clientId || !clientSecret) {
      return null;
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Spotify token error:', error);
      return null;
    }
  }

  // Utility function to format duration
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Get available music services
  getAvailableServices() {
    return [
      {
        id: 'jamendo',
        name: 'Jamendo',
        description: 'Free music with Creative Commons licenses',
        features: ['Search', 'Streaming', 'Full tracks', 'Metadata']
      },
      {
        id: 'internetarchive',
        name: 'Internet Archive',
        description: 'Public domain music collection',
        features: ['Search', 'Streaming', 'Full tracks', 'Historical recordings']
      },
      {
        id: 'freesound',
        name: 'Freesound',
        description: 'Sound effects and music clips',
        features: ['Search', 'Streaming', 'Sound effects', 'Music clips']
      },
      {
        id: 'spotify',
        name: 'Spotify',
        description: '30-second preview clips',
        features: ['Search', 'Previews only', 'High quality metadata']
      }
    ];
  }
}

module.exports = new FreeMusicService();
