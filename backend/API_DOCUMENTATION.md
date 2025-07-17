// Backend API Documentation

# Multi-Language Song API

## Overview
This API provides endpoints for managing and streaming multi-language songs. It's built with Express.js and designed to handle song metadata, different language versions, and audio streaming.

## Base URL
```
http://localhost:3000
```

## API Endpoints

### 1. Root Endpoint
- **GET** `/`
- **Description**: Get API information and available endpoints
- **Response**: JSON object with API details

### 2. Health Check
- **GET** `/api/health`
- **Description**: Check API health and status
- **Response**: Health status and server information

### 3. Songs

#### Get All Songs
- **GET** `/api/songs`
- **Description**: Retrieve all available songs
- **Query Parameters**:
  - `language` (optional): Filter by language
  - `genre` (optional): Filter by genre
  - `year` (optional): Filter by release year
- **Response**: Array of song objects

#### Get Song by ID
- **GET** `/api/songs/:id`
- **Description**: Get specific song by ID
- **Parameters**:
  - `id`: Song ID (integer)
- **Response**: Song object with all language versions

#### Get Song by Language
- **GET** `/api/songs/:id/language/:lang`
- **Description**: Get specific language version of a song
- **Parameters**:
  - `id`: Song ID (integer)
  - `lang`: Language name (string)
- **Response**: Song object with current version details

#### Get Songs by Genre
- **GET** `/api/songs/genre/:genre`
- **Description**: Get all songs of a specific genre
- **Parameters**:
  - `genre`: Genre name (string)
- **Response**: Array of songs

#### Get Songs by Year
- **GET** `/api/songs/year/:year`
- **Description**: Get all songs from a specific year
- **Parameters**:
  - `year`: Release year (integer)
- **Response**: Array of songs

#### Get Random Songs
- **GET** `/api/songs/random/:count?`
- **Description**: Get random songs
- **Parameters**:
  - `count` (optional): Number of songs to return (default: 5)
- **Response**: Array of random songs

#### Get Trending Songs
- **GET** `/api/songs/trending/:limit?`
- **Description**: Get trending songs
- **Parameters**:
  - `limit` (optional): Number of songs to return (default: 10)
- **Response**: Array of trending songs

### 4. Languages
- **GET** `/api/languages`
- **Description**: Get all available languages
- **Response**: Array of language strings

### 5. Search
- **GET** `/api/search`
- **Description**: Search for songs
- **Query Parameters**:
  - `q` (required): Search query
  - `language` (optional): Filter by language
  - `genre` (optional): Filter by genre
  - `year` (optional): Filter by year
- **Response**: Array of matching songs

### 6. Audio Streaming
- **GET** `/api/stream/:songId/:language`
- **Description**: Stream audio file with range support
- **Parameters**:
  - `songId`: Song ID (integer)
  - `language`: Language name (string)
- **Response**: Audio stream (supports range requests)

### 7. Static Audio Files
- **GET** `/audio/:filename`
- **Description**: Direct access to audio files
- **Parameters**:
  - `filename`: Audio file name
- **Response**: Audio file

## Response Format

### Success Response
```json
{
  "success": true,
  "data": [...],
  "total": number,
  "additional_info": "..."
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Song Object Structure
```json
{
  "id": 1,
  "title": "Song Title",
  "artist": "Artist Name",
  "movie": "Movie Name",
  "genre": "Genre",
  "duration": "4:32",
  "releaseYear": 2021,
  "defaultLanguage": "Telugu",
  "poster": "URL to poster image",
  "versions": [
    {
      "language": "Telugu",
      "url": "http://localhost:3000/audio/song_telugu.mp3",
      "lyrics": "Song lyrics",
      "singer": "Singer name",
      "lyricist": "Lyricist name",
      "musicDirector": "Music director name"
    }
  ],
  "availableLanguages": ["Telugu", "Hindi", "Tamil"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Error Codes
- `400`: Bad Request - Invalid parameters
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Applied to all `/api/` endpoints

## Audio File Requirements
- Supported formats: MP3, WAV, FLAC, OGG
- Maximum file size: 50MB
- Audio files should be placed in the `/audio` directory

## Example Usage

### Get all songs
```bash
curl http://localhost:3000/api/songs
```

### Get song by ID
```bash
curl http://localhost:3000/api/songs/1
```

### Get Hindi version of a song
```bash
curl http://localhost:3000/api/songs/1/language/hindi
```

### Search for songs
```bash
curl "http://localhost:3000/api/search?q=naatu&language=telugu"
```

### Stream audio
```bash
curl "http://localhost:3000/api/stream/1/telugu" --range 0-1023
```

## Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `CORS_ORIGIN`: Allowed CORS origins

## Future Enhancements
- Database integration (MongoDB/PostgreSQL)
- User authentication and playlists
- File upload functionality
- Advanced search with filters
- Recommendation system
- Real-time lyrics display
- Social features (likes, comments, sharing)
