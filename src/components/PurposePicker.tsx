import { useState, useEffect } from 'react';
import type { UserPurpose } from '../types/UserProfile';

interface PurposePickerProps {
  onSelect: (purpose: UserPurpose) => void;
  onBack: () => void;
  initialPurpose?: UserPurpose | null;
}

const purposes: { value: UserPurpose; label: string; description: string; icon: string }[] = [
  {
    value: 'travel',
    label: 'Travel',
    description: 'Maximize points and miles, airport lounges, travel insurance',
    icon: '✈️',
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Employee cards, expense tracking, business rewards',
    icon: '💼',
  },
  {
    value: 'everyday-cashback',
    label: 'Everyday Cashback',
    description: 'Maximize cash back on your daily spending',
    icon: '💰',
  },
  {
    value: 'build-credit',
    label: 'Build Credit',
    description: 'First card or rebuild credit history',
    icon: '📈',
  },
  {
    value: 'balance-transfer',
    label: 'Balance Transfer',
    description: 'Transfer existing debt, low intro APR',
    icon: '🔄',
  },
];

export default function PurposePicker({ onSelect, onBack, initialPurpose }: PurposePickerProps) {
  const [selectedPurpose, setSelectedPurpose] = useState<UserPurpose | null>(initialPurpose ?? null);

  useEffect(() => {
    if (initialPurpose) {
      setSelectedPurpose(initialPurpose);
    }
  }, [initialPurpose]);

  const handleSelect = (purpose: UserPurpose) => {
    setSelectedPurpose(purpose);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelect(purpose);
    }, 200);
  };

  return (
    <div className="purpose-picker-container">
      <button onClick={onBack} className="back-button">
        ← Back
      </button>
      <h1>What will you mainly use this card for?</h1>
      <p className="subtitle">This helps us recommend the best card for your needs</p>

      <div className="purpose-grid">
        {purposes.map((purpose) => (
          <button
            key={purpose.value}
            type="button"
            className={`purpose-card ${selectedPurpose === purpose.value ? 'selected' : ''}`}
            onClick={() => handleSelect(purpose.value)}
          >
            <div className="purpose-icon">{purpose.icon}</div>
            <h3>{purpose.label}</h3>
            <p>{purpose.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

