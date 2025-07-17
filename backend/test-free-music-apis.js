// backend/test-free-music-apis.js
const freeMusicService = require('./services/freeMusicService');
const jamendoService = require('./services/jamendoService');
const config = require('./config/config');

console.log('Testing Free Music APIs...\n');

// Test configuration
console.log('Configuration:');
console.log('- Jamendo Client ID:', config.jamendoClientId ? 'Set' : 'Not set');
console.log('- Freesound API Key:', config.freesoundApiKey ? 'Set' : 'Not set');
console.log('- Spotify Client ID:', config.spotifyClientId ? 'Set' : 'Not set');
console.log('- Spotify Client Secret:', config.spotifyClientSecret ? 'Set' : 'Not set');
console.log('');

async function testAPIs() {
  // Test Jamendo API
  console.log('=== Testing Jamendo API ===');
  try {
    const jamendoResults = await jamendoService.searchTracks('piano', { limit: 3 });
    console.log('✅ Jamendo search successful');
    console.log('Found', jamendoResults.length, 'tracks');
    if (jamendoResults.length > 0) {
      const track = jamendoResults[0];
      console.log('Sample track:', track.title, 'by', track.artist);
      console.log('Audio URL:', track.audioUrl);
    }
  } catch (error) {
    console.log('❌ Jamendo search failed:', error.message);
  }
  console.log('');

  // Test Jamendo Popular Tracks
  console.log('=== Testing Jamendo Popular Tracks ===');
  try {
    const popularTracks = await jamendoService.getPopularTracks({ limit: 3 });
    console.log('✅ Jamendo popular tracks successful');
    console.log('Found', popularTracks.length, 'tracks');
    if (popularTracks.length > 0) {
      const track = popularTracks[0];
      console.log('Popular track:', track.title, 'by', track.artist);
    }
  } catch (error) {
    console.log('❌ Jamendo popular tracks failed:', error.message);
  }
  console.log('');

  // Test Internet Archive
  console.log('=== Testing Internet Archive ===');
  try {
    const iaResults = await freeMusicService.searchTracks('jazz', { service: 'internetarchive', limit: 3 });
    console.log('✅ Internet Archive search successful');
    console.log('Found', iaResults.length, 'tracks');
    if (iaResults.length > 0) {
      const track = iaResults[0];
      console.log('Sample track:', track.title, 'by', track.artist);
      console.log('Audio URL:', track.audioUrl);
    }
  } catch (error) {
    console.log('❌ Internet Archive search failed:', error.message);
  }
  console.log('');

  // Test Freesound (if API key is set)
  if (config.freesoundApiKey && config.freesoundApiKey !== 'your-freesound-api-key') {
    console.log('=== Testing Freesound API ===');
    try {
      const freesoundResults = await freeMusicService.searchTracks('ambient', { service: 'freesound', limit: 3 });
      console.log('✅ Freesound search successful');
      console.log('Found', freesoundResults.length, 'tracks');
      if (freesoundResults.length > 0) {
        const track = freesoundResults[0];
        console.log('Sample track:', track.title, 'by', track.artist);
      }
    } catch (error) {
      console.log('❌ Freesound search failed:', error.message);
    }
  } else {
    console.log('⚠️  Freesound API key not configured, skipping test');
  }
  console.log('');

  // Test Spotify (if credentials are set)
  if (config.spotifyClientId && config.spotifyClientId !== 'your-spotify-client-id' && 
      config.spotifyClientSecret && config.spotifyClientSecret !== 'your-spotify-client-secret') {
    console.log('=== Testing Spotify API ===');
    try {
      const spotifyResults = await freeMusicService.searchTracks('rock', { service: 'spotify', limit: 3 });
      console.log('✅ Spotify search successful');
      console.log('Found', spotifyResults.length, 'tracks');
      if (spotifyResults.length > 0) {
        const track = spotifyResults[0];
        console.log('Sample track:', track.title, 'by', track.artist);
        console.log('Preview URL:', track.audioUrl);
      }
    } catch (error) {
      console.log('❌ Spotify search failed:', error.message);
    }
  } else {
    console.log('⚠️  Spotify credentials not configured, skipping test');
  }
  console.log('');

  // Test Multi-Service Search
  console.log('=== Testing Multi-Service Search ===');
  try {
    const multiResults = await freeMusicService.searchTracks('classical', { service: 'jamendo', limit: 2 });
    const iaResults = await freeMusicService.searchTracks('classical', { service: 'internetarchive', limit: 2 });
    
    console.log('✅ Multi-service search successful');
    console.log('Jamendo results:', multiResults.length);
    console.log('Internet Archive results:', iaResults.length);
  } catch (error) {
    console.log('❌ Multi-service search failed:', error.message);
  }
  console.log('');

  // Test Available Services
  console.log('=== Testing Available Services ===');
  try {
    const services = freeMusicService.getAvailableServices();
    console.log('✅ Available services loaded');
    console.log('Services:', services.map(s => s.name).join(', '));
  } catch (error) {
    console.log('❌ Failed to load services:', error.message);
  }
  console.log('');

  console.log('Testing complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Set up API keys in your .env file');
  console.log('2. Start the server: npm start');
  console.log('3. Test the frontend with the FreeMusicBrowser component');
  console.log('4. Check the API_SETUP_GUIDE.md for detailed setup instructions');
}

// Run tests
testAPIs().catch(console.error);
