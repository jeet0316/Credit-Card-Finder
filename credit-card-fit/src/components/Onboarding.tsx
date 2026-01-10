import { useState, useEffect } from 'react';
import type { Eligibility, PaymentBehavior } from '../types/UserProfile';

interface OnboardingProps {
  onComplete: (eligibility: Eligibility, paymentBehavior: PaymentBehavior, creditScore?: number) => void;
  initialEligibility?: Eligibility | null;
  initialPaymentBehavior?: PaymentBehavior | null;
  initialCreditScore?: number;
}

export default function Onboarding({
  onComplete,
  initialEligibility,
  initialPaymentBehavior,
  initialCreditScore,
}: OnboardingProps) {
  const [hasExistingCard, setHasExistingCard] = useState<boolean | null>(
    initialEligibility?.hasExistingCard ?? null
  );
  const [isStudent, setIsStudent] = useState<boolean | null>(
    initialEligibility?.isStudent ?? null
  );
  const [under21, setUnder21] = useState<boolean | null>(
    initialEligibility?.under21 ?? null
  );
  const [paysInFull, setPaysInFull] = useState<boolean | null>(
    initialPaymentBehavior?.paysInFull ?? null
  );
  const [creditScore, setCreditScore] = useState<string>(
    initialCreditScore ? initialCreditScore.toString() : ''
  );
  const [showCreditScore, setShowCreditScore] = useState<boolean>(
    !!initialCreditScore
  );

  // Update state when initial values change (when going back)
  useEffect(() => {
    if (initialEligibility) {
      setHasExistingCard(initialEligibility.hasExistingCard);
      setIsStudent(initialEligibility.isStudent);
      setUnder21(initialEligibility.under21);
    }
    if (initialPaymentBehavior) {
      setPaysInFull(initialPaymentBehavior.paysInFull);
    }
    if (initialCreditScore) {
      setCreditScore(initialCreditScore.toString());
      setShowCreditScore(true);
    }
  }, [initialEligibility, initialPaymentBehavior, initialCreditScore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasExistingCard === null || isStudent === null || under21 === null || paysInFull === null) {
      alert('Please answer all required questions');
      return;
    }

    const eligibility: Eligibility = {
      hasExistingCard,
      existingCardIds: [],
      isStudent,
      under21,
    };

    const paymentBehavior: PaymentBehavior = {
      paysInFull,
      prefersNoAnnualFee: !hasExistingCard, // First-time cardholders often prefer no fee
      needsTravelBenefits: false, // Will be determined by purpose later
    };

    const score = creditScore ? parseInt(creditScore) : undefined;
    onComplete(eligibility, paymentBehavior, score);
  };

  const canProceed = hasExistingCard !== null && isStudent !== null && under21 !== null && paysInFull !== null;

  return (
    <div className="onboarding-container">
      <h1>Let's Find Your Perfect Credit Card</h1>
      <p className="subtitle">Answer a few quick questions to get personalized recommendations</p>

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="question-group">
          <label className="question-label">
            Do you already have a credit card?
          </label>
          <div className="radio-group">
            <label
              className={`radio-option ${hasExistingCard === true ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="hasCard"
                value="yes"
                checked={hasExistingCard === true}
                onChange={() => setHasExistingCard(true)}
              />
              <span>Yes</span>
            </label>
            <label
              className={`radio-option ${hasExistingCard === false ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="hasCard"
                value="no"
                checked={hasExistingCard === false}
                onChange={() => setHasExistingCard(false)}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="question-group">
          <label className="question-label">
            Are you currently a student?
          </label>
          <div className="radio-group">
            <label
              className={`radio-option ${isStudent === true ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="student"
                value="yes"
                checked={isStudent === true}
                onChange={() => setIsStudent(true)}
              />
              <span>Yes</span>
            </label>
            <label
              className={`radio-option ${isStudent === false ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="student"
                value="no"
                checked={isStudent === false}
                onChange={() => setIsStudent(false)}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="question-group">
          <label className="question-label">
            Are you under 18 years old?
            <span className="help-text">(Reg Z: May require independent income or cosigner)</span>
          </label>
          <div className="radio-group">
            <label
              className={`radio-option ${under21 === true ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="under21"
                value="yes"
                checked={under21 === true}
                onChange={() => setUnder21(true)}
              />
              <span>Yes</span>
            </label>
            <label
              className={`radio-option ${under21 === false ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="under21"
                value="no"
                checked={under21 === false}
                onChange={() => setUnder21(false)}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="question-group">
          <label className="question-label">
            Do you pay your credit card balance in full each month?
            <span className="help-text">(If No, APR matters more than rewards)</span>
          </label>
          <div className="radio-group">
            <label
              className={`radio-option ${paysInFull === true ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="paysFull"
                value="yes"
                checked={paysInFull === true}
                onChange={() => setPaysInFull(true)}
              />
              <span>Yes</span>
            </label>
            <label
              className={`radio-option ${paysInFull === false ? 'checked' : ''}`}
            >
              <input
                type="radio"
                name="paysFull"
                value="no"
                checked={paysInFull === false}
                onChange={() => setPaysInFull(false)}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="question-group">
          <label className="question-label">
            What's your approximate credit score? (Optional)
          </label>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={showCreditScore}
                onChange={(e) => setShowCreditScore(e.target.checked)}
              />
              <span>I know my credit score</span>
            </label>
          </div>
          {showCreditScore && (
            <div className="credit-score-input">
              <select
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                className="select-input"
              >
                <option value="">Select range...</option>
                <option value="800">800+ (Excellent)</option>
                <option value="740">740-799 (Very Good)</option>
                <option value="670">670-739 (Good)</option>
                <option value="580">580-669 (Fair)</option>
                <option value="300">300-579 (Poor)</option>
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={!canProceed}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

