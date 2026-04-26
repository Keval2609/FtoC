# Production inventory/discovery data-alignment design

**Date:** 2026-04-26  
**Status:** Approved for planning  
**Scope:** Fix production-only issue where farmer inventory and discovery listings appear empty after onboarding and product creation.

## Problem

In production, farmer inventory and farmer discovery can both appear empty. The immediate user impact is:

1. Farmers cannot reliably see listed products in dashboard inventory.
2. Customers cannot reliably see farmers in discovery.
3. The UI currently makes empty and failed-load states hard to distinguish.

## Goals

1. Ensure production farmer discovery lists farmers when records exist.
2. Ensure production dashboard inventory lists products for the logged-in farmer when records exist.
3. Ensure empty states only represent truly empty data.
4. Ensure fetch failures are surfaced as explicit error states with retry actions.

## Non-goals

1. No redesign of discovery/dashboard layouts.
2. No auth system redesign.
3. No broad schema rewrite unrelated to discovery/dashboard/inventory visibility.

## Recommended approach

Adopt **write+read alignment**:

1. Align write paths (onboarding/product-related data shape expectations).
2. Add backward-compatible read normalization for farmer/product views.
3. Add explicit page state handling: `loading | error | empty | data`.

This balances correctness and safety for existing production documents while avoiding a disruptive migration-first strategy.

## Architecture and boundaries

### Data contract layer (`src/lib/firestore.js`)

This is the source of truth for query behavior and document shape normalization:

1. Normalize farmer documents returned by `getFarmers` so discovery consumers always receive stable keys used in UI rendering.
2. Keep seller-filtered product reads deterministic and shape-safe for dashboard consumption.
3. Propagate Firestore errors (do not collapse failures into empty arrays).

### Page rendering layer (`src/pages/DiscoveryPage.jsx`, `src/pages/FarmerDashboardPage.jsx`)

Pages remain responsible for view state only:

1. Show loading UI while fetching.
2. Show error UI (with retry) on fetch failure.
3. Show empty UI only on successful empty result.
4. Show data UI when records exist.

## Component and data-flow design

### 1) Onboarding/product consistency (write-alignment)

Ensure onboarding/profile flows maintain a consistent shape needed by farmer/discovery surfaces, and that farmer-facing product reads match written fields (`sellerId`, `createdAt`, etc.).

For profile updates that are constrained by full-document validation rules, use a read-merge-write strategy that preserves required immutable fields (e.g., role/createdAt) while updating onboarding fields.

Key design rule: write paths must not produce data shapes that are incompatible with the fields discovery/dashboard expect.

### 2) Farmer discovery read normalization

`getFarmers` returns normalized objects that safely provide:

- `id`
- `name`
- `ownerName`
- `location`
- `primaryProducts`
- `verificationStatus`

Normalization must tolerate legacy documents that may use alternate or partial fields.

### 3) Farmer dashboard inventory read behavior

`getMyProducts` / `getProductsByFarmer` stays sellerId-filtered and sorted by recency; returned records are normalized for table-safe rendering (e.g., missing description/image fallback handling).

## Error handling design

1. Firestore operations used by discovery/dashboard throw or return explicit failures.
2. Discovery/dashboard catch failures in page-level state and render error blocks with retry.
3. Empty state is rendered only when a fetch succeeds and returns zero rows.

This prevents silent failures being misinterpreted as no data.

## UX state behavior

### Discovery page

1. **Loading:** existing skeleton cards.
2. **Error:** centered error message + retry button.
3. **Empty success:** “No farms available yet” (or search-empty variant when filters/search active).
4. **Data:** farmer card grid.

### Farmer dashboard

1. **Loading:** existing spinner/skeleton behavior.
2. **Error:** inventory load error message + retry button.
3. **Empty success:** clear “No listings yet” guidance with add-listing CTA.
4. **Data:** inventory table and summary footer.

## Validation strategy

Validate through existing production-oriented app flows:

1. Farmer onboarding produces discoverable farmer records.
2. Product creation produces dashboard-visible inventory for the same farmer.
3. Discovery shows farmer cards when farmer docs exist.
4. True empty collections show empty states.
5. Simulated/forced fetch failure paths show error states (not empty states).

## Files in scope

1. `src/lib/firestore.js`
2. `src/pages/DiscoveryPage.jsx`
3. `src/pages/FarmerDashboardPage.jsx`

## Risks and mitigations

1. **Risk:** Legacy documents with inconsistent fields.
   **Mitigation:** Normalize on read with explicit defaults.
2. **Risk:** Masking backend failures as empty data.
   **Mitigation:** Separate error and empty page states.
3. **Risk:** Over-refactoring unrelated logic.
   **Mitigation:** Limit changes to listed files and visibility-related paths only.

## Implementation-ready acceptance criteria

1. Production discovery renders farmer cards for existing farmer docs.
2. Production farmer dashboard renders listed products for the logged-in farmer.
3. Empty and error states are visually distinct in both pages.
4. Retry action is available on load failure in both pages.
5. No unrelated behavior changes outside the defined scope.
