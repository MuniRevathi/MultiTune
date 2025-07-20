#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 MultiTune Deployment Setup Helper');
console.log('=====================================\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const isInBackend = fs.existsSync(path.join(currentDir, 'server.js'));
const isInFrontend = fs.existsSync(path.join(currentDir, 'vite.config.js'));
const isInRoot = fs.existsSync(path.join(currentDir, 'backend')) && fs.existsSync(path.join(currentDir, 'frontend'));

if (!isInBackend && !isInFrontend && !isInRoot) {
  console.error('❌ Please run this script from the project root, backend, or frontend directory');
  process.exit(1);
}

function createEnvTemplate(type, filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${type} environment template: ${filePath}`);
  } else {
    console.log(`ℹ️  ${type} environment template already exists: ${filePath}`);
  }
}

if (isInRoot || isInBackend) {
  const backendPath = isInRoot ? 'backend' : '.';
  
  // Create backend .env template
  const backendEnvContent = `# Backend Environment Variables
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# For production deployment on Render, set these:
# NODE_ENV=production
# PORT=10000
# CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Optional: Free Music API Keys
JAMENDO_CLIENT_ID=1feabb5a
JAMENDO_CLIENT_SECRET=a09ec58089de9b36a926397b39dcb022
FREESOUND_API_KEY=your-freesound-api-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
`;

  createEnvTemplate('Backend', path.join(backendPath, '.env'), backendEnvContent);
}

if (isInRoot || isInFrontend) {
  const frontendPath = isInRoot ? 'frontend' : '.';
  
  // Create frontend .env template
  const frontendEnvContent = `# Frontend Environment Variables
# For local development
VITE_API_BASE_URL=http://localhost:3000/api

# For production deployment on Vercel, set this to your Render backend URL:
# VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
`;

  createEnvTemplate('Frontend', path.join(frontendPath, '.env.local'), frontendEnvContent);
}

console.log('\n📋 Next Steps:');
console.log('1. Update the environment variables with your actual values');
console.log('2. Follow the DEPLOYMENT_GUIDE.md for detailed deployment instructions');
console.log('3. Deploy backend to Render first, then frontend to Vercel');
console.log('4. Update CORS_ORIGIN and VITE_API_BASE_URL with actual deployment URLs');

console.log('\n🔗 Useful Links:');
console.log('- Render: https://render.com');
console.log('- Vercel: https://vercel.com');
console.log('- Deployment Guide: ./DEPLOYMENT_GUIDE.md');
