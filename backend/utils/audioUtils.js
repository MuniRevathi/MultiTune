// utils/audioUtils.js
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class AudioUtils {
  // Check if audio file exists
  static checkAudioFile(fileName) {
    const filePath = path.join(__dirname, '..', config.audioPath, fileName);
    return fs.existsSync(filePath);
  }

  // Get audio file info
  static getAudioFileInfo(fileName) {
    const filePath = path.join(__dirname, '..', config.audioPath, fileName);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = fs.statSync(filePath);
    return {
      fileName,
      filePath,
      size: stats.size,
      sizeFormatted: this.formatFileSize(stats.size),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      extension: path.extname(fileName),
      mimeType: this.getMimeType(fileName)
    };
  }

  // Format file size
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get MIME type
  static getMimeType(fileName) {
    const extension = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.flac': 'audio/flac',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.aac': 'audio/aac'
    };
    return mimeTypes[extension] || 'audio/mpeg';
  }

  // Validate audio file format
  static isValidAudioFormat(fileName) {
    const extension = path.extname(fileName).toLowerCase();
    return config.supportedFormats.includes(extension);
  }

  // Get all audio files in directory
  static getAllAudioFiles() {
    const audioDir = path.join(__dirname, '..', config.audioPath);
    
    if (!fs.existsSync(audioDir)) {
      return [];
    }
    
    const files = fs.readdirSync(audioDir);
    return files.filter(file => this.isValidAudioFormat(file));
  }

  // Generate streaming URL
  static generateStreamingUrl(songId, language, baseUrl) {
    return `${baseUrl}/api/stream/${songId}/${language}`;
  }

  // Create audio file metadata
  static createAudioMetadata(fileName, songInfo) {
    const fileInfo = this.getAudioFileInfo(fileName);
    return {
      ...fileInfo,
      songId: songInfo.id,
      title: songInfo.title,
      artist: songInfo.artist,
      language: songInfo.language,
      duration: songInfo.duration,
      quality: this.getAudioQuality(fileInfo.size),
      bitrate: this.estimateBitrate(fileInfo.size, songInfo.duration)
    };
  }

  // Estimate audio quality based on file size
  static getAudioQuality(sizeInBytes) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB < 3) return 'Low';
    if (sizeInMB < 5) return 'Medium';
    if (sizeInMB < 8) return 'High';
    return 'Very High';
  }

  // Estimate bitrate
  static estimateBitrate(sizeInBytes, duration) {
    if (!duration) return 'Unknown';
    
    // Convert duration from MM:SS to seconds
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    // Calculate bitrate in kbps
    const bitrate = Math.round((sizeInBytes * 8) / (totalSeconds * 1000));
    return `${bitrate} kbps`;
  }
}

module.exports = AudioUtils;
