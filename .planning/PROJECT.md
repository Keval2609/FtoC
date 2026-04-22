# Bridging Natural Farmers and Conscious Consumers

## What We're Building
A transparent, trust-based mobile-first web marketplace that directly connects small-scale natural farmers with eco-conscious consumers. The platform bypasses traditional middlemen to ensure traceability, fair pricing, and direct storytelling, ultimately empowering farmers and building consumer trust.

## Core Value
Establishing direct, verifiable trust between natural farmers and health-conscious consumers through transparency and direct trade.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mobile-first Web App | Ensures high accessibility for consumers while keeping the tech barrier low for MVP. | Decided |
| Storytelling Profiles & Certifications | Core mechanism to build trust and prove authenticity without needing extreme tech in MVP. | Decided |
| Comprehensive Engagement | Incorporating community features, messaging, and logistics to create a sticky platform experience. | Decided |

## Tech Stack
**Frontend:**
- React + Vite (UI framework)
- Tailwind CSS (Mobile-first styling)
- PWA (Offline + installable)
- React Router DOM (Routing)

**Backend:**
- Firestore (NoSQL database)
- Firebase Auth (Login / signup)
- Firebase Storage (Product images)
- Firebase Functions (Optional)

**Deploy:**
- Vercel (Free hosting + CDN)
- GitHub (Version control + CI)

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] **Discovery & Marketplace:** Consumers can browse farms, available natural produce, and purchase directly.
- [ ] **Storytelling Profiles:** Farmers have rich profiles detailing their methods, stories, and practices.
- [ ] **Trust & Verification:** Farmers can upload organic/natural certificates or evidence for verification.
- [ ] **Logistics & Delivery:** Workflows to track and fulfill orders from farm to consumer.
- [ ] **Direct Communication:** Direct messaging or communication tools between consumer and farmer.
- [ ] **Community Hub:** Forums, seasonal recipes, and local farm events to engage users.
- [ ] **Monetization Engine:** Infrastructure for transaction fees, farmer subscriptions, or memberships.

### Out of Scope
- [To be defined during detailed scoping]

---
*Last updated: 2026-04-19 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
