import { useState } from 'react';

interface HomeProps {
  onGetStarted: () => void;
  onHowItWorks: () => void;
  onSearch: (query: string) => void;
}

export default function Home({ onGetStarted, onHowItWorks, onSearch }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-main">
          <h1 className="home-headline">
            Find Your Perfect
            <br />
            Credit Card
          </h1>

          <p className="home-subtext">
            Compare rewards, fees, and benefits from top issuers. Make smarter financial decisions with our expert recommendations.
          </p>

          <div className="home-search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by card name, issuer, or rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>

          <div className="home-cta-buttons">
            <button onClick={onGetStarted} className="cta-primary">
              Get Started
            </button>
            <button onClick={onHowItWorks} className="cta-secondary">
              How It Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

