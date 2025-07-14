import React from 'react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-title">URL Shortener</h1>
        <div className="nav-menu">
          <button
            className={`nav-button ${currentPage === 'shortener' ? 'active' : ''}`}
            onClick={() => setCurrentPage('shortener')}
          >
            URL Shortener
          </button>
          <button
            className={`nav-button ${currentPage === 'statistics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('statistics')}
          >
            Statistics
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;