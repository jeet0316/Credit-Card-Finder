/**
 * User Profile Type Definitions
 * Based on user-profile-schema.json
 */

export type MonthlySpending = {
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

export type Eligibility = {
  hasExistingCard: boolean;
  existingCardIds?: string[];
  isStudent: boolean;
  under21: boolean;
};

export type PaymentBehavior = {
  paysInFull: boolean;
  prefersNoAnnualFee?: boolean;
  needsTravelBenefits?: boolean;
};

export type Filters = {
  maxAnnualFee?: number;
  minCreditScore?: number;
  mustHaveNoForeignTransactionFee?: boolean;
  mustHaveTravelBenefits?: boolean;
};

export type UserPurpose = "travel" | "business" | "everyday-cashback" | "build-credit" | "balance-transfer";

export type UserProfile = {
  purpose: UserPurpose;
  monthlySpending: MonthlySpending;
  eligibility: Eligibility;
  paymentBehavior: PaymentBehavior;
  filters?: Filters;
};

