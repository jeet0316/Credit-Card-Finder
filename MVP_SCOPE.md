# Credit Card Recommendation MVP - Phase 0

## MVP Features

### Purpose Question (Primary Feature)
**"What will you mainly use this card for?"**
- Travel
- Business
- Everyday cashback
- Build credit / first card
- Balance transfer / paying down debt (optional)

This purpose decides what filters and perks you prioritize, not just cashback percent.

### Gate Questions (Eligibility + Smarter Results)
1. **Already have a card?** (Yes/No) - to avoid recommending cards they already own
2. **Student?** (Yes/No) - filters for student-friendly cards
3. **Under 21?** (Yes/No) - filters for cards available to users under 21 (Reg Z: under-21 approvals/limit increases can require independent ability to pay or a 21+ co-signer)
4. **Pay in full monthly?** (Yes/No) - if "No", APR matters way more than rewards

### Monthly Spend Inputs (Standard Spending Categories)
Users input their monthly spending in these categories (MCC-based, not purchase-based):

1. **Dining** - Restaurants, cafes, fast food
2. **Groceries** - Supermarkets
3. **Gas / EV charging** - Fuel stations and EV charging
4. **Travel** - Airlines, hotels, car rentals, cruises, etc.
5. **Transit** - Rideshare, parking, tolls, public transit
6. **Drugstores / pharmacies** - Pharmacy purchases
7. **Streaming / subscriptions** - Streaming services and subscription bills
8. **Online shopping / retail** - Online purchases and retail stores
9. **Entertainment** - Movies, concerts, events, etc.
10. **Home improvement** - Hardware stores, home improvement purchases
11. **Utilities / phone bill** - Utility bills, phone bills (optional)
12. **Everything else** - All other spending

**Note:** Cards categorize purchases by the merchant's category code (MCC), not by what you bought. That's why "the same thing" can earn different rewards depending on where you bought it.

### Output
- **Top 3 cards** ranked by yearly value
- **Yearly value** calculation for each card
- **"Show the math" breakdown** - transparent calculation showing:
  - Rewards earned per category
  - Annual fee (if any)
  - Net yearly value

### Filters
- **No annual fee** (optional checkbox)
- **Travel/No foreign transaction fee** (optional checkbox) - for frequent travelers

## Data Structure

### UserProfile Object
A single `UserProfile` object is used throughout the entire application. See `user-profile-schema.json` for the complete schema.

Key components:
- **Purpose**: Primary use case (travel, business, everyday-cashback, build-credit, balance-transfer)
- **Monthly Spending**: All 12 spending categories with dollar amounts
- **Eligibility**: Gate questions (existing cards, student status, age)
- **Payment Behavior**: Pay in full, preferences for annual fees, travel needs
- **Filters**: Additional filtering criteria

See `user-profile-example.json` for an example UserProfile.

### Spending Categories
The standard spending categories (12 total):
1. Dining (restaurants, cafes, fast food)
2. Groceries (supermarkets)
3. Gas / EV charging
4. Travel (airlines, hotels, rentals, cruises)
5. Transit (rideshare, parking, tolls, public transit)
6. Drugstores / pharmacies
7. Streaming / subscriptions
8. Online shopping / retail
9. Entertainment
10. Home improvement
11. Utilities / phone bill (optional)
12. Everything else

### Card JSON Schema
See `cards-schema.json` for the detailed structure.

**Note:** The card schema currently uses simplified categories (gas, groceries, dining, travel, other). Cards will need to be mapped/expanded to support the full 12-category system, or a mapping system will need to be implemented to translate between the card's reward structure and the standard categories.

## MVP Data Plan

- **Start:** 25-50 cards in local JSON file (`cards.json`)
- **Format:** Manual entry for MVP
- **Future:** Migrate to database when needed

