# Credit Card Recommendation Website - MVP

## Phase 0: MVP Scope (Complete ✅)

### Standard Spending Categories (12)
1. **Dining** - Restaurants, cafes, fast food
2. **Groceries** - Supermarkets
3. **Gas / EV charging** - Fuel stations and EV charging
4. **Travel** - Airlines, hotels, rentals, cruises
5. **Transit** - Rideshare, parking, tolls, public transit
6. **Drugstores / pharmacies** - Pharmacy purchases
7. **Streaming / subscriptions** - Streaming services and subscriptions
8. **Online shopping / retail** - Online purchases and retail stores
9. **Entertainment** - Movies, concerts, events
10. **Home improvement** - Hardware stores, home improvement
11. **Utilities / phone bill** - Utility and phone bills (optional)
12. **Everything else** - All other spending

**Note:** Cards categorize by Merchant Category Code (MCC), not purchase type. See `CATEGORY_MAPPING.md` for mapping strategy.

### UserProfile Object

The app uses a single `UserProfile` object throughout. See `user-profile-schema.json` for complete schema.

**Components:**
- **Purpose**: Primary use case (travel, business, everyday-cashback, build-credit, balance-transfer)
- **Monthly Spending**: All 12 categories with dollar amounts
- **Eligibility**: Gate questions (existing cards, student, under 21)
- **Payment Behavior**: Pay in full, preferences
- **Filters**: Additional criteria

See `user-profile-example.json` for an example.

### Card Data Structure

Each card in `cards.json` includes:
- Basic info (id, name, issuer)
- Annual fee
- Reward rates by category (as decimals: 0.03 = 3%)
- Optional sign-up bonus with spending requirements
- Eligibility (student status, age, credit score)
- Features (foreign transaction fees, travel benefits, APR)
- Description

**Note:** Cards currently use 5 simplified categories. See `CATEGORY_MAPPING.md` for mapping to the 12 standard categories.

### Example Calculation

For a card with 3% dining rewards:
- Monthly dining spend: $500
- Monthly rewards: $500 × 0.03 = $15
- Yearly rewards: $15 × 12 = $180
- Yearly value: $180 - $95 (annual fee) = $85

### Next Steps

1. Populate `cards.json` with 25-50 real credit cards
2. Build the user interface
3. Implement the recommendation algorithm
4. Add "show the math" breakdown feature

