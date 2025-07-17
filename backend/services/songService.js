// services/songService.js
const Song = require('../models/Song');
const config = require('../config/config');

class SongService {
  constructor() {
    this.songs = this.initializeSongs();
  }

  initializeSongs() {
    const songData = [
      {
        id: 1,
        title: "Naatu Naatu",
        artist: "Kala Bhairava, Rahul Sipligunj",
        movie: "RRR",
        genre: "Folk/Dance",
        duration: "4:32",
        releaseYear: 2021,
        defaultLanguage: "Telugu",
        poster: "https://example.com/naatu-poster.jpg",
        versions: [
          { 
            language: "Telugu", 
            url: `http://localhost:${config.port}/audio/naatu_telugu.mp3`,
            lyrics: "పాట వింటే గుండెల్లో నాట్యం",
            singer: "Kala Bhairava, Rahul Sipligunj",
            lyricist: "Chandrabose",
            musicDirector: "M. M. Keeravani"
          },
          { 
            language: "Hindi", 
            url: `http://localhost:${config.port}/audio/naatu_hindi.mp3`,
            lyrics: "गाना सुनके दिल में नाचे",
            singer: "Vishal Mishra, Rahul Sipligunj",
            lyricist: "Varun Grover",
            musicDirector: "M. M. Keeravani"
          },
          { 
            language: "Tamil", 
            url: `http://localhost:${config.port}/audio/naatu_tamil.mp3`,
            lyrics: "பாட்டு கேட்டா மனசுல ஆட்டம்",
            singer: "Anirudh Ravichander",
            lyricist: "Arivu",
            musicDirector: "M. M. Keeravani"
          }
        ]
      },
      // You can add more songs here in the future
      {
        id: 2,
        title: "Kesariya",
        artist: "Arijit Singh",
        movie: "Brahmastra",
        genre: "Romance",
        duration: "4:28",
        releaseYear: 2022,
        defaultLanguage: "Hindi",
        poster: "https://example.com/kesariya-poster.jpg",
        versions: [
          { 
            language: "Hindi", 
            url: `http://localhost:${config.port}/audio/kesariya_hindi.mp3`,
            lyrics: "केसरिया तेरा इश्क़ है पिया",
            singer: "Arijit Singh",
            lyricist: "Amitabh Bhattacharya",
            musicDirector: "Pritam"
          },
          { 
            language: "Telugu", 
            url: `http://localhost:${config.port}/audio/kesariya_telugu.mp3`,
            lyrics: "కేసరిని నీ ప్రేమ కథ",
            singer: "Sid Sriram",
            lyricist: "Krishna Kanth",
            musicDirector: "Pritam"
          }
        ]
      }
    ];

    return songData.map(data => new Song(data));
  }

  // Get all songs
  getAllSongs(filters = {}) {
    let filteredSongs = [...this.songs];

    // Filter by language
    if (filters.language) {
      filteredSongs = filteredSongs.filter(song => 
        song.hasLanguage(filters.language)
      );
    }

    // Filter by genre
    if (filters.genre) {
      filteredSongs = filteredSongs.filter(song => 
        song.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    // Filter by year
    if (filters.year) {
      filteredSongs = filteredSongs.filter(song => 
        song.releaseYear === parseInt(filters.year)
      );
    }

    return filteredSongs.map(song => song.toJSON());
  }

  // Get song by ID
  getSongById(id) {
    const song = this.songs.find(s => s.id === parseInt(id));
    return song ? song.toJSON() : null;
  }

  // Get song with specific language version
  getSongByLanguage(id, language) {
    const song = this.songs.find(s => s.id === parseInt(id));
    if (!song) return null;

    const version = song.getVersionByLanguage(language);
    if (!version) return null;

    return {
      ...song.toJSON(),
      currentVersion: version,
      availableLanguages: song.getAvailableLanguages()
    };
  }

  // Search songs
  searchSongs(query, filters = {}) {
    const searchTerm = query.toLowerCase();
    let results = this.songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.movie.toLowerCase().includes(searchTerm) ||
      song.genre.toLowerCase().includes(searchTerm)
    );

    // Apply additional filters
    if (filters.language) {
      results = results.filter(song => song.hasLanguage(filters.language));
    }

    return results.map(song => song.toJSON());
  }

  // Get all available languages
  getAvailableLanguages() {
    const languagesSet = new Set();
    this.songs.forEach(song => {
      song.getAvailableLanguages().forEach(lang => {
        languagesSet.add(lang);
      });
    });
    return Array.from(languagesSet);
  }

  // Get songs by genre
  getSongsByGenre(genre) {
    return this.songs
      .filter(song => song.genre.toLowerCase().includes(genre.toLowerCase()))
      .map(song => song.toJSON());
  }

  // Get songs by year
  getSongsByYear(year) {
    return this.songs
      .filter(song => song.releaseYear === parseInt(year))
      .map(song => song.toJSON());
  }

  // Get random songs
  getRandomSongs(count = 5) {
    const shuffled = [...this.songs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(song => song.toJSON());
  }

  // Get trending songs (for now, just return all songs)
  getTrendingSongs(limit = 10) {
    return this.songs.slice(0, limit).map(song => song.toJSON());
  }
}

module.exports = new SongService();
