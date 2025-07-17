// routes/freeMusicRoutes.js
const express = require('express');
const router = express.Router();
const freeMusicService = require('../services/freeMusicService');
const { validateSearch } = require('../middleware/validation');

// Search tracks across different music services
router.get('/search', validateSearch, async (req, res) => {
  try {
    const { q: query, service = 'jamendo', limit = 10, offset = 0 } = req.query;
    
    const results = await freeMusicService.searchTracks(query, {
      service,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: results,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: results.length
      },
      service
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get popular tracks
router.get('/popular', async (req, res) => {
  try {
    const { service = 'jamendo', limit = 20 } = req.query;
    
    const results = await freeMusicService.getPopularTracks({
      service,
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      data: results,
      service
    });
  } catch (error) {
    console.error('Popular tracks error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get tracks by genre (Jamendo only)
router.get('/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const jamendoService = require('../services/jamendoService');
    const results = await jamendoService.getTracksByGenre(genreId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: results,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: results.length
      }
    });
  } catch (error) {
    console.error('Genre tracks error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get available music services
router.get('/services', (req, res) => {
  try {
    const services = freeMusicService.getAvailableServices();
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get track details by ID and service
router.get('/track/:service/:id', async (req, res) => {
  try {
    const { service, id } = req.params;
    
    let track;
    switch (service) {
      case 'jamendo':
        const jamendoService = require('../services/jamendoService');
        track = await jamendoService.getTrack(id);
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: `Service ${service} not supported for track details`
        });
    }
    
    res.json({
      success: true,
      data: track
    });
  } catch (error) {
    console.error('Track details error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get genres (Jamendo only)
router.get('/genres', async (req, res) => {
  try {
    const jamendoService = require('../services/jamendoService');
    const genres = await jamendoService.getGenres();
    
    res.json({
      success: true,
      data: genres
    });
  } catch (error) {
    console.error('Genres error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Multi-service search (search across multiple APIs)
router.get('/multi-search', validateSearch, async (req, res) => {
  try {
    const { q: query, limit = 5 } = req.query;
    
    const services = ['jamendo', 'internetarchive'];
    const promises = services.map(service => 
      freeMusicService.searchTracks(query, { service, limit: parseInt(limit) })
        .catch(error => ({ service, error: error.message, results: [] }))
    );
    
    const results = await Promise.all(promises);
    
    const response = {
      success: true,
      data: results.reduce((acc, result) => {
        if (result.error) {
          acc.errors = acc.errors || [];
          acc.errors.push({ service: result.service, error: result.error });
        } else {
          acc.results = acc.results || [];
          acc.results.push({
            service: result.service || 'unknown',
            tracks: result
          });
        }
        return acc;
      }, {})
    };
    
    res.json(response);
  } catch (error) {
    console.error('Multi-search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
