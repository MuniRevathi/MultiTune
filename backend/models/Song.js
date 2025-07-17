// models/Song.js
class Song {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.artist = data.artist;
    this.movie = data.movie;
    this.genre = data.genre;
    this.duration = data.duration;
    this.releaseYear = data.releaseYear;
    this.defaultLanguage = data.defaultLanguage;
    this.poster = data.poster;
    this.versions = data.versions || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get version by language
  getVersionByLanguage(language) {
    return this.versions.find(
      version => version.language.toLowerCase() === language.toLowerCase()
    );
  }

  // Get all available languages for this song
  getAvailableLanguages() {
    return this.versions.map(version => version.language);
  }

  // Check if song has a specific language version
  hasLanguage(language) {
    return this.versions.some(
      version => version.language.toLowerCase() === language.toLowerCase()
    );
  }

  // Add a new language version
  addVersion(versionData) {
    // Check if language version already exists
    const exists = this.hasLanguage(versionData.language);
    if (exists) {
      throw new Error(`Version for language ${versionData.language} already exists`);
    }
    
    this.versions.push(versionData);
    this.updatedAt = new Date();
    return this;
  }

  // Update existing version
  updateVersion(language, updateData) {
    const versionIndex = this.versions.findIndex(
      version => version.language.toLowerCase() === language.toLowerCase()
    );
    
    if (versionIndex === -1) {
      throw new Error(`Version for language ${language} not found`);
    }
    
    this.versions[versionIndex] = { ...this.versions[versionIndex], ...updateData };
    this.updatedAt = new Date();
    return this;
  }

  // Remove a language version
  removeVersion(language) {
    const versionIndex = this.versions.findIndex(
      version => version.language.toLowerCase() === language.toLowerCase()
    );
    
    if (versionIndex === -1) {
      throw new Error(`Version for language ${language} not found`);
    }
    
    this.versions.splice(versionIndex, 1);
    this.updatedAt = new Date();
    return this;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      movie: this.movie,
      genre: this.genre,
      duration: this.duration,
      releaseYear: this.releaseYear,
      defaultLanguage: this.defaultLanguage,
      poster: this.poster,
      versions: this.versions,
      availableLanguages: this.getAvailableLanguages(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Song;
