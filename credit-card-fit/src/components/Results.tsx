import { useState, useMemo } from 'react';
import type { UserProfile } from '../types/UserProfile';
import { getRecommendations } from '../utils/recommendationEngine';

interface ResultsProps {
  userProfile: UserProfile;
  onReset: () => void;
  onBack: () => void;
}

export default function Results({ userProfile, onReset, onBack }: ResultsProps) {
  const [showMathFor, setShowMathFor] = useState<string | null>(null);

  // Get recommendations using the recommendation engine
  const recommendations = useMemo(() => {
    return getRecommendations(userProfile);
  }, [userProfile]);

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
        {recommendations.length === 0 ? (
          <div className="no-results">
            <p>No cards match your criteria. Try adjusting your preferences.</p>
          </div>
        ) : (
          recommendations.map((rec, index) => {
            const card = rec.card;
            const totalRewardsFromBreakdown = rec.breakdown.reduce(
              (sum, item) => sum + item.yearlyRewards,
              0
            );

            return (
              <div key={card.id} className="card-recommendation">
                <div className="card-header">
                  <div className="card-rank">#{index + 1}</div>
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
                  <div className="card-value">
                    <div className="value-label">Estimated Value</div>
                    <div className="value-amount">
                      ${rec.netYearlyValue.toFixed(0)}/year
                    </div>
                  </div>
                </div>

                {rec.warnings && rec.warnings.length > 0 && (
                  <div className="warnings">
                    {rec.warnings.map((warning, idx) => (
                      <div key={idx} className="warning-item">
                        {warning}
                      </div>
                    ))}
                  </div>
                )}

                <div className="why-this-card">
                  <h3>Why this card?</h3>
                  <ul>
                    {rec.whyThisCard.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                {userProfile.purpose === 'travel' &&
                  card.features.travelBenefits &&
                  card.features.noForeignTransactionFee && (
                    <div className="purpose-note">
                      <p>
                        <strong>Travel-focused:</strong> This card is
                        travel-leaning because it has no foreign transaction fee
                        and includes travel protections.
                      </p>
                    </div>
                  )}

                <button
                  onClick={() => toggleMath(card.id)}
                  className="math-toggle-button"
                >
                  {showMathFor === card.id ? 'Hide' : 'Show'} the Math
                </button>

                {showMathFor === card.id && (
                  <div className="math-breakdown">
                    <h3>How We Calculated Your Yearly Value</h3>
                    <p className="calculation-intro">
                      Here's exactly how your spending translates to rewards with
                      this card:
                    </p>

                    <div className="detailed-breakdown">
                      {rec.breakdown.map((item, idx) => {
                        const yearlySpend = item.monthlySpend * 12;
                        return (
                          <div key={idx} className="breakdown-item">
                            <div className="breakdown-line">
                              <span className="spending-text">
                                You spend{' '}
                                <strong>${item.monthlySpend.toFixed(2)}/mo</strong>{' '}
                                on {item.category.toLowerCase()}
                              </span>
                              <span className="arrow">→</span>
                              <span className="rate-text">
                                <strong>
                                  {(item.rewardRate * 100).toFixed(0)}%
                                </strong>
                              </span>
                              <span className="arrow">→</span>
                              <span className="result-text">
                                <strong>
                                  ${item.yearlyRewards.toFixed(2)}/year
                                </strong>
                              </span>
                            </div>
                            {item.capApplied && (
                              <div className="cap-notice">
                                ⚠️ Cap applied:{' '}
                                {(item.rewardRate * 100).toFixed(0)}% only up to
                                ${item.capApplied.amount.toLocaleString()}/
                                {item.capApplied.period}. After that, rewards drop
                                to base rate.
                              </div>
                            )}
                            <div className="breakdown-math">
                              ${yearlySpend.toFixed(2)} yearly spend ×{' '}
                              {(item.rewardRate * 100).toFixed(0)}% = $
                              {item.yearlyRewards.toFixed(2)} yearly rewards
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="calculation-summary">
                      <div className="summary-section">
                        <h4>Total Rewards from Spending</h4>
                        <div className="summary-line">
                          <span>Sum of all category rewards:</span>
                          <strong>${totalRewardsFromBreakdown.toFixed(2)}</strong>
                        </div>
                      </div>

                      {rec.signUpBonusValue > 0 && (
                        <div className="summary-section">
                          <h4>Sign-Up Bonus</h4>
                          <div className="summary-line">
                            <span>
                              One-time bonus (Year 1 only):{' '}
                              {card.rewards.bonus && (
                                <>
                                  Earn ${card.rewards.bonus.amount} after spending
                                  ${card.rewards.bonus.spendRequired.toLocaleString()}{' '}
                                  in {card.rewards.bonus.monthsToComplete} months
                                </>
                              )}
                            </span>
                            <strong className="positive-value">
                              +${rec.signUpBonusValue.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      )}

                      {card.annualFee > 0 && (
                        <div className="summary-section">
                          <h4>Annual Fee</h4>
                          <div className="summary-line">
                            <span>Yearly fee subtracted:</span>
                            <strong className="negative-value">
                              -${card.annualFee.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      )}

                      <div className="summary-section net-value-section">
                        <h4>Net Yearly Value</h4>
                        <div className="summary-line net-value-line">
                          <span>Your estimated value per year:</span>
                          <strong className="net-value">
                            ${rec.netYearlyValue.toFixed(2)}/year
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="mcc-disclaimer">
                      <p>
                        <strong>Important:</strong> Reward categories depend on
                        merchant category codes (MCC) assigned by the credit card
                        processor, not the type of purchase. Edge cases can occur
                        where merchants are miscategorized. For example, a grocery
                        store cafe might code as "restaurant" instead of
                        "groceries," or a Walmart Supercenter might code as
                        "grocery" instead of "general merchandise." Always check
                        your statement to see how purchases are categorized.
                      </p>
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

