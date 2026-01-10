import { useState } from 'react';
import Home from './components/Home';
import Onboarding from './components/Onboarding';
import PurposePicker from './components/PurposePicker';
import SpendingInputs from './components/SpendingInputs';
import Results from './components/Results';
import SearchResults from './components/SearchResults';
import type { UserProfile, Eligibility, PaymentBehavior, MonthlySpending, UserPurpose } from './types/UserProfile';
import './App.css';

type FlowStep = 'home' | 'onboarding' | 'purpose' | 'spending' | 'results' | 'how-it-works' | 'search-results';

function App() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('home');
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [paymentBehavior, setPaymentBehavior] = useState<PaymentBehavior | null>(null);
  const [creditScore, setCreditScore] = useState<number | undefined>(undefined);
  const [purpose, setPurpose] = useState<UserPurpose | null>(null);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animatingToStep, setAnimatingToStep] = useState<FlowStep | null>(null);

  const handleOnboardingComplete = (
    newEligibility: Eligibility,
    newPaymentBehavior: PaymentBehavior,
    newCreditScore?: number
  ) => {
    setEligibility(newEligibility);
    setPaymentBehavior(newPaymentBehavior);
    setCreditScore(newCreditScore);
    setIsAnimating(true);
    setAnimatingToStep('purpose');
    setTimeout(() => {
      setCurrentStep('purpose');
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingToStep(null);
      }, 650);
    }, 300);
  };

  const handlePurposeSelect = (selectedPurpose: UserPurpose) => {
    setPurpose(selectedPurpose);
    setIsAnimating(true);
    setAnimatingToStep('spending');
    setTimeout(() => {
      setCurrentStep('spending');
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingToStep(null);
      }, 650);
    }, 300);
  };

  const handleSpendingComplete = (spending: MonthlySpending) => {
    setMonthlySpending(spending);
    setIsAnimating(true);
    setAnimatingToStep('results');
    setTimeout(() => {
      setCurrentStep('results');
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingToStep(null);
      }, 650);
    }, 300);
  };

  const handleBack = () => {
    setIsAnimating(true);
    let targetStep: FlowStep;
    if (currentStep === 'purpose') {
      targetStep = 'onboarding';
      setAnimatingToStep('onboarding');
    } else if (currentStep === 'spending') {
      targetStep = 'purpose';
      setAnimatingToStep('purpose');
    } else if (currentStep === 'results') {
      targetStep = 'spending';
      setAnimatingToStep('spending');
    } else {
      return;
    }
    setTimeout(() => {
      setCurrentStep(targetStep);
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingToStep(null);
      }, 650);
    }, 300);
  };

  const handleReset = () => {
    setCurrentStep('home');
    setEligibility(null);
    setPaymentBehavior(null);
    setCreditScore(undefined);
    setPurpose(null);
    setMonthlySpending(null);
  };

  const handleGetStarted = () => {
    setIsAnimating(true);
    setAnimatingToStep('onboarding');
    setTimeout(() => {
      setCurrentStep('onboarding');
      // Keep animation state for fade-in to complete
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingToStep(null);
      }, 650);
    }, 300);
  };

  const handleHowItWorks = () => {
    setIsAnimating(true);
    setAnimatingToStep('how-it-works');
    // Start fade out animation
    setTimeout(() => {
      setCurrentStep('how-it-works');
      // Allow animation to complete
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingToStep(null);
      }, 650);
    }, 300); // Half of animation duration
  };

  const handleBackToHome = () => {
    setIsAnimating(true);
    setAnimatingToStep('home');
    setTimeout(() => {
      setCurrentStep('home');
      setSearchQuery('');
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatingToStep(null);
      }, 650);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentStep('search-results');
  };

  const handleSearchBack = () => {
    setCurrentStep('home');
    setSearchQuery('');
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
    <div
      className={`app-container ${
        currentStep !== 'home' && currentStep !== 'how-it-works'
          ? 'gradient-background'
          : ''
      }`}
    >
      {currentStep === 'home' ? (
        <div
          className={`page-transition ${
            isAnimating && animatingToStep === 'how-it-works'
              ? 'fade-out-slide'
              : 'fade-in'
          }`}
        >
          <Home
            onGetStarted={handleGetStarted}
            onHowItWorks={handleHowItWorks}
            onSearch={handleSearch}
          />
        </div>
      ) : currentStep === 'search-results' ? (
        <SearchResults
          searchQuery={searchQuery}
          onBack={handleSearchBack}
        />
      ) : currentStep === 'how-it-works' ? (
        <div
          className={`how-it-works-container page-transition ${
            isAnimating && animatingToStep === 'home'
              ? 'fade-out-slide-reverse'
              : 'fade-in-slide'
          }`}
        >
          <div className="how-it-works-content">
            <button onClick={handleBackToHome} className="back-button">
              ← Back to Home
            </button>
            <h1>How It Works</h1>
            <div className="how-it-works-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Tell Us About Yourself</h3>
                  <p>
                    Answer a few quick questions about your credit history,
                    student status, and payment habits.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Choose Your Purpose</h3>
                  <p>
                    Select what you'll mainly use the card for: travel,
                    business, everyday cashback, building credit, or balance
                    transfer.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Enter Your Monthly Spending</h3>
                  <p>
                    Tell us how much you spend each month in different
                    categories like dining, groceries, gas, travel, and more.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Get Personalized Recommendations</h3>
                  <p>
                    We'll filter cards by eligibility, calculate your yearly
                    rewards, score them based on your purpose, and show you the
                    exact math behind each recommendation.
                  </p>
                </div>
              </div>
            </div>
            <button onClick={handleGetStarted} className="primary-button">
              Get Started
            </button>
          </div>
        </div>
      ) : currentStep === 'purpose' ? (
        <div
          className={`purpose-picker-wrapper page-transition ${
            (isAnimating && (animatingToStep === 'onboarding' || animatingToStep === 'spending'))
              ? 'fade-out-slide-reverse'
              : 'fade-in-slide'
          }`}
        >
          <PurposePicker
            onSelect={handlePurposeSelect}
            onBack={handleBack}
            initialPurpose={purpose}
          />
        </div>
      ) : currentStep === 'results' && userProfile ? (
        <div
          className={`results-container page-transition ${
            isAnimating && animatingToStep === 'spending'
              ? 'fade-out-slide-reverse'
              : 'fade-in-slide'
          }`}
        >
          <Results
            userProfile={userProfile}
            onReset={handleReset}
            onBack={handleBack}
          />
        </div>
      ) : (
        <div className="app-content">
          <div className="app-content-wrapper">
            {currentStep === 'onboarding' && (
              <div
                className={`onboarding-container page-transition ${
                  isAnimating && animatingToStep === 'home'
                    ? 'fade-out-slide-reverse'
                    : 'fade-in-slide'
                }`}
              >
                <Onboarding
                  onComplete={handleOnboardingComplete}
                  initialEligibility={eligibility}
                  initialPaymentBehavior={paymentBehavior}
                  initialCreditScore={creditScore}
                />
              </div>
            )}

            {currentStep === 'spending' && (
              <div
                className={`page-transition ${
                  isAnimating && animatingToStep === 'purpose'
                    ? 'fade-out-slide-reverse'
                    : 'fade-in-slide'
                }`}
                style={{ width: '100%' }}
              >
                <SpendingInputs
                  onComplete={handleSpendingComplete}
                  onBack={handleBack}
                  initialSpending={monthlySpending}
                  purpose={purpose || undefined}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
