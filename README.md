# FoodShare (KindPlate)

A community-driven food sharing app built with React Native and Expo. Share your extra food with those who need it, reduce waste, and strengthen your neighborhood.

## Tech Stack

- **React Native** with Expo SDK 52
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Zustand** for state management
- **Ionicons** for iconography

## Project Structure

```
├── app/                # Screens & Navigation (Expo Router)
│   ├── _layout.tsx     # Root Stack navigator
│   └── (tabs)/         # Tab-based screens
│       ├── index.tsx   # Home - Available food nearby
│       ├── explore.tsx # Explore community food
│       ├── share.tsx   # Share your food
│       └── profile.tsx # User profile
├── assets/             # Images, Icons, Fonts
├── components/         # Reusable UI Components
├── constants/          # Colors, Routes, Config
├── data/               # Mock Data
├── hooks/              # Custom Hooks
├── services/           # API & Data Services
├── store/              # State Management (Zustand)
├── styles/             # Global Styles & Theme
├── types/              # TypeScript Interfaces
└── utils/              # Helper Functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing on device)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd KindPlate

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import { FoodCard } from "@components/FoodCard";
import { Colors } from "@constants/Colors";
import { useFoodStore } from "@store/foodStore";
```

Available aliases: `@components`, `@constants`, `@data`, `@hooks`, `@services`, `@store`, `@styles`, `@types`, `@utils`, `@assets`

## Features

- Browse available food near you
- Share surplus food with your community
- Search and explore food listings
- User profiles with ratings and history
- Distance-based food discovery

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in browser |
| `npm run lint` | Run ESLint |
| `npm run typescript` | Type-check without emitting |

## Contributing

1. Create a feature branch (`git checkout -b feature/my-feature`)
2. Commit your changes (`git commit -m "Add my feature"`)
3. Push to the branch (`git push origin feature/my-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.
