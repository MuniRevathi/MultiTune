// routes/songRoutes.js
const express = require('express');
const router = express.Router();
const songService = require('../services/songService');
const { validateSongId, validateLanguage } = require('../middleware/validation');

// Get all songs
router.get('/', (req, res) => {
  try {
    const { language, genre, year } = req.query;
    const filters = { language, genre, year };
    const songs = songService.getAllSongs(filters);
    
    res.json({
      success: true,
      data: songs,
      total: songs.length,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch songs',
      message: error.message
    });
  }
});

// Get songs by genre (must come before /:id)
router.get('/genre/:genre', (req, res) => {
  try {
    const songs = songService.getSongsByGenre(req.params.genre);
    res.json({
      success: true,
      data: songs,
      total: songs.length,
      genre: req.params.genre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch songs by genre',
      message: error.message
    });
  }
});

// Get songs by year (must come before /:id)
router.get('/year/:year', (req, res) => {
  try {
    const songs = songService.getSongsByYear(req.params.year);
    res.json({
      success: true,
      data: songs,
      total: songs.length,
      year: parseInt(req.params.year)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch songs by year',
      message: error.message
    });
  }
});

// Get random songs (must come before /:id)
router.get('/random/:count', (req, res) => {
  try {
    const count = parseInt(req.params.count) || 5;
    const songs = songService.getRandomSongs(count);
    res.json({
      success: true,
      data: songs,
      total: songs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random songs',
      message: error.message
    });
  }
});

// Get random songs with default count (must come before /:id)
router.get('/random', (req, res) => {
  try {
    const songs = songService.getRandomSongs(5);
    res.json({
      success: true,
      data: songs,
      total: songs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random songs',
      message: error.message
    });
  }
});

// Get trending songs (must come before /:id)
router.get('/trending/:limit', (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const songs = songService.getTrendingSongs(limit);
    res.json({
      success: true,
      data: songs,
      total: songs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending songs',
      message: error.message
    });
  }
});

// Get trending songs with default limit (must come before /:id)
router.get('/trending', (req, res) => {
  try {
    const songs = songService.getTrendingSongs(10);
    res.json({
      success: true,
      data: songs,
      total: songs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending songs',
      message: error.message
    });
  }
});

// Get song by ID (must come after specific routes)
router.get('/:id', validateSongId, (req, res) => {
  try {
    const song = songService.getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found'
      });
    }
    
    res.json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch song',
      message: error.message
    });
  }
});

// Get specific language version of a song
router.get('/:id/language/:lang', validateSongId, validateLanguage, (req, res) => {
  try {
    const songWithVersion = songService.getSongByLanguage(req.params.id, req.params.lang);
    if (!songWithVersion) {
      return res.status(404).json({
        success: false,
        error: 'Song or language version not found'
      });
    }
    
    res.json({
      success: true,
      data: songWithVersion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch song version',
      message: error.message
    });
  }
});

module.exports = router;
