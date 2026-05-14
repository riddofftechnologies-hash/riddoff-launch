---
name: SaaS Education Admin
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 32px
  gutter: 24px
---

## Brand & Style
The design system is engineered for high-density information environments where clarity and speed are paramount. It adopts a **Corporate / Modern** aesthetic, specifically tailored for Educational SaaS platforms. The visual language prioritizes utility and professional trust, utilizing a systematic approach to whitespace and hierarchy to ensure that complex administrative tasks feel manageable.

The emotional response should be one of "controlled efficiency." By using a clean, structured layout with refined transitions, the interface recedes to let the data lead, while providing clear, bold signals for critical actions.

## Colors
The palette is rooted in a professional **Deep Indigo** primary, chosen for its authoritative yet modern feel in the education sector. 

- **Primary (#4F46E5):** Reserved for high-intent actions, primary buttons, and active navigation states.
- **Secondary / Slate (#64748B):** Used for icons, secondary text, and metadata to provide contrast without competing with the primary actions.
- **Background & Surfaces:** The main workspace uses a very light gray (#F8FAFC) to create a subtle distinction from white cards (#FFFFFF), which house the content.
- **Accents:** Semantic colors follow standard conventions—Emerald for success/completion, Rose for destructive/error states, and Amber for warnings or pending levels.

## Typography
This design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic weight distribution. 

The type scale is optimized for data density. **Body-md (14px)** is the workhorse for table data and form inputs, while **Label-sm** uses uppercase styling with increased letter spacing for category headers and table column titles. Section titles utilize **Headline-lg** with negative letter-spacing to maintain a compact, modern feel even at larger sizes.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains fixed at a specific width (280px), while the main dashboard content area expands fluidly.

- **Grid:** A 12-column system is used for dashboard widgets.
- **Rhythm:** An 8px linear scale (4px, 8px, 16px, 24px, 32px) governs all padding and margins. 
- **Density:** To accommodate large datasets, internal table padding and list items may use the 8px (sm) or 12px increments to maximize visible information without sacrificing touch targets.
- **Breakpoints:** On tablets, the sidebar collapses into a hamburger menu, and the 12-column grid reflows to a 6-column layout. On mobile, all columns stack vertically with a standard 16px margin.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Ambient Shadows**. 

The base level is the workspace background. Level 1 (Cards, Sidebar) sits immediately above this, using a 1px border (#E2E8F0) and a very soft, diffused shadow (0px 1px 3px rgba(0,0,0,0.05)) to separate it from the background.

Level 2 (Modals, Dropdowns) uses a more pronounced shadow (0px 10px 15px -3px rgba(0,0,0,0.1)) to indicate interactivity and temporary focus. Elements do not use heavy blurs; instead, they rely on crisp borders and subtle value shifts to establish hierarchy.

## Shapes
The design system employs a **Rounded** (0.5rem / 8px) corner radius for most UI components including buttons, input fields, and cards. This strikes a balance between the precision of a professional tool and the approachability required for an educational platform.

- **Small Components (Chips, Badges):** These may use a full pill-shape (999px) to distinguish them from interactive buttons.
- **Inputs:** Maintain the 8px radius to ensure a consistent visual rhythm across form-heavy pages.

## Components

### Sidebar & Navigation
The sidebar uses a clean white background with Indigo text and icons for active states. Active items are highlighted with a subtle Indigo background (10% opacity) and a 4px vertical bar on the left edge.

### Data Tables
Tables are the core of the experience. They use a "Flush" design—no outer borders for the table itself, but thin horizontal dividers (#F1F5F9). Column headers are `label-sm` in Slate. Action menus (triple-dot) appear on hover at the end of each row.

### Statistics Cards
These feature a large value (Display-lg), a descriptive label (Label-md), and a trend indicator in the bottom corner (Emerald for positive, Rose for negative). Icons are placed in the top right within a 40x40px rounded container.

### Forms & Inputs
Labels are positioned above fields using `label-md`. Input fields use a 1px Slate border that transitions to Indigo on focus. Error states are signaled by a Rose border and a small helper text below the field.

### Status Badges
Badges use a "Soft Fill" style: a light background version of the semantic color (e.g., light emerald) with dark emerald text for high contrast and readability.

### Rich Text & Uploads
Image upload placeholders utilize a dashed border (#CBD5E1) with a centered icon and "Drag and drop" text. Rich text areas use a simple top-bar toolbar with minimal icons to maintain the clean aesthetic.