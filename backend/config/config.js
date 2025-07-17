// config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  audioPath: './audio',
  maxFileSize: '50mb',
  supportedFormats: ['.mp3', '.wav', '.flac', '.ogg'],
  supportedLanguages: ['Hindi', 'Telugu', 'Tamil', 'English', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Marathi', 'Punjabi']
};
