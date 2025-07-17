# Free Music APIs Setup Guide

Your MultiTune application now supports multiple free music APIs! Here's how to use them:

## 🎵 Available APIs

### 1. Jamendo (✅ Configured)
- **Status**: Ready to use
- **Features**: Full tracks, Creative Commons licensed
- **Rate Limit**: 35,000 requests/month
- **Client ID**: `1feabb5a`

### 2. Internet Archive (✅ Working)
- **Status**: Ready to use (no API key required)
- **Features**: Public domain music, historical recordings
- **Rate Limit**: Very generous
- **No setup required**

### 3. Freesound (⚠️ Needs Setup)
- **Status**: API key required
- **Features**: Sound effects, music clips
- **Rate Limit**: 2,000 requests/day
- **Setup**: Get API key from https://freesound.org/help/developers/

### 4. Spotify (⚠️ Needs Setup)
- **Status**: Credentials required
- **Features**: 30-second previews, metadata
- **Rate Limit**: 1,000 requests/hour
- **Setup**: Get credentials from https://developer.spotify.com/dashboard/

## 🚀 API Endpoints

### Search Music
```
GET /api/free-music/search?q={query}&service={service}&limit={limit}
```

**Parameters:**
- `q` (required): Search query
- `service` (optional): `jamendo`, `internetarchive`, `freesound`, `spotify`
- `limit` (optional): Number of results (max 100)
- `offset` (optional): Pagination offset

**Example:**
```bash
curl "http://localhost:3000/api/free-music/search?q=piano&service=jamendo&limit=5"
```

### Get Popular Tracks
```
GET /api/free-music/popular?service={service}&limit={limit}
```

**Example:**
```bash
curl "http://localhost:3000/api/free-music/popular?service=jamendo&limit=10"
```

### Multi-Service Search
```
GET /api/free-music/multi-search?q={query}&limit={limit}
```

**Example:**
```bash
curl "http://localhost:3000/api/free-music/multi-search?q=classical&limit=5"
```

### Get Available Services
```
GET /api/free-music/services
```

### Get Track Details
```
GET /api/free-music/track/{service}/{id}
```

## 🖥️ Frontend Integration

### Using the FreeMusicBrowser Component

1. **Add to your app:**
```jsx
import FreeMusicBrowser from './components/FreeMusicBrowser';

function App() {
  return (
    <div>
      <FreeMusicBrowser />
    </div>
  );
}
```

2. **Features:**
- Search across multiple music services
- Play/pause tracks directly
- Download tracks (where available)
- Browse popular tracks
- Service switching

### Using the API Service

```jsx
import { apiService } from './services/api';

// Search for music
const results = await apiService.freeMusicSearch('piano', {
  service: 'jamendo',
  limit: 10
});

// Get popular tracks
const popular = await apiService.getPopularTracks({
  service: 'jamendo',
  limit: 20
});

// Multi-service search
const multiResults = await apiService.multiServiceSearch('jazz', {
  limit: 5
});
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Already configured
JAMENDO_CLIENT_ID=1feabb5a
JAMENDO_CLIENT_SECRET=a09ec58089de9b36a926397b39dcb022

# Optional - add these for more services
FREESOUND_API_KEY=your-freesound-api-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

## 🧪 Testing

### Test all APIs:
```bash
cd backend
npm run test-apis
```

### Test specific endpoints:
```bash
# Test Jamendo
curl "http://localhost:3000/api/free-music/search?q=piano&service=jamendo&limit=3"

# Test Internet Archive
curl "http://localhost:3000/api/free-music/search?q=jazz&service=internetarchive&limit=3"

# Test popular tracks
curl "http://localhost:3000/api/free-music/popular?service=jamendo&limit=5"
```

## 📱 Usage Examples

### 1. Basic Search
```javascript
const searchMusic = async (query) => {
  try {
    const response = await apiService.freeMusicSearch(query, {
      service: 'jamendo',
      limit: 10
    });
    return response.data.data;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};
```

### 2. Play Music
```javascript
const playTrack = (track) => {
  const audio = new Audio(track.audioUrl);
  audio.play();
};
```

### 3. Download Track
```javascript
const downloadTrack = (track) => {
  if (track.audioDownloadUrl) {
    window.open(track.audioDownloadUrl, '_blank');
  }
};
```

## 🎨 Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "jamendo_1308147",
      "title": "Pretty_piano",
      "artist": "Alain Caylus",
      "album": "Prelude",
      "genre": "Classical",
      "duration": "3:45",
      "releaseYear": 2019,
      "poster": "https://usercontent.jamendo.com/covers/album/image.jpg",
      "audioUrl": "https://mp3l.jamendo.com/download/track/1308147/mp32/",
      "audioDownloadUrl": "https://mp3l.jamendo.com/download/track/1308147/mp32/",
      "lyrics": "",
      "license": "https://creativecommons.org/licenses/by-nc-sa/3.0/",
      "source": "Jamendo",
      "jamendoId": 1308147,
      "playCount": 1250,
      "likeCount": 45
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 1
  },
  "service": "jamendo"
}
```

## 🚨 Rate Limits

- **Jamendo**: 35,000 requests/month
- **Internet Archive**: Very generous
- **Freesound**: 2,000 requests/day (requires API key)
- **Spotify**: 1,000 requests/hour (requires credentials)

## 🎯 Next Steps

1. **Add more API keys** for Freesound and Spotify
2. **Integrate the FreeMusicBrowser** component in your app
3. **Customize the UI** to match your app's design
4. **Add playlists** and favorites functionality
5. **Implement user authentication** for personalized features

## 🎵 Enjoy Your Free Music Integration!

Your MultiTune app now has access to thousands of free, legal music tracks from multiple sources. Happy coding! 🎶
