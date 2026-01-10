import { useState, useEffect } from 'react';
import type { MonthlySpending } from '../types/UserProfile';

interface SpendingInputsProps {
  onComplete: (spending: MonthlySpending) => void;
  onBack: () => void;
  initialSpending?: MonthlySpending | null;
  purpose?: string; // Reserved for future use (could customize UI based on purpose)
}

const spendingCategories = [
  { key: 'dining' as const, label: 'Dining', description: 'Restaurants, cafes, fast food' },
  { key: 'groceries' as const, label: 'Groceries', description: 'Supermarkets' },
  { key: 'gas' as const, label: 'Gas / EV Charging', description: 'Fuel stations and EV charging' },
  { key: 'travel' as const, label: 'Travel', description: 'Airlines, hotels, rentals, cruises' },
  { key: 'transit' as const, label: 'Transit', description: 'Rideshare, parking, tolls, public transit' },
  { key: 'drugstores' as const, label: 'Drugstores', description: 'Pharmacies' },
  { key: 'streaming' as const, label: 'Streaming / Subscriptions', description: 'Streaming services, subscriptions' },
  { key: 'onlineShopping' as const, label: 'Online Shopping / Retail', description: 'Online purchases, retail stores' },
  { key: 'entertainment' as const, label: 'Entertainment', description: 'Movies, concerts, events' },
  { key: 'homeImprovement' as const, label: 'Home Improvement', description: 'Hardware stores, home improvement' },
  { key: 'utilities' as const, label: 'Utilities / Phone Bill', description: 'Utilities, phone bills' },
  { key: 'other' as const, label: 'Everything Else', description: 'All other spending' },
];

export default function SpendingInputs({ onComplete, onBack, initialSpending }: SpendingInputsProps) {
  // purpose prop reserved for future use (could customize UI based on purpose)
  const [spending, setSpending] = useState<MonthlySpending>(
    initialSpending ?? {
      dining: 0,
      groceries: 0,
      gas: 0,
      travel: 0,
      transit: 0,
      drugstores: 0,
      streaming: 0,
      onlineShopping: 0,
      entertainment: 0,
      homeImprovement: 0,
      utilities: 0,
      other: 0,
    }
  );

  useEffect(() => {
    if (initialSpending) {
      setSpending(initialSpending);
    }
  }, [initialSpending]);

  const handleChange = (category: keyof MonthlySpending, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSpending((prev) => ({
      ...prev,
      [category]: numValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(spending);
  };

  const totalMonthly = Object.values(spending).reduce((sum, val) => sum + val, 0);
  const totalYearly = totalMonthly * 12;

  return (
    <div className="spending-inputs-container">
      <button onClick={onBack} className="back-button">
        ← Back
      </button>
      <h1>Tell us about your monthly spending</h1>
      <p className="subtitle">
        Enter your average monthly spending in each category. Cards categorize purchases by merchant codes, so location matters!
      </p>

      <form onSubmit={handleSubmit} className="spending-form">
        <div className="spending-grid">
          {spendingCategories.map((category) => (
            <div key={category.key} className="spending-item">
              <label className="spending-label">
                <span className="category-name">{category.label}</span>
                <span className="category-description">{category.description}</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={spending[category.key] || ''}
                  onChange={(e) => handleChange(category.key, e.target.value)}
                  placeholder="0.00"
                  className="spending-input"
                />
                <span className="input-suffix">/month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="spending-summary">
          <div className="summary-item">
            <span>Total Monthly Spending:</span>
            <strong>${totalMonthly.toFixed(2)}</strong>
          </div>
          <div className="summary-item">
            <span>Total Yearly Spending:</span>
            <strong>${totalYearly.toFixed(2)}</strong>
          </div>
        </div>

        <button type="submit" className="primary-button">
          See My Recommendations
        </button>
      </form>
    </div>
  );
}

