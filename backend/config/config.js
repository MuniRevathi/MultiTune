// config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  audioPath: './audio',
  maxFileSize: '50mb',
  supportedFormats: ['.mp3', '.wav', '.flac', '.ogg'],
  supportedLanguages: ['Hindi', 'Telugu', 'Tamil', 'English', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Marathi', 'Punjabi'],
  
  // Free Music API Keys
  jamendoClientId: process.env.JAMENDO_CLIENT_ID || '1feabb5a',
  jamendoClientSecret: process.env.JAMENDO_CLIENT_SECRET || 'a09ec58089de9b36a926397b39dcb022',
  freesoundApiKey: process.env.FREESOUND_API_KEY || 'your-freesound-api-key',
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID || 'your-spotify-client-id',
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'your-spotify-client-secret',
  
  // API Rate Limits
  apiRateLimit: {
    jamendo: 35000, // requests per month
    freesound: 2000, // requests per day
    spotify: 1000 // requests per hour
  }
};
