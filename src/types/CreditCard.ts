/**
 * Comprehensive Credit Card Type Definitions
 * Based on cards-schema.json
 */

export type CardIdentity = {
  isStudentCard: boolean;
  isBusinessCard: boolean;
  starterFriendly: boolean;
};

export type APRRange = {
  min: number;
  max: number;
};

export type CardCosts = {
  annualFee: number;
  aprPurchase: APRRange;
  foreignTransactionFee: number; // 0 if no fee, otherwise decimal (e.g., 0.03 for 3%)
};

export type SpendingCap = {
  amount: number;
  period: "yearly" | "quarterly" | "monthly";
};

export type CategoryRates = {
  dining: number;
  groceries: number;
  gas: number;
  travel: number;
  transit: number;
  drugstores: number;
  streaming: number;
  onlineShopping: number;
  entertainment: number;
  homeImprovement: number;
  utilities: number;
  other: number;
};

export type RotatingCategories = {
  enabled: boolean;
  rate?: number; // Bonus rate (e.g., 0.05 for 5%)
  cap?: {
    amount: number;
    period: "quarterly";
  };
  activationRequired?: boolean;
  categories?: string[]; // Possible categories that rotate
};

export type SignUpBonus = {
  amount: number;
  spendRequired: number;
  monthsToComplete: number;
  description?: string;
};

export type CardRewards = {
  baseRate: number;
  categoryRates: CategoryRates;
  caps?: Partial<Record<keyof CategoryRates, SpendingCap>>;
  rotatingCategories?: RotatingCategories;
  signUpBonus?: SignUpBonus;
};

export type TravelPerks = {
  noForeignTxFee: boolean;
  tripDelayCoverage: boolean;
  baggageDelayCoverage: boolean;
  lostLuggageCoverage: boolean;
  rentalCarCDW: boolean; // Collision Damage Waiver
  loungeAccess: boolean;
  travelPortalBonus: boolean;
  travelInsurance: boolean;
  tsaPrecheckCredit: number; // Amount in dollars (0 if not offered)
  annualTravelCredit: number; // Amount in dollars (0 if not offered)
  concierge: boolean;
  transferPartners: boolean;
};

export type BusinessFeatures = {
  employeeCards: boolean;
  employeeCardFee: number;
  expenseTools: boolean;
  yearEndSummary: boolean;
  vendorPayments: boolean;
  accountingIntegration?: string[]; // e.g., ["QuickBooks", "Xero"]
  spendingLimits?: boolean;
  categoryRestrictions?: boolean;
  receiptCapture?: boolean;
};

export type CardEligibility = {
  minAge: number; // 18 or 21
  creditScoreMin?: number;
  creditScoreMax?: number;
  requiresIncome?: boolean;
  minIncome?: number;
  requiresCosignerUnder21?: boolean;
};

export type TrustFields = {
  lastVerifiedDate: string; // ISO 8601 format: YYYY-MM-DD
  sourceUrl: string; // Link to issuer's official product page
  termsUrl?: string;
  dataSource?: string;
};

export type CreditCard = {
  id: string;
  name: string;
  issuer: string;
  identity: CardIdentity;
  costs: CardCosts;
  rewards: CardRewards;
  travelPerks: TravelPerks;
  businessFeatures: BusinessFeatures;
  eligibility: CardEligibility;
  trust: TrustFields;
  description?: string;
  highlights?: string[];
};

// Helper types for filtering
export type CardPurpose = "travel" | "business" | "everyday-cashback" | "build-credit" | "balance-transfer";

export type CardFilter = {
  purpose?: CardPurpose;
  maxAnnualFee?: number;
  noAnnualFee?: boolean;
  isStudentCard?: boolean;
  isBusinessCard?: boolean;
  starterFriendly?: boolean;
  minCreditScore?: number;
  requiresNoForeignTxFee?: boolean;
  requiresTravelPerks?: boolean;
  requiresBusinessFeatures?: boolean;
};

// Utility type for calculating yearly value
export type YearlyValueCalculation = {
  cardId: string;
  cardName: string;
  totalRewards: number;
  annualFee: number;
  signUpBonusValue: number;
  netYearlyValue: number;
  breakdown: {
    category: keyof CategoryRates;
    monthlySpend: number;
    rewardRate: number;
    yearlyRewards: number;
  }[];
};

