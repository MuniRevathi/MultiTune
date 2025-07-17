// backend/create-demo-env.js
const fs = require('fs');
const path = require('path');

// Demo environment variables that work without API keys
const demoEnvContent = `# Demo Environment Variables for Free Music APIs
# This configuration works without requiring API keys

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Jamendo API (Get your real client ID from: https://devportal.jamendo.com/)
# For demo purposes, we'll use Internet Archive which doesn't require API keys
JAMENDO_CLIENT_ID=demo-client-id

# Freesound API (Get your API key from: https://freesound.org/help/developers/)
FREESOUND_API_KEY=demo-api-key

# Spotify API (Get your credentials from: https://developer.spotify.com/dashboard/)
SPOTIFY_CLIENT_ID=demo-client-id
SPOTIFY_CLIENT_SECRET=demo-client-secret

# Note: Internet Archive works without API keys and provides free public domain music
# The application will work with just Internet Archive until you add real API keys
`;

const envPath = path.join(__dirname, '.env');

// Create .env file if it doesn't exist
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, demoEnvContent);
  console.log('✅ Created .env file with demo configuration');
  console.log('📁 Location:', envPath);
  console.log('');
  console.log('🎵 Your music app will work with Internet Archive (no API key required)');
  console.log('🔑 To add more services, get API keys from:');
  console.log('   • Jamendo: https://devportal.jamendo.com/');
  console.log('   • Freesound: https://freesound.org/help/developers/');
  console.log('   • Spotify: https://developer.spotify.com/dashboard/');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. npm start (to start the server)');
  console.log('   2. Open frontend and try the FreeMusicBrowser component');
  console.log('   3. Search for music using Internet Archive');
} else {
  console.log('⚠️  .env file already exists');
  console.log('📁 Location:', envPath);
  console.log('');
  console.log('If you want to reset it, delete the file and run this script again.');
}
