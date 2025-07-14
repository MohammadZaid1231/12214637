import React, { useState, useEffect } from 'react';
import { log } from '../services/logger';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState({
    totalURLs: 0,
    totalClicks: 0,
    activeURLs: 0,
    expiredURLs: 0,
    averageClicksPerURL: 0,
    mostClickedURL: null
  });
  const [urlList, setUrlList] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    log('frontend', 'info', 'handler', 'Loading statistics data');
    
    const savedURLs = JSON.parse(sessionStorage.getItem('shortenedURLs') || '[]');
    const now = new Date();
    
    const activeURLs = savedURLs.filter(url => new Date(url.expiresAt) > now);
    const expiredURLs = savedURLs.filter(url => new Date(url.expiresAt) <= now);
    const totalClicks = savedURLs.reduce((sum, url) => sum + url.clickCount, 0);
    
    let mostClickedURL = null;
    if (savedURLs.length > 0) {
      mostClickedURL = savedURLs.reduce((max, url) => 
        url.clickCount > (max?.clickCount || 0) ? url : max
      );
    }
    
    setStatistics({
      totalURLs: savedURLs.length,
      totalClicks,
      activeURLs: activeURLs.length,
      expiredURLs: expiredURLs.length,
      averageClicksPerURL: savedURLs.length > 0 ? (totalClicks / savedURLs.length).toFixed(2) : 0,
      mostClickedURL
    });
    
    setUrlList(savedURLs);
    
    log('frontend', 'info', 'handler', 'Statistics loaded successfully');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) <= new Date();
  };

  return (
    <div className="statistics-page">
      <h1>URL Statistics</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total URLs</h3>
          <div className="stat-value">{statistics.totalURLs}</div>
          <div className="stat-description">Total URLs shortened</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Clicks</h3>
          <div className="stat-value">{statistics.totalClicks}</div>
          <div className="stat-description">Total clicks across all URLs</div>
        </div>
        
        <div className="stat-card">
          <h3>Active URLs</h3>
          <div className="stat-value">{statistics.activeURLs}</div>
          <div className="stat-description">Currently active URLs</div>
        </div>
        
        <div className="stat-card">
          <h3>Expired URLs</h3>
          <div className="stat-value">{statistics.expiredURLs}</div>
          <div className="stat-description">URLs that have expired</div>
        </div>
        
        <div className="stat-card">
          <h3>Average Clicks</h3>
          <div className="stat-value">{statistics.averageClicksPerURL}</div>
          <div className="stat-description">Average clicks per URL</div>
        </div>
        
        <div className="stat-card">
          <h3>Most Clicked URL</h3>
          <div className="stat-value">
            {statistics.mostClickedURL ? statistics.mostClickedURL.clickCount : 'N/A'}
          </div>
          <div className="stat-description">
            {statistics.mostClickedURL ? `${statistics.mostClickedURL.shortCode}` : 'No URLs yet'}
          </div>
        </div>
      </div>
      
      {urlList.length > 0 && (
        <div className="results-section" style={{ marginTop: '2rem' }}>
          <h2>All URLs</h2>
          {urlList.map((url) => (
            <div key={url.id} className="url-result">
              <h3>
                {url.shortURL} 
                {isExpired(url.expiresAt) && <span style={{ color: '#f44336', fontSize: '0.8rem' }}> (EXPIRED)</span>}
              </h3>
              <p><strong>Original:</strong> <a href={url.originalURL} target="_blank" rel="noopener noreferrer">{url.originalURL}</a></p>
              <p><strong>Short Code:</strong> {url.shortCode}</p>
              <p><strong>Created:</strong> {formatDate(url.createdAt)}</p>
              <p><strong>Expires:</strong> {formatDate(url.expiresAt)}</p>
              <p><strong>Clicks:</strong> {url.clickCount}</p>
              <p><strong>Validity Period:</strong> {url.validityPeriod} minutes</p>
              <p><strong>Status:</strong> {isExpired(url.expiresAt) ? 'Expired' : 'Active'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;