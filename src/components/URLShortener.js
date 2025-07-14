import React, { useState, useEffect } from 'react';

import { createShortURL } from '../services/api';
import { log } from '../services/logger';
import { validateURL } from '../services/utlis/validation';

const URLShortener = () => {
  const [formData, setFormData] = useState({
    originalURL: '',
    validityPeriod: '30',
    customShortcode: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedURLs, setShortenedURLs] = useState([]);

  // Load existing URLs from memory on component mount
  useEffect(() => {
    const savedURLs = JSON.parse(sessionStorage.getItem('shortenedURLs') || '[]');
    setShortenedURLs(savedURLs);
  }, []);

  // Save URLs to session storage whenever shortenedURLs changes
  useEffect(() => {
    sessionStorage.setItem('shortenedURLs', JSON.stringify(shortenedURLs));
  }, [shortenedURLs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.originalURL) {
      newErrors.originalURL = 'Original URL is required';
    } else if (!validateURL(formData.originalURL)) {
      newErrors.originalURL = 'Please enter a valid URL';
    }
    
    if (!formData.validityPeriod || formData.validityPeriod < 1) {
      newErrors.validityPeriod = 'Validity period must be at least 1 minute';
    }
    
    if (formData.customShortcode && formData.customShortcode.length < 3) {
      newErrors.customShortcode = 'Custom shortcode must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      log('frontend', 'error', 'handler', 'Form validation failed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      log('frontend', 'info', 'handler', 'Attempting to create short URL');
      
      const response = await createShortURL(formData);
      
      if (response.success) {
        const newURL = {
          id: response.data.id,
          originalURL: formData.originalURL,
          shortURL: response.data.shortURL,
          shortCode: response.data.shortCode,
          validityPeriod: formData.validityPeriod,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + formData.validityPeriod * 60000).toISOString(),
          clickCount: 0
        };
        
        setShortenedURLs(prev => [newURL, ...prev]);
        
        // Reset form
        setFormData({
          originalURL: '',
          validityPeriod: '30',
          customShortcode: ''
        });
        
        log('frontend', 'info', 'handler', 'URL shortened successfully');
      } else {
        log('frontend', 'error', 'handler', `Failed to create short URL: ${response.message}`);
        setErrors({ submit: response.message });
      }
    } catch (error) {
      log('frontend', 'error', 'handler', `Error creating short URL: ${error.message}`);
      setErrors({ submit: 'Failed to create short URL. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = (shortCode) => {
    log('frontend', 'info', 'handler', `Redirecting to original URL for shortcode: ${shortCode}`);
    
    // Update click count
    setShortenedURLs(prev => 
      prev.map(url => 
        url.shortCode === shortCode 
          ? { ...url, clickCount: url.clickCount + 1 }
          : url
      )
    );
    
    // Find the original URL and redirect
    const urlData = shortenedURLs.find(url => url.shortCode === shortCode);
    if (urlData) {
      window.open(urlData.originalURL, '_blank');
    }
  };

  return (
    <div className="url-shortener">
      <h1>URL Shortener</h1>
      
      <form onSubmit={handleSubmit} className="url-form">
        <div className="form-group">
          <label htmlFor="originalURL">Original URL *</label>
          <input
            type="url"
            id="originalURL"
            name="originalURL"
            value={formData.originalURL}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className={errors.originalURL ? 'error' : ''}
          />
          {errors.originalURL && <span className="error-message">{errors.originalURL}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="validityPeriod">Validity Period (minutes)</label>
          <input
            type="number"
            id="validityPeriod"
            name="validityPeriod"
            value={formData.validityPeriod}
            onChange={handleInputChange}
            min="1"
            placeholder="30"
            className={errors.validityPeriod ? 'error' : ''}
          />
          {errors.validityPeriod && <span className="error-message">{errors.validityPeriod}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="customShortcode">Custom Shortcode (Optional)</label>
          <input
            type="text"
            id="customShortcode"
            name="customShortcode"
            value={formData.customShortcode}
            onChange={handleInputChange}
            placeholder="my-custom-code"
            className={errors.customShortcode ? 'error' : ''}
          />
          {errors.customShortcode && <span className="error-message">{errors.customShortcode}</span>}
        </div>
        
        {errors.submit && <span className="error-message">{errors.submit}</span>}
        
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>
      
      {shortenedURLs.length > 0 && (
        <div className="results-section">
          <h2>Shortened URLs</h2>
          {shortenedURLs.map((url) => (
            <div key={url.id} className="url-result">
              <h3>Short URL: {url.shortURL}</h3>
              <p><strong>Original:</strong> <a href={url.originalURL} target="_blank" rel="noopener noreferrer">{url.originalURL}</a></p>
              <p><strong>Short Code:</strong> {url.shortCode}</p>
              <p><strong>Created:</strong> {new Date(url.createdAt).toLocaleString()}</p>
              <p><strong>Expires:</strong> {new Date(url.expiresAt).toLocaleString()}</p>
              <p><strong>Clicks:</strong> {url.clickCount}</p>
              <button 
                onClick={() => handleRedirect(url.shortCode)}
                className="submit-button"
                style={{ marginTop: '10px' }}
              >
                Visit Original URL
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default URLShortener;