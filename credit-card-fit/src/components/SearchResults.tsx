import { useState } from 'react';
import cardsData from '../data/cards.json';

interface SimplifiedCard {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  rewards: {
    gas?: number;
    groceries?: number;
    dining?: number;
    travel?: number;
    other?: number;
    bonus?: {
      amount: number;
      spendRequired: number;
      monthsToComplete: number;
    };
  };
  eligibility: {
    student: boolean;
    minAge: number;
    creditScoreMin?: number;
  };
  features: {
    noForeignTransactionFee?: boolean;
    travelBenefits?: boolean;
    apr?: number | null;
  };
  description?: string;
}

interface SearchResultsProps {
  searchQuery: string;
  onBack: () => void;
}

export default function SearchResults({ searchQuery, onBack }: SearchResultsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Filter cards based on search query
  const filteredCards = (cardsData as unknown as SimplifiedCard[]).filter((card) => {
    const query = searchQuery.toLowerCase();
    return (
      card.name.toLowerCase().includes(query) ||
      card.issuer.toLowerCase().includes(query) ||
      card.description?.toLowerCase().includes(query) ||
      card.id.toLowerCase().includes(query)
    );
  });

  const toggleExpanded = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-header-left">
          <button onClick={onBack} className="back-button">
            ← Back to Home
          </button>
          <div>
            <h1>Search Results</h1>
            <p className="subtitle">
              {filteredCards.length > 0
                ? `Found ${filteredCards.length} card${filteredCards.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                : `No cards found matching "${searchQuery}"`}
            </p>
          </div>
        </div>
      </div>

      <div className="recommendations-list">
        {filteredCards.length === 0 ? (
          <div className="no-results" style={{ background: '#f7fafc', border: '1px solid #e2e8f0', color: '#4a5568' }}>
            <p style={{ color: '#4a5568', textShadow: 'none' }}>Try searching by card name (e.g., "Discover"), issuer (e.g., "Chase"), or features.</p>
          </div>
        ) : (
          filteredCards.map((card) => {
            return (
              <div key={card.id} className="card-recommendation">
                <div className="card-header">
                  <div className="card-info">
                    <h2>{card.name}</h2>
                    <p className="card-issuer">{card.issuer}</p>
                    <div className="card-fee">
                      Annual Fee:{' '}
                      {card.annualFee === 0
                        ? 'No annual fee'
                        : `$${card.annualFee}/year`}
                    </div>
                    {card.description && (
                      <p className="card-description">{card.description}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleExpanded(card.id)}
                  className="math-toggle-button"
                >
                  {expandedCard === card.id ? 'Hide' : 'Show'} Details
                </button>

                {expandedCard === card.id && (
                  <div className="math-breakdown">
                    <h3>Card Details</h3>

                    <div className="card-details-section">
                      <h4>Rewards Structure</h4>
                      <div className="rewards-grid">
                        {card.rewards.gas && card.rewards.gas > 0 && (
                          <div className="reward-item">
                            <strong>Gas:</strong> {(card.rewards.gas * 100).toFixed(0)}%
                          </div>
                        )}
                        {card.rewards.groceries && card.rewards.groceries > 0 && (
                          <div className="reward-item">
                            <strong>Groceries:</strong> {(card.rewards.groceries * 100).toFixed(0)}%
                          </div>
                        )}
                        {card.rewards.dining && card.rewards.dining > 0 && (
                          <div className="reward-item">
                            <strong>Dining:</strong> {(card.rewards.dining * 100).toFixed(0)}%
                          </div>
                        )}
                        {card.rewards.travel && card.rewards.travel > 0 && (
                          <div className="reward-item">
                            <strong>Travel:</strong> {(card.rewards.travel * 100).toFixed(0)}%
                          </div>
                        )}
                        {card.rewards.other && card.rewards.other > 0 && (
                          <div className="reward-item">
                            <strong>All Other Purchases:</strong> {(card.rewards.other * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {card.rewards.bonus && card.rewards.bonus.amount > 0 && (
                      <div className="card-details-section">
                        <h4>Sign-Up Bonus</h4>
                        <p>
                          Earn ${card.rewards.bonus.amount} after spending $
                          {card.rewards.bonus.spendRequired.toLocaleString()} in{' '}
                          {card.rewards.bonus.monthsToComplete} months
                        </p>
                      </div>
                    )}

                    <div className="card-details-section">
                      <h4>Eligibility Requirements</h4>
                      <ul className="details-list">
                        <li>Minimum Age: {card.eligibility.minAge} years</li>
                        {card.eligibility.creditScoreMin && (
                          <li>Minimum Credit Score: {card.eligibility.creditScoreMin}</li>
                        )}
                        {card.eligibility.student && (
                          <li>Student Card: Yes</li>
                        )}
                      </ul>
                    </div>

                    <div className="card-details-section">
                      <h4>Features</h4>
                      <ul className="details-list">
                        {card.features.noForeignTransactionFee && (
                          <li style={{ color: '#22543d' }}>✓ No foreign transaction fee</li>
                        )}
                        {card.features.travelBenefits && (
                          <li style={{ color: '#22543d' }}>✓ Travel benefits and protections</li>
                        )}
                        {card.features.apr && (
                          <li>APR: {card.features.apr}%</li>
                        )}
                        {card.annualFee === 0 && (
                          <li style={{ color: '#22543d' }}>✓ No annual fee</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

