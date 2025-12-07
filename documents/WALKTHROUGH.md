# MenuFight UI/UX Verification & Implementation Walkthrough

This document tracks the comprehensive UI/UX audit and implementation plan to elevate MenuFight to a premium agency-standard SaaS landing page.

## 🟢 Phase 1: Foundation & Cleanup
User Interface, Typography, and Asset Management.

- [x] **Typography Cleanup**
  - [x] Remove unused `Merriweather` font import from `app/layout.tsx` to improve load performance.
  - [x] Define global text utility classes in `globals.css` for a strict type scale (Hero, H1, H2, Body).
  - [x] Increase default line-height (`leading-relaxed`) for body text globally.

- [ ] **Color System Refinement**
  - [ ] Consolidate hardcoded hex grays (e.g., `#2a2a2a`) into Tailwind theme variables (`brand-gray-dark`, etc.).
  - [ ] Implement the **"Blue Glow"** accent color (`#2D7FF9`) for data visuals (charts/bars) to distinguish from the "Action Yellow".
  - [ ] Standardize shadow utilities to a single `--shadow-card` variable for consistency.

## 🟡 Phase 2: Structural & Layout Features
Core section flow and user journey improvements.

- [ ] **Hero Section Mobile Fix**
  - [ ] Update `Hero.tsx` flex/grid layout to ensure the visual card doesn't overlap text on mobile screens (use `flex-col-reverse` or similar).

- [ ] **Section Transitions**
  - [ ] Add a visual bridge (curved divider or subtle gradient) between the **Hero** (Yellow) and **Steps** (White) sections to reduce visual harshness.

- [ ] **Testimonials & FAQ Restructuring**
  - [ ] **Rename:** Rename `components/home/Testimonials.tsx` to `components/home/FAQ.tsx` to match its actual content.
  - [ ] **New Component:** Create a *real* `components/home/Testimonials.tsx` section featuring 3 cards with user social proof (quotes/avatars).
  - [ ] **FAQ Layout:** Refactor FAQ to a 2-column layout (Left: Heading/Context, Right: Accordion) for better desktop use.

## 🟠 Phase 3: Component Polish
Interactive elements and visual consistency.

- [ ] **Button & Interactive States**
  - [ ] Audit all buttons for consistent border-radius (Pill vs Rounded Corners).
  - [ ] Ensure all buttons have a visible `:focus-visible` ring for accessibility.
  - [ ] Standardize hover animations (e.g., specific scale/lift values).

- [ ] **Visual Hierarchy**
  - [ ] Enhace the "Try the Editor" link in Step 1 to a secondary button style to capture high-intent users early.
  - [ ] Update `BattlesGrid` (Card 3) to use the new **Blue** color for the progress bar to signify "Data/Science".

## 🔴 Phase 4: Final Accessibility & QA
Ensuring the site is usable for everyone.

- [ ] **Contrast Verification**
  - [ ] Audit all gray text (`text-gray-400`/`500`). Darken to `text-gray-600` where on white backgrounds to meet WCAG AA standards.
- [ ] **Responsive Testing**
  - [ ] Verify 3-column grids on tablet/mobile break correctly with sufficient vertical gap.

---

## 📝 Change Log

| Date | Change | Status |
| :--- | :--- | :--- |
| 2025-12-07 | Initial Audit & Plan Created | Pending |
