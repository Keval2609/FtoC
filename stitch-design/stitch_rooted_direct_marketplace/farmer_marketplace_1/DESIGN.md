---
name: Farmer Marketplace
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#434843'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#496458'
  on-secondary: '#ffffff'
  secondary-container: '#c9e7d7'
  on-secondary-container: '#4e685c'
  tertiary: '#261200'
  on-tertiary: '#ffffff'
  tertiary-container: '#422401'
  on-tertiary-container: '#b7895b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#cce9da'
  secondary-fixed-dim: '#b0cdbe'
  on-secondary-fixed: '#052016'
  on-secondary-fixed-variant: '#324c41'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f0bd8b'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#623f18'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  button:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin: 32px
  container-max: 1280px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 80px
---

## Brand & Style
The core philosophy of this design system is "Grounded Transparency." It is built to bridge the gap between the raw, honest nature of agriculture and the efficiency of a modern digital marketplace. The visual direction avoids the clinical coldness of typical e-commerce, opting instead for a **Minimalist-Tactile** hybrid style. 

The design system prioritizes high-quality whitespace and intentional "breathing room" to reflect the openness of the outdoors. It speaks to an audience that values sustainability, provenance, and the human story behind their food. The emotional response should be one of quiet confidence, reliability, and warmth. Every interaction is designed to reinforce "Direct Verifiable Trust," moving away from flashy marketing toward clear, evidence-based communication.

## Colors
The palette is derived directly from the landscape. The primary **Deep Forest Green** provides a sturdy foundation of authority and growth. **Soft Sage** acts as the functional secondary color, used for secondary actions and subtle backgrounds.

**Warm Earth Tones** (Clay and Sand) are used sparingly to highlight interactive elements or storytelling sections, providing a physical, "of-the-earth" contrast to the greens. Surfaces utilize **Crisp White** for clarity, while **Bone/Sand** neutrals are used for container backgrounds to soften the overall UI and reduce eye strain, moving away from the harshness of pure digital white.

## Typography
This design system employs a sophisticated typographic pairing to balance heritage with utility. **Newsreader** is the voice of the brand; its organic, slightly irregular serif strokes convey trust, storytelling, and an artisanal quality. It should be used for all editorial headings and farmer bios.

**Work Sans** provides the functional backbone. It was chosen for its grounded, reliable, and highly legible character. It handles all UI-specific tasks, including navigation, product specifications, and data points. To maintain an "organic" feel, body copy uses a slightly more generous line height (1.6) to ensure the interface feels spacious and easy to navigate.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop (12 columns) to ensure content remains centered and readable. Spacing is governed by an 8px rhythmic scale. 

Emphasis is placed on vertical "stacking" rather than crowding elements horizontally. Large section paddings (80px+) are used to separate different farmer stories or product categories, allowing each "origin" to feel distinct. Gutters are kept wide (24px) to prevent the UI from feeling congested, mirroring the open spaces of the farms themselves.

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** and **Tonal Layers** rather than heavy drop shadows. Surfaces should appear to sit just slightly above the background, like thick cardstock.

- **Level 0 (Background):** Uses the Sand or Bone neutral colors.
- **Level 1 (Cards/Sections):** Pure white with a very soft, diffused shadow (Blur: 12px, Y: 4px, Opacity: 4% Black).
- **Level 2 (Interactive/Hover):** Shadow increases slightly in spread and a thin, 1px Soft Sage border is added to indicate focus.

Avoid all heavy blurs or vibrant glassmorphism; the goal is a tactile, matte paper-like feel.

## Shapes
The shape language is defined by **Soft Rounded Corners**. A base radius of 0.5rem (8px) is applied to buttons and small inputs to make them feel approachable and "hand-finished." 

Larger containers, such as product cards and imagery, utilize a 1rem (16px) radius to create a gentle, welcoming frame. Icons should follow this logic, using rounded terminals and soft joins to avoid any aggressive or overly-corporate sharp points.

## Components

### Verified Badges
The hallmark of this design system. These badges use a "Stamp" metaphor. They are circular or slightly irregular in shape, utilizing the **Deep Forest Green** for the icon and a light **Soft Sage** background. They must include a "Trust Indicator" (e.g., a small tooltip or link) that explains exactly how the data was verified.

### Buttons
- **Primary:** Solid Deep Forest Green with white text. High contrast, slightly rounded (8px).
- **Secondary:** Clay/Sand background with Deep Forest Green text. Used for "Learn More" or secondary browsing.
- **Ghost:** Transparent with a 1px Sage border for less frequent actions.

### Cards
Product and Farmer cards use a white background on a Bone surface. They feature a soft shadow and a subtle 1px "Earth" border at the bottom. Images within cards should have a slightly desaturated, natural color profile.

### Inputs & Selection
Text fields use a Bone background with a Forest Green bottom border that expands on focus. Checkboxes and radio buttons use the Forest Green for the "selected" state, reinforcing the eco-conscious theme.

### Transparency Indicators
Small, label-style components (label-sm) with a Soft Sage background. These appear next to pricing or logistics data to show "Direct-to-Farmer" percentages or carbon footprint data, using clear, bold Work Sans typography.