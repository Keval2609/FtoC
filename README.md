<p align="center">
  <img src="public/favicon.svg" alt="TerraDirect Logo" width="64" height="64" />
</p>

<h1 align="center">TerraDirect</h1>

<p align="center">
  <strong>Farm-to-Consumer Marketplace — Know Your Farmer, Trust Your Food</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa&logoColor=white" alt="PWA" />
</p>

---

## Overview

TerraDirect is a mobile-first Progressive Web App that connects consumers directly with regenerative and natural farmers. It enables transparent discovery of farming practices, verification of organic certifications, and a streamlined checkout flow — all while ensuring farmers receive fair, direct compensation.

### Why TerraDirect?

The conventional food supply chain is opaque. Consumers can't verify farming practices, and farmers lose margins to middlemen. TerraDirect solves both problems:

- **For Consumers** — Browse verified farms, see real certifications, and understand exactly where your food comes from.
- **For Farmers** — Sell directly to your community with a transparency score that builds trust organically.

---

## Features

### 🌱 Discovery Dashboard
- Hero section with brand messaging
- Real-time search across farms, products, locations, and practices
- Filter chips (All / Verified / Nearby / Organic)
- Responsive bento grid of farmer cards with lazy-loaded images
- Platform stats bar (verified farms count, direct percentage, avg delivery)

### 👨‍🌾 Farmer Profiles
- Full-width hero with gradient overlay and farmer avatar
- Verified badge (stamp metaphor) or pending status indicator
- Transparency indicator — animated bar showing direct-to-farmer percentage
- Farming practices grid with Material icons
- Product catalog with add-to-cart functionality
- Verification gallery with certification details, issue dates, and cert IDs

### 🛒 Checkout Flow
- Auth-gated — redirects to login with return URL
- Contact form pre-filled from authenticated user data
- Delivery form with address, date picker, and notes
- Mock payment form (demo — writes order to Firestore only)
- Sticky order summary with quantity controls
- Free delivery threshold ($35+)
- Order confirmation screen

### 🔐 Authentication & Roles
- Email/password sign up with **Role Selection** (Farmer vs. Customer)
- Google SSO with post-login role assignment for first-time users
- **Differentiated Onboarding**:
  - **Farmers**: Professional profile setup (Farm name, story, payout methods)
  - **Customers**: Delivery preferences (Address, phone, location)
- **Role-Based Routing**: Automatic redirection post-login (Farmers to Dashboard, Customers to Discovery)
- **Strict Access Control**: Role-gated routes and Firestore security rules to prevent unauthorized access
- Mock auth mode for rapid development (bypass Firebase setup)

### 🌓 Dark Mode
- System preference detection on first visit
- Manual toggle with animated icon (persisted to localStorage)
- Dual design token sets from Stitch design system
- Smooth 300ms transition on all themed surfaces

### 📱 PWA & Offline
- Service worker with Workbox auto-update strategy
- Image caching (CacheFirst for farmer images, 30-day expiry)
- Font caching (StaleWhileRevalidate for Google Fonts)
- Web app manifest for installability
- Responsive from 320px mobile to 1280px desktop

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18.3 | Component UI with hooks |
| **Build** | Vite 6 | Fast HMR, ESM-native bundling |
| **Styling** | Tailwind CSS 3.4 | Utility-first with CSS custom properties |
| **Backend** | Firebase | Auth, Firestore, Storage |
| **PWA** | vite-plugin-pwa (Workbox) | Service workers, offline caching |
| **Routing** | React Router DOM 6 | Client-side SPA routing |
| **Fonts** | Google Fonts | Newsreader (serif), Work Sans (sans) |
| **Icons** | Material Symbols Outlined | Consistent iconography |

---

## Project Structure

```
d:\F2C\
├── public/
│   ├── favicon.svg              # Brand favicon
│   └── manifest.json            # PWA manifest
├── src/
│   ├── components/
│   │   ├── auth/                # GoogleSignInButton, ProtectedRoute
│   │   ├── checkout/            # ContactForm, DeliveryForm, PaymentForm, OrderSummary
│   │   ├── discovery/           # SearchBar, FilterChips, FarmerCard
│   │   ├── layout/              # AppShell (header + mobile nav)
│   │   ├── profile/             # HeroSection, MethodsSection, ProductGrid, VerificationGallery
│   │   └── ui/                  # Button, LazyImage, ThemeToggle, ProductCard, VerifiedBadge, TransparencyIndicator
│   ├── context/
│   │   ├── AuthContext.jsx      # Firebase auth state + mock support
│   │   ├── CartContext.jsx      # useReducer cart with localStorage persistence
│   │   └── ThemeContext.jsx     # Dark/light mode with system preference detection
│   ├── lib/
│   │   ├── auth.js              # Firebase auth helpers
│   │   ├── firebase.js          # Firebase initialization
│   │   ├── firestore.js         # Data layer with automatic mock fallback
│   │   └── mockData.js          # Sample data matching Stitch designs
│   ├── pages/
│   │   ├── CheckoutPage.jsx     # Protected checkout with order submission
│   │   ├── DiscoveryPage.jsx    # Search, filter, browse farms
│   │   ├── FarmerProfilePage.jsx# Farm story, practices, products, certs
│   │   ├── LoginPage.jsx        # Email + Google sign-in
│   │   ├── OnboardingPage.jsx   # Role-specific profile completion
│   │   ├── RoleSelectPage.jsx   # Google SSO role assignment
│   │   └── SignupPage.jsx       # Account creation with role toggle
│   ├── App.jsx                  # Route definitions
│   ├── index.css                # Design tokens (light + dark), base styles
│   └── main.jsx                 # Provider tree entry point
├── .env                         # Local config (mock data enabled)
├── .env.example                 # Template for Firebase credentials
├── firestore.rules              # Security rules for production
├── index.html                   # HTML entry with font preconnects
├── package.json
├── postcss.config.js
├── tailwind.config.js           # 50+ semantic color tokens
└── vite.config.js               # PWA, aliases, dev server config
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/terradirect.git
cd terradirect

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens at **http://localhost:3000** with mock data — no Firebase setup required.

### Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase project credentials to connect to a live backend:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain (`project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Firestore project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_USE_MOCK_DATA` | Set to `true` for demo mode (no Firebase needed) |

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## Design System

TerraDirect uses a custom design system derived from Stitch with two distinct visual personas:

### Light Mode — "Grounded Transparency"
- **Palette:** Warm bone (#faf9f7) surfaces, Deep Forest Green (#061b0e) primary
- **Feel:** Minimalist, tactile, matte-paper aesthetic
- **Shadows:** Subtle ambient shadows with warm undertones

### Dark Mode — "Editorial Artisanal"
- **Palette:** Stone-tinted blacks (#121412) with soft sage (#bccbb9) primary
- **Feel:** Editorial, dramatic, moody night-market atmosphere
- **Shadows:** Deeper ambient shadows for depth

### Typography Scale

| Token | Font | Size | Weight | Use |
|-------|------|------|--------|-----|
| `display-xl` | Newsreader | 48px | 600 | Page titles |
| `headline-lg` | Newsreader | 32px | 500 | Section headers |
| `headline-md` | Newsreader | 24px | 500 | Card titles |
| `body-lg` | Work Sans | 18px | 400 | Lead paragraphs |
| `body-md` | Work Sans | 16px | 400 | Body text |
| `label-sm` | Work Sans | 14px | 600 | Labels, badges |
| `button` | Work Sans | 16px | 600 | Button text |

### Color Architecture

All 50+ color tokens are defined as CSS custom properties in `src/index.css`, enabling seamless dark mode switching without Tailwind's `dark:` prefix on every utility. The `tailwind.config.js` references these variables so `bg-primary`, `text-on-surface`, etc. automatically adapt to the active theme.

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **CSS Custom Properties for theming** | Single class name (e.g., `bg-primary`) works in both light and dark mode without duplicating `dark:` variants |
| **Mock data layer** | Enables instant development without Firebase setup; controlled by a single env var |
| **useReducer for cart** | Predictable state transitions for add/remove/update; persists to localStorage for offline resilience |
| **IntersectionObserver for images** | Native lazy loading with 200px root margin for smooth scroll; includes skeleton placeholder and error fallback |
| **Protected routes with redirect** | Checkout and Dashboard require auth; users are redirected based on role and onboarding status |
| **Role-based security rules** | Firestore rules enforce that only 'farmer' roles can create/edit products or farm data |
| **Differentiated onboarding** | Tailored data collection paths for Farmers vs. Customers to keep user profiles lean and relevant |

---

## Roadmap

- [x] **Phase 1** — Discovery, Profiles, Checkout
- [ ] **Phase 2** — Role-Based Auth, Farmer Dashboard, Messaging (In Progress)
  - [x] Step 1: Role-Based Authentication & Onboarding
  - [ ] Step 2: Real-time Messaging System
  - [ ] Step 3: Monetization & Transactions
- [ ] **Phase 3** — Real Payment Integration (Stripe), Order Tracking
- [ ] **Phase 4** — Community Features (Removed/Deprioritized)
- [ ] **Phase 5** — Mobile App (React Native), Push Notifications

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 🌿 for the farmers who feed us.
</p>
