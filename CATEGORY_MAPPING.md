# Category Mapping Guide

## Overview

The card schema (`cards-schema.json`) currently uses **5 simplified categories** for reward rates:
- `gas`
- `groceries`
- `dining`
- `travel`
- `other`

The UserProfile schema uses **12 standard spending categories**:
1. Dining
2. Groceries
3. Gas / EV charging
4. Travel
5. Transit
6. Drugstores / pharmacies
7. Streaming / subscriptions
8. Online shopping / retail
9. Entertainment
10. Home improvement
11. Utilities / phone bill
12. Everything else

## Mapping Strategy

### Option 1: Direct Mapping (Current Implementation)
Map user's 12 categories to card's 5 categories:

- **Dining** → `dining`
- **Groceries** → `groceries`
- **Gas / EV charging** → `gas`
- **Travel** → `travel`
- **Transit** → `travel` (or `other` if card doesn't explicitly cover transit)
- **Drugstores** → `other` (or `groceries` if card has drugstore category)
- **Streaming** → `other` (or specific category if card has streaming rewards)
- **Online shopping / retail** → `other`
- **Entertainment** → `other`
- **Home improvement** → `other`
- **Utilities** → `other`
- **Everything else** → `other`

### Option 2: Expand Card Schema (Future Enhancement)
Update `cards-schema.json` to support all 12 categories directly. This would require:
1. Updating the schema
2. Migrating all 114 cards in `cards.json` to include all 12 category rates
3. Researching actual reward rates for each category per card

### Option 3: Category Grouping
For MVP, use intelligent grouping:
- **High-value categories** (where cards often have special rates): Dining, Groceries, Gas, Travel
- **Medium-value categories**: Transit, Drugstores, Streaming (some cards have these)
- **Catch-all**: Everything else maps to `other`

## Implementation Notes

1. **MCC-based rewards**: Remember that credit cards categorize by Merchant Category Code (MCC), not purchase type. A gas station purchase always earns gas rewards, even if you bought snacks.

2. **Card-specific categories**: Some cards have specific categories:
   - Streaming services (Amex Blue Cash Preferred: 6% on streaming)
   - Drugstores (some cards: 2-3%)
   - Transit (some cards: 2x on transit)
   - Online shopping (some cards: 3-5% on online purchases)

3. **For MVP**: Start with Option 1 (direct mapping). This allows immediate implementation while maintaining the existing card data structure.

4. **Future**: Migrate to Option 2 (expanded schema) when you have resources to research and update all card reward structures for the full 12 categories.

## Example Calculation

**User Profile:**
- Dining: $400/month
- Groceries: $600/month
- Gas: $200/month
- Transit: $100/month
- Other categories: $500/month

**Card Reward Rates:**
- Dining: 3%
- Groceries: 1%
- Gas: 1%
- Travel: 3%
- Other: 1%

**Mapping:**
- Dining $400 → 3% = $12/month
- Groceries $600 → 1% = $6/month
- Gas $200 → 1% = $2/month
- Transit $100 → 3% (if transit counts as travel) or 1% (if other) = $3/month or $1/month
- Other $500 → 1% = $5/month

**Total rewards**: $28/month or $26/month depending on transit mapping

