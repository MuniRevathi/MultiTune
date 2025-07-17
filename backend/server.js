const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import configurations and services
const config = require('./config/config');
const songService = require('./services/songService');
const songRoutes = require('./routes/songRoutes');
const { validateSearchQuery, createRateLimiter } = require('./middleware/validation');

const app = express();
const PORT = config.port;

// Security and logging middleware
// app.use(helmet()); // Uncomment when helmet is installed
// app.use(morgan('combined')); // Uncomment when morgan is installed

// Rate limiting
app.use('/api/', createRateLimiter(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// CORS configuration
app.use(cors({
  origin: [config.corsOrigin, 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve audio files with proper headers
app.use('/audio', express.static(path.join(__dirname, 'audio'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// API Routes
app.use('/api/songs', songRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Multi-Language Song API',
    version: '1.0.0',
    environment: config.nodeEnv,
    endpoints: {
      songs: '/api/songs',
      songById: '/api/songs/:id',
      languages: '/api/languages',
      songByLanguage: '/api/songs/:id/language/:lang',
      search: '/api/search',
      health: '/api/health',
      stream: '/api/stream/:songId/:language'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: '1.0.0'
  });
});

// Get all available languages
app.get('/api/languages', (req, res) => {
  try {
    const languages = songService.getAvailableLanguages();
    res.json({
      success: true,
      data: languages,
      total: languages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch languages',
      message: error.message
    });
  }
});

// Search songs
app.get('/api/search', validateSearchQuery, (req, res) => {
  try {
    const { q, language, genre, year } = req.query;
    const filters = { language, genre, year };
    const results = songService.searchSongs(q, filters);
    
    res.json({
      success: true,
      data: results,
      total: results.length,
      query: q,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

// Stream audio file with range support
app.get('/api/stream/:songId/:language', (req, res) => {
  try {
    const song = songService.getSongById(req.params.songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found'
      });
    }
    
    const version = song.versions.find(
      v => v.language.toLowerCase() === req.params.language.toLowerCase()
    );
    
    if (!version) {
      return res.status(404).json({
        success: false,
        error: 'Language version not found'
      });
    }
    
    const fileName = path.basename(version.url);
    const filePath = path.join(__dirname, 'audio', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Audio file not found'
      });
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600'
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to stream audio',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: config.nodeEnv === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
  console.log(`📁 Audio files served from: ${path.join(__dirname, 'audio')}`);
  console.log(`🎵 Available songs: ${songService.getAllSongs().length}`);
  console.log(`🌍 Available languages: ${songService.getAvailableLanguages().join(', ')}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
});
