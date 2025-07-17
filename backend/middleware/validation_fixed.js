// middleware/validation.js
const config = require('../config/config');

// Validate song ID
const validateSongId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid song ID',
      message: 'Song ID must be a valid number'
    });
  }
  
  next();
};

// Validate language
const validateLanguage = (req, res, next) => {
  const { lang } = req.params;
  
  if (!lang || lang.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Invalid language',
      message: 'Language parameter is required'
    });
  }
  
  // Check if language is supported
  const supportedLanguages = config.supportedLanguages.map(l => l.toLowerCase());
  if (!supportedLanguages.includes(lang.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported language',
      message: `Language '${lang}' is not supported. Supported languages: ${config.supportedLanguages.join(', ')}`
    });
  }
  
  next();
};

// Validate search query
const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;
  
  if (!q || q.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Invalid search query',
      message: 'Search query parameter (q) is required'
    });
  }
  
  if (q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Search query too short',
      message: 'Search query must be at least 2 characters long'
    });
  }
  
  next();
};

// Validate search parameters for free music APIs
const validateSearch = (req, res, next) => {
  const { q, service, limit, offset } = req.query;
  
  // Validate query
  if (!q || q.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Invalid search query',
      message: 'Search query parameter (q) is required'
    });
  }
  
  if (q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Search query too short',
      message: 'Search query must be at least 2 characters long'
    });
  }
  
  // Validate service
  if (service) {
    const validServices = ['jamendo', 'internetarchive', 'freesound', 'spotify'];
    if (!validServices.includes(service)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid service',
        message: `Service must be one of: ${validServices.join(', ')}`
      });
    }
  }
  
  // Validate limit
  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit',
        message: 'Limit must be a number between 1 and 100'
      });
    }
  }
  
  // Validate offset
  if (offset) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid offset',
        message: 'Offset must be a non-negative number'
      });
    }
  }
  
  next();
};

// Rate limiting middleware (simple implementation)
const createRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();
    
    if (!requests.has(clientId)) {
      requests.set(clientId, { count: 1, resetTime: currentTime + windowMs });
      return next();
    }
    
    const clientData = requests.get(clientId);
    
    if (currentTime > clientData.resetTime) {
      requests.set(clientId, { count: 1, resetTime: currentTime + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    clientData.count++;
    requests.set(clientId, clientData);
    next();
  };
};

module.exports = {
  validateSongId,
  validateLanguage,
  validateSearchQuery,
  validateSearch,
  createRateLimiter
};
