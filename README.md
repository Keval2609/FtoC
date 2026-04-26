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

</p>

---

## Overview

TerraDirect is a mobile-first web application that connects consumers directly with regenerative and natural farmers. It enables transparent discovery of farming practices, verification of organic certifications, and a streamlined checkout flow — all while ensuring farmers receive fair, direct compensation.

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
- **"Message Farmer" button** for direct 1-on-1 chat (logged-in customers only)

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

### 💬 Direct Messaging & Presence
- Real-time 1-on-1 chat between customers and farmers
- **Presence Tracking**: Real-time online/offline status using Firebase Realtime Database and `onDisconnect()`
- **Typing Indicators**: Live "User is typing..." feedback in chat
- Conversation list with last message preview and relative timestamps
- Auto-scrolling message thread with time-stamped bubbles
- Deterministic chat IDs (`uid1_uid2`) for deduplication
- Firestore real-time `onSnapshot` listener for instant updates
- Participant-only access enforced by security rules

### 📦 Product Addition (Farmer)
- Dedicated product creation page with **multi-image upload** (1–5 images)
- Firebase Storage upload with per-file and total progress tracking
- Image preview grid with cover indicator and remove buttons
- **Shelf life** selector (number + hours/days/weeks unit)
- Pricing unit dropdown (kg, gram, piece, dozen, liter, bunch)
- File validation: type (JPG/PNG/WebP/GIF) and size (max 5MB each)
- Success screen with "Add Another" or "Go to Dashboard" options

### 🌓 Dark Mode
- System preference detection on first visit
- Manual toggle with animated icon (persisted to localStorage)
- Dual design token sets from Stitch design system
- Smooth 300ms transition on all themed surfaces

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18.3 | Component UI with hooks |
| **Build** | Vite 6 | Fast HMR, ESM-native bundling |
| **Styling** | Tailwind CSS 3.4 | Utility-first with CSS custom properties |
| **Backend** | Firebase | Auth, Firestore, Realtime DB, Storage |
| **Routing** | React Router DOM 6 | Client-side SPA routing |
| **Fonts** | Google Fonts | Newsreader (serif), Work Sans (sans) |
| **Icons** | Material Symbols Outlined | Consistent iconography |

---

## Dual-Environment Architecture

TerraDirect runs two isolated environments from a **single codebase**:

| | Demo | Production |
|---|---|---|
| **URL** | `terradirectf2c-demo.web.app` | `terradirectf2c.web.app` |
| **Authentication** | Pre-logged mock user (Alex Demo) | Real Firebase Auth |
| **Data Source** | In-memory `mockData.js` | Firestore real-time |
| **Image Upload** | Simulated (placeholder URLs) | Cloudinary |
| **Persistence** | None (resets on reload) | Permanent |
| **Use Case** | Demos, testing, future features | Live users, real transactions |

### How It Works

- `VITE_ENVIRONMENT` is set at build-time via Vite's `--mode` flag
- `EnvironmentContext` provides `'demo'` or `'production'` to the tree
- `AuthContext` branches: demo returns a pre-logged user, production uses Firebase Auth
- `ServiceContext` lazy-imports `mock.service.js` or `firebase.service.js`
- Demo builds include a fixed green banner: *"Demo Mode — All data is simulated"*

---

## Project Structure

```
d:\F2C\
├── public/
│   ├── favicon.svg                # Brand favicon
├── src/
│   ├── components/
│   │   ├── auth/                  # GoogleSignInButton, ProtectedRoute
│   │   ├── checkout/              # ContactForm, DeliveryForm, PaymentForm, OrderSummary
│   │   ├── discovery/             # SearchBar, FilterChips, FarmerCard
│   │   ├── layout/                # AppShell (header + mobile nav)
│   │   ├── profile/               # HeroSection, MethodsSection, ProductGrid, VerificationGallery
│   │   └── ui/                    # Button, LazyImage, ThemeToggle, ProductCard, etc.
│   ├── hooks/
│   │   └── usePresence.js         # Presence & typing indicator hooks
│   ├── context/
│   │   ├── AuthContext.jsx        # Dual-mode: DemoAuth vs ProductionAuth
│   │   ├── CartContext.jsx        # useReducer cart with localStorage persistence
│   │   ├── EnvironmentContext.jsx # Provides 'demo' or 'production' to tree
│   │   ├── ServiceContext.jsx     # Provides mock or firebase service layer
│   │   └── ThemeContext.jsx       # Dark/light mode with system preference detection
│   ├── lib/
│   │   ├── auth.js                # Firebase auth helpers (production only)
│   │   ├── cloudinary.js          # Cloudinary image upload (production only)
│   │   ├── firebase.js            # Firebase SDK initialization
│   │   ├── firestore.js           # Firestore data operations
│   │   ├── mockData.js            # Mock farmers, products, certifications
│   │   ├── mockInventory.js       # Mock inventory for dashboard
│   │   └── services/
│   │       ├── firebase.service.js # Production: re-exports real Firebase ops
│   │       └── mock.service.js     # Demo: in-memory implementations
│   ├── pages/
│   │   ├── AddProductPage.jsx     # Product creation with image upload
│   │   ├── ChatListPage.jsx       # Conversation inbox
│   │   ├── ChatPage.jsx           # Real-time 1-on-1 chat room
│   │   ├── CheckoutPage.jsx       # Protected checkout with order submission
│   │   ├── DiscoveryPage.jsx      # Search, filter, browse farms
│   │   ├── FarmerDashboardPage.jsx# Inventory, orders, stats
│   │   ├── FarmerProfilePage.jsx  # Farm story, practices, products, certs
│   │   ├── FarmerSetupPage.jsx    # Farmer onboarding
│   │   ├── LoginPage.jsx          # Email + Google sign-in
│   │   ├── OnboardingPage.jsx     # Customer onboarding
│   │   ├── RoleSelectPage.jsx     # Google SSO role assignment
│   │   └── SignupPage.jsx         # Account creation with role toggle
│   ├── App.jsx                    # Route definitions
│   ├── index.css                  # Design tokens (light + dark), base styles
│   ├── main.jsx                   # Universal entry point (reads VITE_ENVIRONMENT)
│   ├── main-demo.jsx              # Standalone demo entry (alternative)
│   └── main-production.jsx        # Standalone production entry (alternative)
├── .env                           # Local config (dev defaults)
├── .env.demo                      # Demo build env vars
├── .env.production                # Production build env vars (gitignored)
├── database.rules.json            # Realtime DB security rules
├── firebase.json                  # Firebase hosting (dual targets)
├── firestore.rules                # Firestore security rules
├── firestore.indexes.json         # Firestore indexes
├── index.html                     # HTML entry with font preconnects
├── package.json                   # Dual-environment build scripts
├── postcss.config.js
├── tailwind.config.js             # 50+ semantic color tokens
└── vite.config.js                 # Mode-based output dirs + env injection
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

# Start development server (production mode — real Firebase)
npm run dev

# Start development server (demo mode — mock data, no Firebase)
npm run dev:demo
```

### Build Commands

| Command | Output Dir | Description |
|---------|-----------|-------------|
| `npm run build:demo` | `dist-demo/` | Demo build (mock data, no Firebase) |
| `npm run build:production` | `dist-prod/` | Production build (real Firebase) |
| `npm run preview:demo` | — | Preview demo build locally |
| `npm run preview:production` | — | Preview production build locally |
| `npm run deploy:demo` | — | Build + deploy to `terradirectf2c-demo.web.app` |
| `npm run deploy:production` | — | Build + deploy to `terradirectf2c.web.app` |

### Environment Variables

The project uses mode-specific `.env` files:

| File | Mode | Description |
|------|------|-------------|
| `.env` | Default dev | Local development defaults |
| `.env.demo` | `--mode demo` | Demo build (no Firebase credentials) |
| `.env.production` | `--mode production` | Production build (real credentials, gitignored) |

| Variable | Description |
|----------|-------------|
| `VITE_ENVIRONMENT` | `demo` or `production` — determines provider tree |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain (`project.firebaseapp.com`) |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | Firestore project ID |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image uploads |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

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
| **Deterministic chat IDs** | `uid1_uid2` (sorted) ensures each user pair has exactly one chat — no duplicates |
| **Cloudinary for images** | Products uploaded via unsigned preset; URLs stored in Firestore |
| **Farmer gatekeeper (getUserData)** | Security rules read the user's `/users` doc at database level to verify `role == 'farmer'` before allowing product creation |
| **Realtime DB for presence/typing** | Offloads high-frequency, transient state from Firestore to save costs and reduce latency |
| **Dual-environment architecture** | Single codebase, two entry points — `EnvironmentContext` + `ServiceContext` route to mock or real services at build time |

---

## Roadmap

- [x] **Phase 1** — Discovery, Profiles, Checkout
- [ ] **Phase 2** — Role-Based Auth, Farmer Dashboard, Messaging (In Progress)
  - [x] Step 1: Role-Based Authentication & Onboarding
  - [x] Step 2.1: Firestore Schema (Users Collection)
  - [x] Step 2.2: Real-time Messaging System
  - [x] Step 3: Product Addition with Image Upload
  - [x] Step 4: Farmer Gatekeeper Security Rules
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
