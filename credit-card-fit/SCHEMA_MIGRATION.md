# Card Schema Migration Guide

## Overview

The card schema has been expanded from a simplified structure to a comprehensive schema that supports:
- **Purpose-based filtering** (Travel, Business, Everyday cashback, Build credit)
- **Detailed travel perks** (trip delay, baggage delay, rental car CDW, lounge access, etc.)
- **Business features** (employee cards, expense tools, year-end summaries)
- **Complete reward structure** (all 12 categories, caps, rotating categories)
- **Trust fields** (verification dates, source URLs)

## Schema Changes

### Old Schema → New Schema Mapping

| Old Field | New Location | Notes |
|-----------|--------------|-------|
| `id` | `id` | Same |
| `name` | `name` | Same |
| `issuer` | `issuer` | Same |
| `annualFee` | `costs.annualFee` | Moved to costs object |
| `features.apr` | `costs.aprPurchase` | Now has min/max range |
| `features.noForeignTransactionFee` | `costs.foreignTransactionFee` (0 = no fee) | Also in `travelPerks.noForeignTxFee` |
| `rewards.gas` | `rewards.categoryRates.gas` | Expanded to all 12 categories |
| `rewards.groceries` | `rewards.categoryRates.groceries` | Same |
| `rewards.dining` | `rewards.categoryRates.dining` | Same |
| `rewards.travel` | `rewards.categoryRates.travel` | Same |
| `rewards.other` | `rewards.categoryRates.other` | Same |
| `rewards.bonus` | `rewards.signUpBonus` | Renamed |
| `eligibility.student` | `identity.isStudentCard` | Moved |
| `eligibility.minAge` | `eligibility.minAge` | Same location |
| `eligibility.creditScoreMin` | `eligibility.creditScoreMin` | Same location |
| `features.travelBenefits` | `travelPerks.*` | Expanded into specific perks |
| N/A | `identity.isBusinessCard` | **NEW** - Must be determined |
| N/A | `identity.starterFriendly` | **NEW** - Must be determined |
| N/A | `rewards.baseRate` | **NEW** - Calculate from category rates |
| N/A | `rewards.categoryRates` (all 12) | **NEW** - Map existing 5 to 12 |
| N/A | `rewards.caps` | **NEW** - Research per card |
| N/A | `rewards.rotatingCategories` | **NEW** - Identify rotating category cards |
| N/A | `travelPerks.*` | **NEW** - Research travel perks |
| N/A | `businessFeatures.*` | **NEW** - For business cards only |
| N/A | `trust.*` | **NEW** - Add verification dates and source URLs |

## Migration Steps

### 1. Identity Fields
```javascript
// OLD
{
  "eligibility": {
    "student": false
  }
}

// NEW
{
  "identity": {
    "isStudentCard": false,
    "isBusinessCard": false,  // Determine from card name/description
    "starterFriendly": false  // True for secured cards, student cards, basic cards
  }
}
```

### 2. Costs Structure
```javascript
// OLD
{
  "annualFee": 95,
  "features": {
    "apr": 21.49,
    "noForeignTransactionFee": true
  }
}

// NEW
{
  "costs": {
    "annualFee": 95,
    "aprPurchase": {
      "min": 21.49,
      "max": 28.49  // Research actual range
    },
    "foreignTransactionFee": 0  // 0 if noForeignTransactionFee was true, 0.03 if false
  }
}
```

### 3. Rewards Structure
```javascript
// OLD
{
  "rewards": {
    "gas": 0.01,
    "groceries": 0.01,
    "dining": 0.03,
    "travel": 0.03,
    "other": 0.01,
    "bonus": {
      "amount": 600,
      "spendRequired": 4000,
      "monthsToComplete": 3
    }
  }
}

// NEW
{
  "rewards": {
    "baseRate": 0.01,  // Usually the lowest category rate or "other"
    "categoryRates": {
      "dining": 0.03,
      "groceries": 0.01,
      "gas": 0.01,
      "travel": 0.03,
      "transit": 0.01,  // Map from travel or other
      "drugstores": 0.01,  // Research per card
      "streaming": 0.01,  // Research per card
      "onlineShopping": 0.01,  // Research per card
      "entertainment": 0.01,  // Research per card
      "homeImprovement": 0.01,  // Research per card
      "utilities": 0.01,  // Research per card
      "other": 0.01
    },
    "caps": {
      // Add if card has spending caps (e.g., Amex Blue Cash Preferred: $6k groceries/year)
    },
    "rotatingCategories": {
      "enabled": false  // true for Discover it, Chase Freedom Flex, etc.
    },
    "signUpBonus": {
      "amount": 600,
      "spendRequired": 4000,
      "monthsToComplete": 3,
      "description": "Add human-readable description"
    }
  }
}
```

### 4. Travel Perks (for travel cards)
```javascript
// NEW - Research each perk per card
{
  "travelPerks": {
    "noForeignTxFee": true,
    "tripDelayCoverage": true,  // Research
    "baggageDelayCoverage": true,  // Research
    "lostLuggageCoverage": true,  // Research
    "rentalCarCDW": true,  // Research (primary vs secondary)
    "loungeAccess": false,  // Research
    "travelPortalBonus": true,  // Research
    "travelInsurance": true,  // Research
    "tsaPrecheckCredit": 0,  // Research (e.g., 100 for some premium cards)
    "annualTravelCredit": 0,  // Research (e.g., 300 for Chase Sapphire Reserve)
    "concierge": false,  // Research
    "transferPartners": true  // Research
  }
}
```

### 5. Business Features (for business cards only)
```javascript
// NEW - Only for cards where identity.isBusinessCard === true
{
  "businessFeatures": {
    "employeeCards": true,  // Research
    "employeeCardFee": 0,  // Research
    "expenseTools": true,  // Research
    "yearEndSummary": true,  // Research
    "vendorPayments": false,  // Research
    "accountingIntegration": ["QuickBooks"],  // Research
    "spendingLimits": true,  // Research
    "categoryRestrictions": true,  // Research
    "receiptCapture": true  // Research
  }
}
```

### 6. Trust Fields
```javascript
// NEW - Add to all cards
{
  "trust": {
    "lastVerifiedDate": "2025-01-09",  // Current date when migrating
    "sourceUrl": "https://www.chase.com/personal/credit-cards/...",  // Official issuer page
    "termsUrl": "https://creditcards.chase.com/.../terms",  // Terms and conditions URL
    "dataSource": "issuer_website"  // or "public_disclosure", "manual_research"
  }
}
```

## Migration Strategy

### Option 1: Automated Migration Script (Recommended)
Create a script that:
1. Reads all cards from old schema
2. Maps known fields
3. Sets defaults for new required fields
4. Flags cards needing manual research (travel perks, business features, etc.)
5. Outputs migrated cards + list of cards needing manual review

### Option 2: Manual Migration (For Accuracy)
Manually migrate each card with proper research for:
- All 12 category rates (many cards don't publish rates for all categories)
- Travel perks (requires reading card benefits)
- Business features (for business cards)
- Spending caps (often in fine print)
- Rotating categories (if applicable)

### Option 3: Hybrid Approach (Recommended for MVP)
1. Automated script for basic mapping
2. Manual research for:
   - Top 20-30 most popular cards (complete accuracy)
   - Cards with special features (rotating categories, caps, etc.)
   - Travel cards (all travel perks)
   - Business cards (all business features)
3. Set defaults for remaining cards (can improve later)

## Example: Complete Migration

See:
- `card-example-new-schema.json` - Travel card example
- `card-example-business.json` - Business card example  
- `card-example-student.json` - Student card with rotating categories

## Notes

1. **Category Mapping**: Many cards don't specify rates for all 12 categories. Use baseRate or map from similar categories.
2. **Research Required**: Travel perks and business features require reading actual card benefits pages.
3. **Source URLs**: Always link to official issuer product pages for trust.
4. **Verification Dates**: Update `lastVerifiedDate` when card terms change.
5. **Caps**: Important for accurate calculations (e.g., Amex Blue Cash Preferred has $6k/year cap on groceries).

## Priority Order for Migration

1. **High Priority** (Migrate first):
   - Top 20 most popular cards
   - Cards with rotating categories
   - Business cards (need business features)
   - Premium travel cards (need all travel perks)

2. **Medium Priority**:
   - All travel cards
   - All student cards
   - Cards with spending caps

3. **Low Priority** (Can use defaults initially):
   - Basic cashback cards
   - Store cards
   - Lesser-known cards

