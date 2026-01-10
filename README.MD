# Credit Card Finder

A React + TypeScript + Vite application that helps users find the best credit cards based on their spending habits and preferences.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
credit-card-fit/
├── src/
│   ├── data/           # Credit card data and schemas
│   │   ├── cards.json
│   │   ├── cards-schema.json
│   │   └── user-profile-example.json
│   ├── types/          # TypeScript type definitions
│   │   └── user-profile-schema.json
│   └── ...
├── MVP_SCOPE.md        # MVP requirements and scope
├── CATEGORY_MAPPING.md # Category mapping documentation
└── PROJECT_README.md   # Detailed project documentation
```

## 📊 Data

- **114 Credit Cards** from major issuers (Chase, Amex, Citi, Capital One, etc.)
- **12 Spending Categories** for detailed analysis
- **User Profile Schema** for comprehensive user preferences

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

## 📚 Documentation

See `PROJECT_README.md` for detailed documentation about:
- UserProfile schema
- Spending categories
- Card data structure
- Category mapping strategy

## 🎯 MVP Features

- Purpose-based card selection (Travel, Business, Everyday cashback, Build credit, Balance transfer)
- 12 spending category inputs
- Eligibility gate questions
- Top 3 card recommendations with yearly value calculations
- "Show the math" breakdown

## 📝 License

MIT
