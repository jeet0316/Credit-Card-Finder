import { useState } from 'react';
import type { UserProfile } from '../types/UserProfile';

interface ResultsProps {
  userProfile: UserProfile;
  onReset: () => void;
  onBack: () => void;
}

interface CardRecommendation {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  estimatedYearlyValue: number;
  whyThisCard: string[];
  mathBreakdown: {
    category: string;
    monthlySpend: number;
    rewardRate: number;
    yearlyRewards: number;
  }[];
  warnings?: string[];
}

// Dummy data for demonstration
const generateDummyResults = (profile: UserProfile): CardRecommendation[] => {
  const dummyCards: CardRecommendation[] = [
    {
      id: 'card-1',
      name: 'Chase Sapphire Preferred',
      issuer: 'Chase',
      annualFee: 95,
      estimatedYearlyValue: 450,
      whyThisCard: [
        `Perfect for ${profile.purpose} purposes`,
        '3x points on dining and travel',
        '60,000 bonus points after $4,000 spend',
        'No foreign transaction fees',
      ],
      mathBreakdown: [
        {
          category: 'Dining',
          monthlySpend: profile.monthlySpending.dining,
          rewardRate: 0.03,
          yearlyRewards: profile.monthlySpending.dining * 0.03 * 12,
        },
        {
          category: 'Travel',
          monthlySpend: profile.monthlySpending.travel,
          rewardRate: 0.03,
          yearlyRewards: profile.monthlySpending.travel * 0.03 * 12,
        },
        {
          category: 'Everything Else',
          monthlySpend: Object.values(profile.monthlySpending).reduce((a, b) => a + b, 0) - 
                       profile.monthlySpending.dining - profile.monthlySpending.travel,
          rewardRate: 0.01,
          yearlyRewards: (Object.values(profile.monthlySpending).reduce((a, b) => a + b, 0) - 
                         profile.monthlySpending.dining - profile.monthlySpending.travel) * 0.01 * 12,
        },
      ],
      warnings: !profile.paymentBehavior.paysInFull ? [
        '⚠️ You carry a balance. This card has a 21.49-28.49% APR. Consider a balance transfer card instead.',
      ] : undefined,
    },
    {
      id: 'card-2',
      name: 'Citi Double Cash',
      issuer: 'Citi',
      annualFee: 0,
      estimatedYearlyValue: 320,
      whyThisCard: [
        '2% cash back on everything',
        'No annual fee',
        'Simple, straightforward rewards',
        'Great for everyday spending',
      ],
      mathBreakdown: [
        {
          category: 'All Categories',
          monthlySpend: Object.values(profile.monthlySpending).reduce((a, b) => a + b, 0),
          rewardRate: 0.02,
          yearlyRewards: Object.values(profile.monthlySpending).reduce((a, b) => a + b, 0) * 0.02 * 12,
        },
      ],
    },
    {
      id: 'card-3',
      name: 'Capital One SavorOne',
      issuer: 'Capital One',
      annualFee: 0,
      estimatedYearlyValue: 280,
      whyThisCard: [
        '3% cash back on dining and groceries',
        'No annual fee',
        'Good for food-focused spending',
      ],
      mathBreakdown: [
        {
          category: 'Dining',
          monthlySpend: profile.monthlySpending.dining,
          rewardRate: 0.03,
          yearlyRewards: profile.monthlySpending.dining * 0.03 * 12,
        },
        {
          category: 'Groceries',
          monthlySpend: profile.monthlySpending.groceries,
          rewardRate: 0.03,
          yearlyRewards: profile.monthlySpending.groceries * 0.03 * 12,
        },
        {
          category: 'Everything Else',
          monthlySpend: Object.values(profile.monthlySpending).reduce((a, b) => a + b, 0) - 
                       profile.monthlySpending.dining - profile.monthlySpending.groceries,
          rewardRate: 0.01,
          yearlyRewards: (Object.values(profile.monthlySpending).reduce((a, b) => a + b, 0) - 
                         profile.monthlySpending.dining - profile.monthlySpending.groceries) * 0.01 * 12,
        },
      ],
    },
  ];

  return dummyCards
    .map((card) => {
      const totalRewards = card.mathBreakdown.reduce((sum, item) => sum + item.yearlyRewards, 0);
      const signUpBonus = 0; // Would be calculated from actual card data
      const netValue = totalRewards - card.annualFee + signUpBonus;
      return {
        ...card,
        estimatedYearlyValue: netValue,
      };
    })
    .sort((a, b) => b.estimatedYearlyValue - a.estimatedYearlyValue)
    .slice(0, 5);
};

export default function Results({ userProfile, onReset, onBack }: ResultsProps) {
  const [showMathFor, setShowMathFor] = useState<string | null>(null);

  const recommendations = generateDummyResults(userProfile);

  const toggleMath = (cardId: string) => {
    setShowMathFor(showMathFor === cardId ? null : cardId);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <div>
            <h1>Your Top Card Recommendations</h1>
            <p className="subtitle">Based on your spending and preferences</p>
          </div>
        </div>
        <button onClick={onReset} className="secondary-button">
          Start Over
        </button>
      </div>

      <div className="recommendations-list">
        {recommendations.map((card, index) => (
          <div key={card.id} className="card-recommendation">
            <div className="card-header">
              <div className="card-rank">#{index + 1}</div>
              <div className="card-info">
                <h2>{card.name}</h2>
                <p className="card-issuer">{card.issuer}</p>
                <div className="card-fee">
                  Annual Fee: {card.annualFee === 0 ? 'No annual fee' : `$${card.annualFee}/year`}
                </div>
              </div>
              <div className="card-value">
                <div className="value-label">Estimated Value</div>
                <div className="value-amount">${card.estimatedYearlyValue.toFixed(0)}/year</div>
              </div>
            </div>

            {card.warnings && (
              <div className="warnings">
                {card.warnings.map((warning, idx) => (
                  <div key={idx} className="warning-item">
                    {warning}
                  </div>
                ))}
              </div>
            )}

            <div className="why-this-card">
              <h3>Why this card?</h3>
              <ul>
                {card.whyThisCard.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => toggleMath(card.id)}
              className="math-toggle-button"
            >
              {showMathFor === card.id ? 'Hide' : 'Show'} the Math
            </button>

            {showMathFor === card.id && (
              <div className="math-breakdown">
                <h3>Yearly Value Calculation</h3>
                <table className="math-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Monthly Spend</th>
                      <th>Reward Rate</th>
                      <th>Yearly Rewards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {card.mathBreakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.category}</td>
                        <td>${item.monthlySpend.toFixed(2)}</td>
                        <td>{(item.rewardRate * 100).toFixed(0)}%</td>
                        <td>${item.yearlyRewards.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan={3}><strong>Total Rewards:</strong></td>
                      <td>
                        <strong>
                          ${card.mathBreakdown.reduce((sum, item) => sum + item.yearlyRewards, 0).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>Annual Fee:</td>
                      <td>-${card.annualFee.toFixed(2)}</td>
                    </tr>
                    <tr className="net-row">
                      <td colSpan={3}><strong>Net Yearly Value:</strong></td>
                      <td>
                        <strong>${card.estimatedYearlyValue.toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

