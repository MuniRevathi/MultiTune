// test-jamendo-api.js
const config = require('./config/config');

async function testJamendoAPI() {
  console.log('🎵 Testing Jamendo API...');
  console.log('Client ID:', config.jamendoClientId);
  
  try {
    // Test basic API connection
    const testUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${config.jamendoClientId}&format=json&limit=5&order=popularity_total`;
    
    console.log('Making request to:', testUrl);
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    console.log('API Response Status:', data.headers.status);
    console.log('Result Count:', data.results.length);
    
    if (data.headers.status === 'success') {
      console.log('✅ Jamendo API is working!');
      console.log('\nSample tracks:');
      data.results.forEach((track, index) => {
        console.log(`${index + 1}. ${track.name} by ${track.artist_name}`);
        console.log(`   Audio URL: ${track.audio}`);
        console.log(`   Duration: ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`);
        console.log('');
      });
    } else {
      console.log('❌ API Error:', data.headers.error_message);
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  }
}

// Run the test
testJamendoAPI();
