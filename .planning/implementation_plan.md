# Phase 1: TerraDirect Marketplace — Discovery, Profiles & Checkout

Build a high-performance, mobile-first PWA marketplace for natural farmers using React (Vite), Tailwind CSS, and Firebase.

## User Review Required

> [!IMPORTANT]
> **Firebase Project**: You'll need an active Firebase project with Firestore, Auth (Email/Google), and Storage enabled. I'll scaffold with placeholder config — you'll swap in real keys via `.env`.

> [!WARNING]
> **Stitch Design Images**: The Stitch HTML designs reference Google-hosted `lh3.googleusercontent.com` images. For the MVP, I'll use the same URLs as placeholders. For production, these move to Firebase Storage.

## Resolved Decisions

| Question | Decision |
|---|---|
| Auth Scope | ✅ Full consumer auth (Email + Google sign-in) with Login & Signup pages |
| Dark Mode | ✅ Dark/light toggle using `farmer_marketplace_2` dark tokens |
| Payment | Mock checkout — writes order to Firestore, no Stripe integration |

---

## Proposed Changes

### 1. Project Scaffolding

#### [NEW] Vite + React + Tailwind project at `d:\F2C`

Scaffold using `npx create-vite@latest ./ --template react` then install dependencies:

```
Dependencies:
- react-router-dom (routing)
- firebase (backend)
- tailwindcss + postcss + autoprefixer (styling)
- vite-plugin-pwa (PWA support)
- workbox-precaching, workbox-routing (service worker)
```

Key config files:
- `vite.config.js` — PWA plugin config, port, alias
- `tailwind.config.js` — Full design token extraction from DESIGN.md
- `postcss.config.js` — Tailwind + autoprefixer
- `index.html` — Google Fonts (Newsreader, Work Sans), Material Symbols, meta tags

---

### 2. Design System (extracted from Stitch) — Light + Dark

#### [NEW] `tailwind.config.js`

Extract tokens from BOTH design systems:

| Token Category | Light Source | Dark Source | Tailwind Key |
|---|---|---|---|
| 50+ color tokens | `farmer_marketplace_1/DESIGN.md` | `farmer_marketplace_2/DESIGN.md` | `theme.extend.colors` (light default, `dark:` overrides) |
| 7 typography scales | Same across both | Same across both | `theme.extend.fontSize` + `fontFamily` |
| Border radii | `rounded:` block | `rounded:` block | `theme.extend.borderRadius` |
| Spacing (8px grid) | `spacing:` block | `spacing:` block | `theme.extend.spacing` |

`darkMode: 'class'` — toggled by adding/removing `.dark` on `<html>`. Dark mode colors from `farmer_marketplace_2` are mapped as CSS custom properties under `.dark`.

#### [NEW] `src/index.css`

Global styles matching Stitch:
- CSS custom properties for light/dark color tokens (`:root` and `.dark` selectors)
- Ambient shadow utilities (`.ambient-shadow`, `.ambient-shadow-hover`) — adapts for dark mode
- Form input styling (Bone/Stone background based on mode, Forest Green focus border)
- Verified badge `.verified-badge` component class
- Base typography reset with Work Sans body, Newsreader headings
- Smooth `transition: background-color 0.3s, color 0.3s` for theme switching

---

### 3. Firebase Configuration

#### [NEW] `src/lib/firebase.js`

Firebase app initialization with env-based config (`VITE_FIREBASE_*` env vars). Exports `auth`, `db`, `storage` instances.

#### [NEW] `src/lib/auth.js`

Auth helper functions:
- `signUpWithEmail(email, password, displayName)` — `createUserWithEmailAndPassword` + `updateProfile`
- `signInWithEmail(email, password)` — `signInWithEmailAndPassword`
- `signInWithGoogle()` — `signInWithPopup(GoogleAuthProvider)`
- `signOut()` — `signOut(auth)`
- `onAuthChange(callback)` — `onAuthStateChanged` wrapper

#### [NEW] `src/lib/firestore.js`

Firestore helper functions:
- `getFarmers()` — query `farmers` collection
- `getFarmerById(id)` — single farmer doc
- `getProductsByFarmer(farmerId)` — subcollection or filtered query
- `createOrder(orderData)` — write to `orders` collection

#### [NEW] Firestore Schema (documented in code)

```
farmers/
  ├── name: string
  ├── ownerName: string
  ├── story: string (rich text)
  ├── location: string
  ├── established: string
  ├── verificationStatus: "verified" | "pending" | "unverified"
  ├── certifications: [{name, issuedDate, id, description, verifiedBy}]
  ├── methods: [{title, icon, description}]
  ├── imageUrl: string
  ├── directPercentage: number
  └── products/ (subcollection)
        ├── name: string
        ├── price: number
        ├── unit: string
        ├── imageUrl: string
        └── inStock: boolean

orders/
  ├── userId: string
  ├── items: [{productId, farmerId, farmerName, name, qty, price}]
  ├── contactInfo: {email, firstName, lastName}
  ├── shippingAddress: {street, city, state, zip}
  ├── subtotal: number
  ├── deliveryFee: number
  ├── platformFee: number
  ├── total: number
  ├── status: "Pending" | "Confirmed" | "Shipped" | "Delivered"
  └── createdAt: timestamp
```

#### [NEW] `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Farmers: anyone can read, only authenticated owner can write
    match /farmers/{farmerId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == farmerId;
    }
    // Products: anyone can read
    match /farmers/{farmerId}/products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == farmerId;
    }
    // Orders: only the authenticated user who created it
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

### 4. Routing, Layout & Auth Context

#### [NEW] `src/App.jsx`

React Router setup with five routes:
- `/` → Discovery Dashboard
- `/farmer/:id` → Farmer Profile
- `/checkout` → Checkout Flow (protected — redirects to `/login` if not auth'd)
- `/login` → Login Page
- `/signup` → Signup Page

#### [NEW] `src/components/layout/AppShell.jsx`

Responsive layout wrapper:
- **Desktop**: Sticky top `<header>` with logo, nav links (Home, Farmers, Cart, Profile/Login), search icon, **dark mode toggle** — matches [discovery code.html L120-136](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/farmer_discovery/code.html#L120-L136)
- **Mobile**: Fixed bottom `<nav>` bar with icons — matches [discovery code.html L303-320](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/farmer_discovery/code.html#L303-L320)
- `max-w-container-max mx-auto` wrapper for content
- Dark mode toggle button: sun/moon icon, toggles `.dark` class on `<html>`, persists preference to `localStorage`

#### [NEW] `src/context/AuthContext.jsx`

React Context for authentication state:
- `user` — current Firebase user or null
- `loading` — auth state loading indicator
- `signUp`, `signIn`, `signInGoogle`, `logout` — wrappers around `src/lib/auth.js`
- Wraps `onAuthStateChanged` in a `useEffect`

#### [NEW] `src/context/CartContext.jsx`

React Context for shopping cart state:
- `addItem(product, farmer)`, `removeItem(id)`, `updateQty(id, qty)`
- `cartItems`, `cartTotal`, `cartCount`
- Persists to `localStorage` for offline resilience

#### [NEW] `src/context/ThemeContext.jsx`

React Context for dark/light mode:
- `theme` — `'light'` or `'dark'`
- `toggleTheme()` — flips `.dark` on `document.documentElement`
- Reads initial preference from `localStorage`, falls back to `prefers-color-scheme`

---

### 5. View Components

#### Discovery Dashboard (DISCO-01)

Matches: [farmer_discovery/code.html](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/farmer_discovery/code.html) + [farmer_discovery/screen.png](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/farmer_discovery/screen.png)

| File | Purpose |
|---|---|
| `src/pages/DiscoveryPage.jsx` | Page shell — hero header, search bar, filter chips, card grid, "Load More" |
| `src/components/discovery/SearchBar.jsx` | Search input with Material icon, debounced Firestore query |
| `src/components/discovery/FilterChips.jsx` | Chip buttons: Regenerative, Local, Organic, Filters |
| `src/components/discovery/FarmerCard.jsx` | Card with image, verified/pending badge overlay with tooltip, farm name, owner, product tags, direct % badge, "View Profile" CTA |

Key design details from Stitch:
- Images: `saturate-50 group-hover:saturate-100` + `group-hover:scale-105` transitions
- Badge overlay: `bg-secondary-container/90 backdrop-blur-sm rounded-full` with tooltip on hover
- Card: `ambient-shadow ambient-shadow-hover` + bottom border `border-surface-tint/20`

---

#### Farmer Profile (PROF-01, VERIF-01)

Matches: [farmer_profile_proof/code.html](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/farmer_profile_proof/code.html) + [farmer_profile_proof/screen.png](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/farmer_profile_proof/screen.png)

| File | Purpose |
|---|---|
| `src/pages/FarmerProfilePage.jsx` | Page shell — fetches farmer by `:id` param, renders sections |
| `src/components/profile/HeroSection.jsx` | 12-col grid: story text (5 cols) + hero image (7 cols). Verified badge, farm name (display-xl), owner subtitle, "Our Story" block, location/established stats |
| `src/components/profile/MethodsSection.jsx` | 3-col grid of practice cards (icon in circle + title + description), top gradient bar |
| `src/components/profile/ProductGrid.jsx` | 4-col responsive grid of product cards with "Add" buttons wired to CartContext |
| `src/components/profile/VerificationGallery.jsx` | 2-col grid of certification cards with document icon, cert name, issued date, ID, checkmark, description |

---

#### Checkout Flow (BUY-01) — Protected Route

Matches: [secure_checkout/code.html](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/secure_checkout/code.html) + [secure_checkout/screen.png](file:///d:/F2C/stitch-design/stitch_rooted_direct_marketplace/secure_checkout/screen.png)

| File | Purpose |
|---|---|
| `src/pages/CheckoutPage.jsx` | 12-col layout: left (7 cols) forms + right (5 cols) sticky order summary. **Protected** — redirects unauthenticated users to `/login?redirect=/checkout` |
| `src/components/checkout/ContactForm.jsx` | Email, first/last name inputs — **pre-filled** from `AuthContext.user` |
| `src/components/checkout/DeliveryForm.jsx` | Street, city, state, zip inputs |
| `src/components/checkout/PaymentForm.jsx` | Card number, expiration, CVV + "Secure" lock badge (mock — no real payment) |
| `src/components/checkout/OrderSummary.jsx` | Cart items with farmer attribution, subtotal/delivery/platform fee breakdown, "Place Order" button, confirmation overlay |

Key design details from Stitch:
- "Direct-to-Farmer Purchase" badge: `bg-secondary-container/50` with handshake icon
- Farmer attribution per item: `"From: {farmerName}"` label
- Confirmation overlay: Full-screen modal with verified icon and farmer names highlighted

---

#### Consumer Auth (Login & Signup)

| File | Purpose |
|---|---|
| `src/pages/LoginPage.jsx` | Centered card with email/password form, "Sign in with Google" button, link to signup. TerraDirect branding, nature-themed hero illustration. |
| `src/pages/SignupPage.jsx` | Centered card with name, email, password, confirm password. Google signup option. Link to login. |
| `src/components/auth/GoogleSignInButton.jsx` | Styled Google sign-in button (Forest Green outline, Google icon) |
| `src/components/auth/ProtectedRoute.jsx` | Route wrapper — checks `AuthContext.user`, redirects to `/login` if null |

Design language for auth screens (no Stitch reference — new design):
- Centered card on `surface-container-low` background (light) / `surface-container` (dark)
- TerraDirect logo + tagline at top
- Inputs follow Stitch form styling (Bone bg, Forest Green bottom-border focus)
- Primary button: Deep Forest Green
- Divider with "or continue with" text
- Google button: Ghost variant with Google logo
- Footer link: "Don't have an account? Sign up" / "Already have an account? Log in"

---

### 6. Shared Components

| File | Purpose |
|---|---|
| `src/components/ui/VerifiedBadge.jsx` | Reusable badge (Verified/Pending) with tooltip |
| `src/components/ui/TransparencyIndicator.jsx` | "100% Direct" / "85% Direct" label component |
| `src/components/ui/ProductCard.jsx` | Product card used in profile grid with Add-to-cart |
| `src/components/ui/LazyImage.jsx` | Wrapper with `loading="lazy"`, srcSet, error fallback placeholder |
| `src/components/ui/Button.jsx` | Primary / Secondary / Ghost variants per DESIGN.md |
| `src/components/ui/ThemeToggle.jsx` | Sun/moon icon button — calls `ThemeContext.toggleTheme()`, smooth icon rotation animation |

---

### 7. PWA & Offline Support

#### [NEW] `vite.config.js` — VitePWA plugin

```js
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'TerraDirect',
    short_name: 'TerraDirect',
    theme_color: '#1b3022',
    background_color: '#faf9f7',
    display: 'standalone',
    icons: [/* 192, 512px icons */]
  },
  workbox: {
    runtimeCaching: [
      { urlPattern: /^https:\/\/lh3\.googleusercontent\.com/, handler: 'CacheFirst' },
      { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/, handler: 'StaleWhileRevalidate' },
      { urlPattern: /\/api\//, handler: 'NetworkFirst' }
    ]
  }
})
```

#### [NEW] `public/manifest.json`

Standard PWA manifest with TerraDirect branding.

---

### 8. Image Optimization

- **`LazyImage` component**: Native `loading="lazy"` + Intersection Observer fallback
- **`srcSet`**: Multiple sizes for responsive images (`320w`, `640w`, `1024w`)
- **Error handling**: `onError` handler swaps to a neutral placeholder SVG
- **Desaturation effect**: CSS `saturate-50` on load, `saturate-100` on hover (per Stitch design)

---

## File Tree Summary

```
d:\F2C\
├── index.html
├── .env.example
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── firestore.rules
├── public/
│   └── manifest.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── lib/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   └── firestore.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── VerifiedBadge.jsx
│   │   │   ├── TransparencyIndicator.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── LazyImage.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── auth/
│   │   │   ├── GoogleSignInButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── discovery/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterChips.jsx
│   │   │   └── FarmerCard.jsx
│   │   ├── profile/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── MethodsSection.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── VerificationGallery.jsx
│   │   └── checkout/
│   │       ├── ContactForm.jsx
│   │       ├── DeliveryForm.jsx
│   │       ├── PaymentForm.jsx
│   │       └── OrderSummary.jsx
│   └── pages/
│       ├── DiscoveryPage.jsx
│       ├── FarmerProfilePage.jsx
│       ├── CheckoutPage.jsx
│       ├── LoginPage.jsx
│       └── SignupPage.jsx
└── stitch-design/  (existing — reference only)
```

## Verification Plan

### Automated Tests
1. `npm run dev` — verify dev server starts without errors
2. `npm run build` — verify production build succeeds
3. Browser testing via browser subagent:
   - Navigate Discovery → verify farmer cards render with badges
   - Click "View Profile" → verify farmer profile loads with story, methods, products, certifications
   - Add products to cart → verify cart count updates
   - Try `/checkout` while logged out → verify redirect to `/login`
   - Login page → verify email/password form and Google button render
   - Signup page → verify form renders with all fields
   - Navigate to checkout after login → verify order summary with correct items and farmer attribution
   - Toggle dark mode → verify colors switch correctly
   - Verify mobile bottom nav appears at < 768px viewport
   - Verify PWA manifest loads correctly

### Manual Verification
- Test offline: disable network in DevTools, verify cached farmer profiles still render
- Test on mobile viewport (375px): verify all five views are fully responsive
- Compare rendered UI against Stitch `screen.png` screenshots for pixel-accuracy
- Verify dark mode persistence: toggle to dark, refresh page, confirm dark persists
