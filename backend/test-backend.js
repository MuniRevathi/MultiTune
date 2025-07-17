// test-backend.js
const testBaseUrl = 'http://localhost:3000';

async function testEndpoint(endpoint, description) {
  try {
    const response = await fetch(`${testBaseUrl}${endpoint}`);
    const data = await response.json();
    console.log(`✅ ${description} - Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 Testing Backend API Endpoints...\n');
  
  // Test all endpoints
  await testEndpoint('/', 'Root endpoint');
  await testEndpoint('/api/health', 'Health check');
  await testEndpoint('/api/songs', 'Get all songs');
  await testEndpoint('/api/songs/1', 'Get song by ID');
  await testEndpoint('/api/songs/1/language/hindi', 'Get song by language');
  await testEndpoint('/api/languages', 'Get all languages');
  await testEndpoint('/api/songs/genre/Folk', 'Get songs by genre');
  await testEndpoint('/api/songs/year/2021', 'Get songs by year');
  await testEndpoint('/api/songs/random', 'Get random songs');
  await testEndpoint('/api/songs/trending', 'Get trending songs');
  await testEndpoint('/api/search?q=naatu', 'Search songs');
  
  console.log('\n✅ All tests completed!');
}

runTests();
