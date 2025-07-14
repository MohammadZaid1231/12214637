import React, { useState } from 'react';
import URLShortener from './components/URLShortener';
import StatisticsPage from './components/StatisticsPage';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('shortener');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'shortener':
        return <URLShortener />;
      case 'statistics':
        return <StatisticsPage />;
      default:
        return <URLShortener />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
