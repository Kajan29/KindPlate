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
│   ├── index.tsx       # Onboarding carousel (3 slides)
│   ├── login.tsx       # Role selection + login
│   └── (tabs)/         # Tab-based screens
│       ├── index.tsx   # Home - Donor dashboard
│       ├── donate.tsx  # Post a donation
│       ├── map.tsx     # Kindness map (needs & surplus)
│       ├── impact.tsx  # Community impact
│       └── profile.tsx # User profile
├── assets/             # Images, Icons, Fonts
├── components/         # Reusable UI Components (GlassCard, DonationCard, ...)
├── constants/          # Colors, Theme, Config
├── data/               # Mock Data (donations, needs, stories, badges)
├── hooks/              # Custom Hooks
├── services/           # Service layer (mock-backed)
├── store/              # State Management (Zustand)
├── styles/             # Global Styles & Theme
└── types/              # TypeScript Interfaces
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
import { DonationCard, GlassCard } from "@components/index";
import { Colors } from "@constants/index";
import { useDonationStore } from "@store/useDonationStore";
import { useUserStore } from "@store/useUserStore";
```

Available aliases: `@components`, `@constants`, `@data`, `@hooks`, `@services`, `@store`, `@styles`, `@types`, `@utils`, `@assets`

## Features

- Onboarding + role-based login (Donor, Volunteer, Recipient, NGO)
- Donor dashboard with points, rank, active donations and demand hotspots
- Post a donation with category, quantity, expiry and safety guidelines
- Kindness map showing live needs and surplus across Jaffna
- Community impact dashboard with collective stats and stories
- Profile with badges, contribution stats and multilingual support (English, Tamil, Sinhala)
- Runs entirely on in-memory mock data — no backend configuration required

> The UI implements the KindPlate design system: Deep Maroon + Deep Teal + Sage
> palette, glassmorphic surfaces and extra-rounded shapes.

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
