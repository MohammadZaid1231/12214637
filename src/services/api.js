import { v4 as uuidv4 } from 'uuid';
import { log } from './logger';

// Mock API base URL (replace with actual API endpoint)
const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

// Generate a random shortcode
const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if shortcode already exists
const isShortCodeUnique = (shortCode) => {
  const existingURLs = JSON.parse(sessionStorage.getItem('shortenedURLs') || '[]');
  return !existingURLs.some(url => url.shortCode === shortCode);
};

// Create a unique shortcode
const createUniqueShortCode = (customShortcode) => {
  if (customShortcode) {
    if (isShortCodeUnique(customShortcode)) {
      return customShortcode;
    } else {
      throw new Error('Custom shortcode already exists');
    }
  }
  
  let shortCode;
  do {
    shortCode = generateShortCode();
  } while (!isShortCodeUnique(shortCode));
  
  return shortCode;
};

// Create shortened URL
export const createShortURL = async (formData) => {
  try {
    log('backend', 'info', 'api', 'Creating short URL');
    
    // Client-side validation
    if (!formData.originalURL) {
      throw new Error('Original URL is required');
    }
    
    if (!formData.validityPeriod || formData.validityPeriod < 1) {
      throw new Error('Validity period must be at least 1 minute');
    }
    
    // Generate unique shortcode
    const shortCode = createUniqueShortCode(formData.customShortcode);
    const id = uuidv4();
    
    // Mock API call - replace with actual API call
    const mockResponse = {
      success: true,
      data: {
        id: id,
        shortURL: `https://short.ly/${shortCode}`,
        shortCode: shortCode,
        originalURL: formData.originalURL,
        validityPeriod: formData.validityPeriod,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + formData.validityPeriod * 60000).toISOString()
      }
    };
    
    log('backend', 'info', 'api', 'Short URL created successfully');
    return mockResponse;
    
    // Actual API call (uncomment when backend is ready)
    /*
    const response = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalURL: formData.originalURL,
        validityPeriod: formData.validityPeriod,
        customShortcode: formData.customShortcode
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create short URL');
    }
    
    return {
      success: true,
      data: data
    };
    */
    
  } catch (error) {
    log('backend', 'error', 'api', `Error creating short URL: ${error.message}`);
    return {
      success: false,
      message: error.message
    };
  }
};

// Get URL statistics
export const getStatistics = async () => {
  try {
    log('backend', 'info', 'api', 'Fetching statistics');
    
    // Mock response - replace with actual API call
    const savedURLs = JSON.parse(sessionStorage.getItem('shortenedURLs') || '[]');
    
    const mockResponse = {
      success: true,
      data: {
        totalURLs: savedURLs.length,
        totalClicks: savedURLs.reduce((sum, url) => sum + url.clickCount, 0),
        urls: savedURLs
      }
    };
    
    log('backend', 'info', 'api', 'Statistics fetched successfully');
    return mockResponse;
    
    // Actual API call (uncomment when backend is ready)
    /*
    const response = await fetch(`${API_BASE_URL}/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch statistics');
    }
    
    return {
      success: true,
      data: data
    };
    */
    
  } catch (error) {
    log('backend', 'error', 'api', `Error fetching statistics: ${error.message}`);
    return {
      success: false,
      message: error.message
    };
  }
};

// Redirect to original URL
export const redirectToOriginal = async (shortCode) => {
  try {
    log('backend', 'info', 'api', `Redirecting shortcode: ${shortCode}`);
    
    // Mock implementation - replace with actual API call
    const savedURLs = JSON.parse(sessionStorage.getItem('shortenedURLs') || '[]');
    const url = savedURLs.find(u => u.shortCode === shortCode);
    
    if (!url) {
      throw new Error('Short URL not found');
    }
    
    if (new Date(url.expiresAt) <= new Date()) {
      throw new Error('Short URL has expired');
    }
    
    // Update click count
    const updatedURLs = savedURLs.map(u => 
      u.shortCode === shortCode 
        ? { ...u, clickCount: u.clickCount + 1 }
        : u
    );
    sessionStorage.setItem('shortenedURLs', JSON.stringify(updatedURLs));
    
    log('backend', 'info', 'api', `Redirecting to: ${url.originalURL}`);
    return {
      success: true,
      data: {
        originalURL: url.originalURL
      }
    };
    
    // Actual API call (uncomment when backend is ready)
    /*
    const response = await fetch(`${API_BASE_URL}/redirect/${shortCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to redirect');
    }
    
    return {
      success: true,
      data: data
    };
    */
    
  } catch (error) {
    log('backend', 'error', 'api', `Error redirecting: ${error.message}`);
    return {
      success: false,
      message: error.message
    };
  }
};