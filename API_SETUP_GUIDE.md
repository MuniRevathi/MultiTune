# Free Music API Setup Guide

This guide will help you set up free music APIs for your MultiTune application.

## Getting API Keys

### 1. Jamendo API (Recommended - Free Creative Commons Music)

Jamendo provides free music with Creative Commons licenses, perfect for streaming.

**Steps to get API key:**
1. Go to [Jamendo Developer Portal](https://devportal.jamendo.com/)
2. Create an account or log in
3. Create a new application
4. Copy your `Client ID`

**Add to your `.env` file:**
```
JAMENDO_CLIENT_ID=your-jamendo-client-id-here
```

**Features:**
- Full-length tracks
- Free to use
- Creative Commons licenses
- Search, popular tracks, genres
- High-quality audio

### 2. Freesound API (Free Sound Effects & Music)

**Steps to get API key:**
1. Go to [Freesound.org](https://freesound.org/help/developers/)
2. Create an account
3. Go to your profile → API Keys
4. Create a new API key

**Add to your `.env` file:**
```
FREESOUND_API_KEY=your-freesound-api-key-here
```

**Features:**
- Sound effects and music clips
- Creative Commons licenses
- 2,000 requests per day (free)

### 3. Spotify Web API (30-second previews)

**Steps to get API credentials:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Create a new app
4. Copy your `Client ID` and `Client Secret`

**Add to your `.env` file:**
```
SPOTIFY_CLIENT_ID=your-spotify-client-id-here
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret-here
```

**Features:**
- 30-second preview clips
- High-quality metadata
- Album artwork
- 1,000 requests per hour

### 4. Internet Archive (No API Key Required)

The Internet Archive provides public domain music and doesn't require an API key.

**Features:**
- Public domain music
- Historical recordings
- No API key required
- Free to use

## Environment Setup

1. Create a `.env` file in your `backend` directory:
```bash
cp .env.example .env
```

2. Add your API keys to the `.env` file:
```bash
# Jamendo API
JAMENDO_CLIENT_ID=your-jamendo-client-id-here

# Freesound API
FREESOUND_API_KEY=your-freesound-api-key-here

# Spotify API
SPOTIFY_CLIENT_ID=your-spotify-client-id-here
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret-here
```

## Testing the APIs

After setting up your API keys, you can test them:

### Start the backend server:
```bash
cd backend
npm install
npm start
```

### Test the endpoints:

1. **Search Jamendo:**
   ```bash
   curl "http://localhost:3000/api/free-music/search?q=piano&service=jamendo"
   ```

2. **Get popular tracks:**
   ```bash
   curl "http://localhost:3000/api/free-music/popular?service=jamendo"
   ```

3. **Multi-service search:**
   ```bash
   curl "http://localhost:3000/api/free-music/multi-search?q=jazz"
   ```

4. **Get available services:**
   ```bash
   curl "http://localhost:3000/api/free-music/services"
   ```

## API Endpoints

### Search Music
- `GET /api/free-music/search?q={query}&service={service}&limit={limit}`
- Parameters:
  - `q`: Search query (required)
  - `service`: jamendo, internetarchive, freesound, spotify (optional)
  - `limit`: Number of results (default: 10, max: 100)

### Popular Tracks
- `GET /api/free-music/popular?service={service}&limit={limit}`

### Multi-Service Search
- `GET /api/free-music/multi-search?q={query}&limit={limit}`

### Track Details
- `GET /api/free-music/track/{service}/{id}`

### Available Services
- `GET /api/free-music/services`

## Rate Limits

- **Jamendo:** 35,000 requests/month
- **Freesound:** 2,000 requests/day
- **Spotify:** 1,000 requests/hour
- **Internet Archive:** Very generous limits

## Legal Considerations

- **Jamendo:** Creative Commons licenses - free to use
- **Freesound:** Various Creative Commons licenses - check individual tracks
- **Spotify:** Preview clips only - full tracks require Spotify Premium
- **Internet Archive:** Public domain - free to use

## Frontend Integration

The frontend component `FreeMusicBrowser` is already configured to work with these APIs. It provides:

- Service selection
- Search functionality
- Popular tracks browsing
- Multi-service search
- Audio playback
- Download links (where available)

## Troubleshooting

1. **API Key Issues:**
   - Make sure your `.env` file is in the correct directory
   - Restart the server after adding API keys
   - Check that your API keys are valid

2. **CORS Issues:**
   - The server is configured to handle CORS
   - Make sure your frontend is running on the correct port

3. **Audio Playback Issues:**
   - Some services may have CORS restrictions
   - Internet Archive tracks work best for direct playback

4. **Rate Limiting:**
   - Implement caching for better performance
   - Consider using multiple API keys for higher limits

## Next Steps

1. Set up your API keys
2. Test the endpoints
3. Customize the frontend component
4. Add caching for better performance
5. Implement user favorites/playlists
6. Add more music services as needed

For more advanced features, consider:
- User authentication
- Playlist management
- Advanced search filters
- Audio visualization
- Offline caching
