import { useState } from 'react';
import Onboarding from './components/Onboarding';
import PurposePicker from './components/PurposePicker';
import SpendingInputs from './components/SpendingInputs';
import Results from './components/Results';
import type { UserProfile, Eligibility, PaymentBehavior, MonthlySpending, UserPurpose } from './types/UserProfile';
import './App.css';

type FlowStep = 'onboarding' | 'purpose' | 'spending' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('onboarding');
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [paymentBehavior, setPaymentBehavior] = useState<PaymentBehavior | null>(null);
  const [creditScore, setCreditScore] = useState<number | undefined>(undefined);
  const [purpose, setPurpose] = useState<UserPurpose | null>(null);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending | null>(null);

  const handleOnboardingComplete = (
    newEligibility: Eligibility,
    newPaymentBehavior: PaymentBehavior,
    newCreditScore?: number
  ) => {
    setEligibility(newEligibility);
    setPaymentBehavior(newPaymentBehavior);
    setCreditScore(newCreditScore);
    setCurrentStep('purpose');
  };

  const handlePurposeSelect = (selectedPurpose: UserPurpose) => {
    setPurpose(selectedPurpose);
    setCurrentStep('spending');
  };

  const handleSpendingComplete = (spending: MonthlySpending) => {
    setMonthlySpending(spending);
    setCurrentStep('results');
  };

  const handleBack = () => {
    if (currentStep === 'purpose') {
      setCurrentStep('onboarding');
    } else if (currentStep === 'spending') {
      setCurrentStep('purpose');
    } else if (currentStep === 'results') {
      setCurrentStep('spending');
    }
  };

  const handleReset = () => {
    setCurrentStep('onboarding');
    setEligibility(null);
    setPaymentBehavior(null);
    setCreditScore(undefined);
    setPurpose(null);
    setMonthlySpending(null);
  };

  // Build user profile when we have all data
  const userProfile: UserProfile | null =
    eligibility && paymentBehavior && purpose && monthlySpending
      ? {
          purpose,
          monthlySpending,
          eligibility,
          paymentBehavior: {
            ...paymentBehavior,
            needsTravelBenefits: purpose === 'travel',
          },
          filters: creditScore ? { minCreditScore: creditScore } : undefined,
        }
      : null;

  return (
    <div className="app-container">
      <div className="app-content">
        {currentStep === 'onboarding' && (
          <Onboarding
            onComplete={handleOnboardingComplete}
            initialEligibility={eligibility}
            initialPaymentBehavior={paymentBehavior}
            initialCreditScore={creditScore}
          />
        )}

        {currentStep === 'purpose' && (
          <PurposePicker
            onSelect={handlePurposeSelect}
            onBack={handleBack}
            initialPurpose={purpose}
          />
        )}

        {currentStep === 'spending' && (
          <SpendingInputs
            onComplete={handleSpendingComplete}
            onBack={handleBack}
            initialSpending={monthlySpending}
            purpose={purpose || undefined}
          />
        )}

        {currentStep === 'results' && userProfile && (
          <Results
            userProfile={userProfile}
            onReset={handleReset}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default App;
