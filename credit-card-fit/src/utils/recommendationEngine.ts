import type { UserProfile } from '../types/UserProfile';
import cardsData from '../data/cards.json';

// Simplified card type matching current cards.json structure
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

interface Recommendation {
  card: SimplifiedCard;
  netYearlyValue: number;
  totalRewards: number;
  annualFee: number;
  signUpBonusValue: number;
  purposeScore: number;
  whyThisCard: string[];
  warnings?: string[];
  breakdown: {
    category: string;
    categoryKey: keyof UserProfile['monthlySpending'];
    monthlySpend: number;
    rewardRate: number;
    yearlyRewards: number;
    capApplied?: {
      amount: number;
      period: 'yearly' | 'quarterly' | 'monthly';
      cappedAmount: number;
    };
  }[];
}

/**
 * Eligibility filtering (hard filters)
 */
function applyEligibilityFilters(
  cards: SimplifiedCard[],
  userProfile: UserProfile
): SimplifiedCard[] {
  return cards.filter((card) => {
    // If purpose = business → prefer isBusinessCard = true
    // Note: cards.json doesn't have isBusinessCard, so we check name/description
    // Don't filter out business cards, but we'll boost them in scoring

    // If student = true → include student cards; if not, hide student-only
    if (!userProfile.eligibility.isStudent && card.eligibility.student) {
      return false; // Hide student-only cards for non-students
    }

    // If annualFeeAllowed = false → remove annualFee > 0
    if (
      userProfile.paymentBehavior.prefersNoAnnualFee &&
      card.annualFee > 0
    ) {
      return false;
    }

    // Credit score filter
    if (
      userProfile.filters?.minCreditScore &&
      card.eligibility.creditScoreMin &&
      card.eligibility.creditScoreMin > userProfile.filters.minCreditScore
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Calculate yearly rewards for a card based on user spending
 */
function calculateYearlyRewards(
  card: SimplifiedCard,
  monthlySpending: UserProfile['monthlySpending']
): {
  totalRewards: number;
  breakdown: Recommendation['breakdown'];
} {
  const breakdown: Recommendation['breakdown'] = [];
  let totalRewards = 0;

  // Map card categories to user spending categories
  const rewardRates: Record<string, number> = {
    gas: card.rewards.gas || card.rewards.other || 0,
    groceries: card.rewards.groceries || card.rewards.other || 0,
    dining: card.rewards.dining || card.rewards.other || 0,
    travel: card.rewards.travel || card.rewards.other || 0,
    // For other categories, use 'other' rate or base rate
    transit: card.rewards.other || 0,
    drugstores: card.rewards.other || 0,
    streaming: card.rewards.other || 0,
    onlineShopping: card.rewards.other || 0,
    entertainment: card.rewards.other || 0,
    homeImprovement: card.rewards.other || 0,
    utilities: card.rewards.other || 0,
    other: card.rewards.other || 0,
  };

  // Calculate rewards for each category
  // Note: caps are not in current cards.json structure, but we'll structure for future
  Object.entries(monthlySpending).forEach(([category, monthlySpend]) => {
    const rate = rewardRates[category] || 0;
    const categoryKey = category as keyof UserProfile['monthlySpending'];
    
    // Calculate yearly spend
    const yearlySpend = monthlySpend * 12;
    
    // Calculate rewards (would apply caps here if available in card data)
    // For now, cards.json doesn't have caps, but structure is ready
    // Example cap logic (commented out for future use):
    // const cap = card.rewards.caps?.[categoryKey];
    // let cappedYearlySpend = yearlySpend;
    // let capApplied = undefined;
    // if (cap) {
    //   const capAmount = cap.period === 'yearly' ? cap.amount : cap.period === 'quarterly' ? cap.amount * 4 : cap.amount * 12;
    //   if (yearlySpend > capAmount) {
    //     cappedYearlySpend = capAmount;
    //     capApplied = {
    //       amount: cap.amount,
    //       period: cap.period,
    //       cappedAmount: capAmount,
    //     };
    //   }
    // }
    
    const yearlyRewards = yearlySpend * rate; // Would use cappedYearlySpend if cap exists

    if (monthlySpend > 0) {
      breakdown.push({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        categoryKey,
        monthlySpend,
        rewardRate: rate,
        yearlyRewards,
        // capApplied, // Uncomment when caps are in card data
      });
      totalRewards += yearlyRewards;
    }
  });

  return { totalRewards, breakdown };
}

/**
 * Calculate sign-up bonus value (annualized if spread over years)
 */
function calculateSignUpBonusValue(card: SimplifiedCard): number {
  if (!card.rewards.bonus) return 0;

  const bonus = card.rewards.bonus;
  // Annualize the bonus value (simple approach: divide by years)
  // For year 1, full value; for subsequent years, 0
  // We'll treat it as a one-time benefit that improves first-year value
  return bonus.amount;
}

/**
 * Purpose-based scoring
 */
function calculatePurposeScore(
  card: SimplifiedCard,
  userProfile: UserProfile,
  netRewardsValue: number
): { score: number; reasons: string[] } {
  let score = netRewardsValue;
  const reasons: string[] = [];
  const purpose = userProfile.purpose;

  if (purpose === 'travel') {
    // Base score starts with net rewards value
    // Boost cards with strong travel + dining earn
    if (card.rewards.travel && card.rewards.travel > 0.02) {
      score += 50;
      reasons.push(
        `Strong ${(card.rewards.travel * 100).toFixed(0)}% travel rewards rate`
      );
    }
    if (card.rewards.dining && card.rewards.dining > 0.02) {
      score += 30;
      reasons.push(
        `Strong ${(card.rewards.dining * 100).toFixed(0)}% dining rewards rate`
      );
    }

    // Big bonus for no foreign transaction fee (critical for travel)
    if (card.features.noForeignTransactionFee) {
      score += 100;
      reasons.push('No foreign transaction fee');
    }

    // Travel protections (if available in data - currently simplified)
    // In full schema: tripDelayCoverage, baggageDelayCoverage, rentalCarCDW
    if (card.features.travelBenefits) {
      score += 75;
      reasons.push('Travel protections included (trip delay, baggage, rental coverage)');
    }

    // Boost if user has travel spend and card has elevated travel rate
    if (
      userProfile.monthlySpending.travel > 0 &&
      card.rewards.travel &&
      card.rewards.travel > 0.02
    ) {
      score += 40;
      reasons.push('Great match for your travel spending patterns');
    }

    // Travel-specific plain-English explanation
    const hasTravelPerks =
      card.features.noForeignTransactionFee || card.features.travelBenefits;
    if (hasTravelPerks && card.rewards.travel && card.rewards.travel > 0.02) {
      const perkList: string[] = [];
      if (card.features.noForeignTransactionFee) {
        perkList.push('no foreign transaction fee');
      }
      if (card.features.travelBenefits) {
        perkList.push('travel protections');
      }
      reasons.push(
        `This card is travel-leaning because it has ${perkList.join(' and ')} and elevated travel rewards.`
      );
    }
  } else if (purpose === 'business') {
    // Check if it's a business card (name/description check)
    // In full schema: businessFeatures.employeeCards, expenseTools, yearEndSummary
    const isBusinessCard =
      card.name.toLowerCase().includes('business') ||
      card.name.toLowerCase().includes('ink') ||
      card.description?.toLowerCase().includes('business');

    if (isBusinessCard) {
      score += 150;
      // In full schema, check for specific features:
      // - employeeCards
      // - expenseTools / receiptCapture
      // - yearEndSummary
      reasons.push('Business card with expense management features');
    }

    // Boost categories that match typical business spend
    // Business cards often used for: gas, office supplies (mapped to other), travel
    if (card.rewards.gas && card.rewards.gas > 0.02) {
      score += 30;
      reasons.push('Good rewards on gas and fuel');
    }
    if (card.rewards.travel && card.rewards.travel > 0.02) {
      score += 40;
      reasons.push('Strong rewards on business travel');
    }
    // Boost if categories match typical business spend user indicated
    const hasBusinessSpend =
      userProfile.monthlySpending.gas > 0 ||
      userProfile.monthlySpending.travel > 0;
    if (hasBusinessSpend && isBusinessCard) {
      score += 25;
      reasons.push('Rewards align with typical business spending categories');
    }
  } else if (purpose === 'everyday-cashback') {
    // Prefer flat-rate cards if value is close (simplified)
    const hasFlatRate = card.rewards.other && card.rewards.other > 0.015;
    if (hasFlatRate) {
      score += 20;
      reasons.push('Simple flat-rate rewards');
    }

    // Maximize net rewards (already in base score)
    if (netRewardsValue > 200) {
      reasons.push('Excellent cashback value');
    }
  } else if (purpose === 'build-credit') {
    // Prioritize $0 annual fee
    if (card.annualFee === 0) {
      score += 100;
      reasons.push('No annual fee');
    }

    // Prioritize starter-friendly cards (check eligibility)
    if (card.eligibility.creditScoreMin && card.eligibility.creditScoreMin < 650) {
      score += 80;
      reasons.push('Good for building credit');
    }

    // Prefer simple rewards (avoid complicated rotating categories)
    // This is simplified - in full schema we'd check rotatingCategories
    if (
      card.rewards.other &&
      Object.values(card.rewards).filter((r) => typeof r === 'number' && r > 0)
        .length <= 2
    ) {
      score += 30;
      reasons.push('Simple rewards structure');
    }
  } else if (purpose === 'balance-transfer') {
    // Prioritize low APR (if carrying balance)
    // Note: In full schema, check for intro APR (0% intro APR window)
    // Also check ongoing APR
    
    // Rewards become secondary for balance transfer - heavily weight APR
    if (card.features.apr && card.features.apr < 18) {
      score = 200 + (18 - card.features.apr) * 20;
      reasons.push(`Low ongoing APR (${card.features.apr}%)`);
      reasons.push('Rewards secondary - focus on paying down debt');
    } else if (card.features.apr && card.features.apr < 20) {
      score = 150 + (20 - card.features.apr) * 15;
      reasons.push(`Lower APR (${card.features.apr}%) for balance transfers`);
    } else if (card.features.apr && card.features.apr < 25) {
      score = 100 + (25 - card.features.apr) * 10;
      reasons.push(`Moderate APR (${card.features.apr}%)`);
    } else {
      // Still factor in APR but rewards have minimal weight
      score = score * 0.2 + (card.features.apr ? Math.max(0, (30 - card.features.apr) * 5) : 0);
      if (card.features.apr) {
        reasons.push(`APR: ${card.features.apr}%`);
      }
    }

    // Note: In full schema, would check for:
    // - 0% intro APR window (months)
    // - Balance transfer fee
    // - Ongoing APR after intro period
  }

  return { score, reasons };
}

/**
 * Generate "why this card" explanations
 */
function generateWhyThisCard(
  card: SimplifiedCard,
  _userProfile: UserProfile,
  purposeReasons: string[]
): string[] {
  const reasons: string[] = [];

  // Add purpose-specific reasons
  reasons.push(...purposeReasons);

  // Add reward highlights
  if (card.rewards.dining && card.rewards.dining > 0.02) {
    reasons.push(`${(card.rewards.dining * 100).toFixed(0)}% cash back on dining`);
  }
  if (card.rewards.travel && card.rewards.travel > 0.02) {
    reasons.push(`${(card.rewards.travel * 100).toFixed(0)}% cash back on travel`);
  }
  if (card.rewards.groceries && card.rewards.groceries > 0.02) {
    reasons.push(`${(card.rewards.groceries * 100).toFixed(0)}% cash back on groceries`);
  }

  // Annual fee note
  if (card.annualFee === 0) {
    reasons.push('No annual fee');
  } else {
    reasons.push(`$${card.annualFee}/year annual fee`);
  }

  // Sign-up bonus
  if (card.rewards.bonus && card.rewards.bonus.amount > 0) {
    reasons.push(
      `$${card.rewards.bonus.amount} sign-up bonus after spending $${card.rewards.bonus.spendRequired} in ${card.rewards.bonus.monthsToComplete} months`
    );
  }

  return reasons.slice(0, 5); // Limit to top 5 reasons
}

/**
 * Generate warnings for cards
 */
function generateWarnings(
  card: SimplifiedCard,
  userProfile: UserProfile
): string[] | undefined {
  const warnings: string[] = [];

  // Under 18 warning (don't block cards, just warn)
  // Per Reg Z: applicants under 18 must show ability-to-pay or have cosigner
  if (userProfile.eligibility.under21) {
    warnings.push(
      `⚠️ If you are under 18, you may need to show proof of independent income (ability-to-pay) or have a cosigner. This card requires you to be at least 18 years old. See card issuer's terms for details.`
    );
  }

  // Balance carrying warning
  if (
    !userProfile.paymentBehavior.paysInFull &&
    card.features.apr &&
    card.features.apr > 20
  ) {
    warnings.push(
      `⚠️ You carry a balance. This card has a ${card.features.apr}% APR. Consider paying off high-interest debt first or look for a balance transfer card with 0% intro APR.`
    );
  }

  // Foreign transaction fee warning for travelers
  if (
    userProfile.purpose === 'travel' &&
    !card.features.noForeignTransactionFee
  ) {
    warnings.push(
      '⚠️ This card charges foreign transaction fees (typically 3%), which can add up when traveling internationally. Consider a card with no foreign transaction fees for travel.'
    );
  }

  return warnings.length > 0 ? warnings : undefined;
}

/**
 * Main recommendation engine function
 */
export function getRecommendations(
  userProfile: UserProfile
): Recommendation[] {
  // Convert cards.json data to SimplifiedCard format
  const allCards = cardsData as unknown as SimplifiedCard[];

  // Step 1: Apply eligibility filters (hard filters)
  const eligibleCards = applyEligibilityFilters(allCards, userProfile);

  // Step 2: Calculate rewards and score for each card
  const recommendations: Recommendation[] = eligibleCards.map((card) => {
    // Calculate yearly rewards
    const { totalRewards, breakdown } = calculateYearlyRewards(
      card,
      userProfile.monthlySpending
    );

    // Calculate sign-up bonus (simplified: full value in first year)
    const signUpBonusValue = calculateSignUpBonusValue(card);

    // Calculate net yearly value
    const annualFee = card.annualFee;
    const netRewardsValue = totalRewards - annualFee + signUpBonusValue;

    // Calculate purpose-based score
    const { score: purposeScore, reasons: purposeReasons } =
      calculatePurposeScore(card, userProfile, netRewardsValue);

    // Generate "why this card" explanations
    const whyThisCard = generateWhyThisCard(
      card,
      userProfile,
      purposeReasons
    );

    // Generate warnings
    const warnings = generateWarnings(card, userProfile);

    return {
      card,
      netYearlyValue: netRewardsValue,
      totalRewards,
      annualFee,
      signUpBonusValue,
      purposeScore,
      whyThisCard,
      warnings,
      breakdown,
    };
  });

  // Step 3: Sort by purpose score (highest first)
  recommendations.sort((a, b) => b.purposeScore - a.purposeScore);

  // Step 4: Return top recommendations
  return recommendations.slice(0, 10);
}

