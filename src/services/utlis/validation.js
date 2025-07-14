// Validation utilities

// Validate URL format
export const validateURL = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
      return false;
    }
  };
  
  // Validate email format
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate shortcode format
  export const validateShortCode = (shortCode) => {
    // Allow alphanumeric characters and hyphens, 3-50 characters
    const shortCodeRegex = /^[a-zA-Z0-9-_]{3,50}$/;
    return shortCodeRegex.test(shortCode);
  };
  
  // Validate validity period
  export const validateValidityPeriod = (period) => {
    const num = parseInt(period, 10);
    return !isNaN(num) && num >= 1 && num <= 525600; // Max 1 year in minutes
  };
  
  // Sanitize input to prevent XSS
  export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  
  // Validate form data
  export const validateFormData = (formData) => {
    const errors = {};
    
    // Validate original URL
    if (!formData.originalURL) {
      errors.originalURL = 'Original URL is required';
    } else if (!validateURL(formData.originalURL)) {
      errors.originalURL = 'Please enter a valid URL';
    }
    
    // Validate validity period
    if (!formData.validityPeriod) {
      errors.validityPeriod = 'Validity period is required';
    } else if (!validateValidityPeriod(formData.validityPeriod)) {
      errors.validityPeriod = 'Validity period must be between 1 and 525600 minutes';
    }
    
    // Validate custom shortcode if provided
    if (formData.customShortcode && !validateShortCode(formData.customShortcode)) {
      errors.customShortcode = 'Custom shortcode must be 3-50 characters long and contain only letters, numbers, hyphens, and underscores';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Check if URL is accessible (basic check)
  export const isURLAccessible = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Validate and normalize URL
  export const normalizeURL = (url) => {
    try {
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      const urlObj = new URL(url);
      return urlObj.href;
    } catch (error) {
      return null;
    }
  };
  
  // Check if shortcode is reserved
  export const isReservedShortCode = (shortCode) => {
    const reservedCodes = [
      'api', 'admin', 'www', 'mail', 'ftp', 'localhost', 'test', 'dev',
      'staging', 'production', 'app', 'web', 'mobile', 'help', 'support',
      'about', 'contact', 'privacy', 'terms', 'login', 'register', 'dashboard'
    ];
    
    return reservedCodes.includes(shortCode.toLowerCase());
  };
  
  // Validate input length
  export const validateLength = (input, min, max) => {
    if (typeof input !== 'string') return false;
    return input.length >= min && input.length <= max;
  };
  
  // Remove dangerous characters from input
  export const sanitizeShortCode = (shortCode) => {
    return shortCode.replace(/[^a-zA-Z0-9-_]/g, '');
  };