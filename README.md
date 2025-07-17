# Using Real Songs in MultiTune

## Current Setup
The application is now configured to support both local files and external streaming URLs.

## Options for Real Songs

### 1. **Free Music APIs (Recommended for Development)**
- **Freesound.org**: Free sound effects and music clips
- **Jamendo API**: Free music with Creative Commons licenses
- **SoundCloud API**: Access to SoundCloud tracks (requires API key)
- **Internet Archive**: Free music archives

### 2. **YouTube Audio (Legal Considerations)**
- You can use YouTube's embed API for music videos
- Note: Direct audio extraction may violate terms of service
- Consider using YouTube's official embed player

### 3. **Streaming Service APIs**
- **Spotify Web API**: Preview clips (30 seconds)
- **Apple Music API**: Preview clips
- **Deezer API**: Preview clips
- Note: These only provide 30-second previews

### 4. **Sample Audio Files**
For testing purposes, you can use:
- **zapsplat.com**: Free sound effects (requires account)
- **freemusicarchive.org**: Free music
- **ccmixter.org**: Creative Commons music

## Implementation Example

### Using External URLs:
```javascript
// In backend/services/songService.js, update the song data:
{
  id: 1,
  title: "Song Title",
  versions: [
    {
      language: "Hindi",
      audioUrl: "https://example.com/song-hindi.mp3", // External URL
      lyrics: "Song lyrics..."
    }
  ]
}
```

### Using Spotify Preview API:
```javascript
// Example API call to get preview URL
const getSpotifyPreview = async (trackId) => {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  });
  const data = await response.json();
  return data.preview_url; // 30-second preview
};
```

## Legal Considerations

⚠️ **Important**: Always ensure you have the legal right to use any music:

1. **Copyright**: Most commercial music is copyrighted
2. **Licensing**: You need proper licenses for commercial use
3. **Fair Use**: May apply for educational/personal projects
4. **Creative Commons**: Use CC-licensed music when possible

## For Production Use

For a real production website, consider:

1. **Music Licensing Services**:
   - ASCAP, BMI, SESAC for performance rights
   - Mechanical licensing for reproductions

2. **Cloud Storage**:
   - AWS S3 for audio file storage
   - CloudFront CDN for fast delivery

3. **Database Integration**:
   - Replace in-memory storage with MongoDB/PostgreSQL
   - Store song metadata and file URLs

4. **Audio Processing**:
   - Convert files to multiple formats (MP3, OGG, AAC)
   - Implement adaptive bitrate streaming

## Quick Start for Testing

1. **Add sample files** to `backend/audio/` folder
2. **Update song data** in `backend/services/songService.js`
3. **Test with free music** from Creative Commons sources

Would you like me to help you integrate any specific music service or set up sample songs for testing?
