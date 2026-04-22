---
name: Farmer Marketplace
colors:
  surface: '#121412'
  surface-dim: '#121412'
  surface-bright: '#383a37'
  surface-container-lowest: '#0d0f0d'
  surface-container-low: '#1a1c1a'
  surface-container: '#1e201e'
  surface-container-high: '#282a28'
  surface-container-highest: '#333533'
  on-surface: '#e2e3df'
  on-surface-variant: '#c4c8c0'
  inverse-surface: '#e2e3df'
  inverse-on-surface: '#2f312f'
  outline: '#8e928b'
  outline-variant: '#444842'
  surface-tint: '#bccbb9'
  primary: '#bccbb9'
  on-primary: '#273427'
  primary-container: '#2d3a2d'
  on-primary-container: '#95a493'
  inverse-primary: '#546253'
  secondary: '#b6ccb6'
  on-secondary: '#223525'
  secondary-container: '#3a4e3d'
  on-secondary-container: '#a8bea8'
  tertiary: '#cec5be'
  on-tertiary: '#352f2b'
  tertiary-container: '#3b3631'
  on-tertiary-container: '#a79e98'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e7d4'
  primary-fixed-dim: '#bccbb9'
  on-primary-fixed: '#121e13'
  on-primary-fixed-variant: '#3d4a3c'
  secondary-fixed: '#d1e9d1'
  secondary-fixed-dim: '#b6ccb6'
  on-secondary-fixed: '#0d1f11'
  on-secondary-fixed-variant: '#384b3a'
  tertiary-fixed: '#ebe1da'
  tertiary-fixed-dim: '#cec5be'
  on-tertiary-fixed: '#1f1b17'
  on-tertiary-fixed-variant: '#4c4641'
  background: '#121412'
  on-background: '#e2e3df'
  surface-variant: '#333533'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system evokes a sense of prestige, heritage, and "farm-to-table" authenticity through an elevated dark aesthetic. The brand personality is grounded and artisanal, catering to users who value quality, sustainability, and the tactile nature of agriculture.

The design style follows **Modern Minimalism** with **Tactile** influences. By utilizing deep, organic tones and crisp serif typography, the interface feels like a premium editorial magazine. The emotional response is one of trust and calm, removing the "tech" friction from the agricultural commerce experience.

## Colors

The palette is anchored by "Deep Forest Green" and "Dark Stone Gray," creating a high-contrast environment that remains easy on the eyes. 

- **Primary:** A deep forest green used for key brand moments and heavy-weight backgrounds.
- **Secondary:** A muted sage used for interactive elements, accents, and highlighting successful states.
- **Tertiary:** An earthy umber used for structural dividers and subtle decorative elements to ground the greens.
- **Neutral:** A range of stone-tinted blacks and grays that form the foundation of the dark mode interface.

Backgrounds utilize a tiered system of dark stones to establish depth without relying on traditional shadows.

## Typography

This design system relies on the authoritative and literary quality of **Newsreader** for all editorial and headline content. This creates a clear distinction between narrative information and functional data. 

**Work Sans** serves as the utility workhorse, providing exceptional readability for product listings, pricing, and navigation in a dark environment. Headlines should maintain a slight negative letter-spacing to feel "tight" and premium, while labels use expanded tracking to ensure legibility against dark backgrounds.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system centered on a 12-column architecture for desktop. The spacing rhythm is strictly based on a 4px baseline grid to ensure vertical alignment of text and components.

Margins are generous to reflect the "open space" nature of farming. Large sections are separated by significant vertical padding (stack-lg) to allow the high-contrast typography to breathe.

## Elevation & Depth

In this dark mode environment, depth is conveyed through **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows. 

- **Surface Tiers:** As elements "rise" in the hierarchy, their background color becomes lighter (e.g., a card on the background uses `surface-low`).
- **Borders:** Use 1px solid borders in `tertiary` or `surface-high` to define boundaries between similar tonal areas.
- **Overlays:** For modals and menus, use a 40% blur backdrop with a subtle `primary` tint to maintain the organic feel.

## Shapes

The shape language is **Soft (1)**. This subtle rounding (4px for standard elements) provides a modern touch while maintaining the structural integrity and professional look of the marketplace. 

- **Standard Elements:** 0.25rem (inputs, buttons).
- **Cards & Containers:** 0.5rem (rounded-lg).
- **Featured Banners:** 0.75rem (rounded-xl) to draw attention to seasonal harvests.

## Components

### Buttons
- **Primary:** Solid `secondary_color_hex` (Sage) with black text. High visibility for the "Buy" or "Contact Farmer" actions.
- **Secondary:** Outlined with `secondary_color_hex`, 1px border.
- **Ghost:** Text-only, using `on-surface-medium`.

### Cards
Cards use the `surface-low` background with a 1px `surface-high` border. Newsreader headers within cards should be set to `headline-md`.

### Inputs & Selection
- **Inputs:** `surface-medium` background with a `surface-high` bottom border only to mimic traditional ledger styling.
- **Chips:** Small, pill-shaped tags using `tertiary` backgrounds for product categories like "Organic" or "Heirloom."

### Lists & Tables
Data-heavy lists use a `surface-lowest` background with `surface-medium` horizontal dividers. Use `label-md` for headers to ensure a clear distinction from the data rows.

### Additional Components
- **Seasonality Indicator:** A small circular badge with a muted glow effect to indicate currently harvesting crops.
- **Farmer Profile Snippet:** A tactile component featuring a desaturated circular avatar and serif bio text to humanize the marketplace.