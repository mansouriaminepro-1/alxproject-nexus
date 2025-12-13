# MenuFight Design System

**Version:** 1.0.0
**Status:** Active
**Last Updated:** December 13, 2025

---

## 1. Brand Foundations

MenuFight is a bold, modern, and playful SaaS platform that brings the excitement of competition to menu validation. Our design system reflects the energy of a "food battle" while maintaining the trust and clarity required for data-driven decisions.

### Brand Values
*   **Bold:** We are not afraid to stand out. Our visuals are high-contrast and impactful.
*   **Playful:** We make menu validation fun, not a chore. We use gamified elements and lively language.
*   **Data-Driven:** Behind the fun is serious validation. We present data with absolute clarity and precision.
*   **Chef-Centric:** We respect the craft. Our aesthetic honors the culinary world without mimicking it cheaply.

### Brand Personality & Tone
*   **Voice:** Confident, energetic, direct, and slightly competitive.
*   **Tone:** "The spirited referee." Fair, excited, and always rooting for the best dish to win.
*   **Do:** Use active verbs (Vote, Battle, Win). Be concise. Use culinary analogies sparingly but effectively.
*   **Don't:** Be overly corporate or dry. Don't use aggression; use "competition."

### Design Principles
1.  **Clarity First:** In a battle, you need to know who is winning exactly. Data visualization takes precedence over decoration.
2.  **Action Oriented:** Every screen should drive the user to the next step—whether it's creating a battle or voting.
3.  **Delight in Details:** Use micro-interactions to reward user actions (e.g., a "fire" animation when a vote is cast).

---

## 2. Color System

Our color palette is high-contrast, designed to differentiate "fighters" clearly.

### Primary Colors
Used for primary actions, branding, and key interface elements.

| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Fight Red** | `#C62626` | Primary CTAs, "Battle" elements, High emphasis |
| **Victory Gold** | `#F5A623` | Highlights, Winners, Top-tier actions |
| **Deep Charcoal** | `#1A1A1A` | Primary Text, Backgrounds for dark mode sections |

### Secondary & Accent Colors
Used to support the primary palette and add depth.

| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Vs Blue** | `#2D9CDB` | Informational links, secondary emphasis, Neutral ground |
| **Fresh Teal** | `#20C997` | Success states, Positive trends |
| **Sizzle Orange** | `#FD7E14` | High urgency notifications |

### Background Colors
| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Arena White** | `#FFFFFF` | Main content cards, Light mode backgrounds |
| **Fog Gray** | `#F8F9FA` | Page backgrounds, Input fields |
| **Night Mode** | `#121212` | Dark mode main background |

### Semantic Colors
| State | Color | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Success** | Green | `#28A745` | Validations, Success toasts, Positive growth |
| **Warning** | Yellow | `#FFC107` | Non-blocking errors, Attention needed |
| **Error** | Red | `#DC3545` | Destructive actions, Form errors |
| **Info** | Blue | `#17A2B8` | Help text, Neutral system messages |

### Usage Guidelines
*   **60-30-10 Rule:** Use 60% Neutral (White/Gray), 30% Secondary (Blue/Charcoal), 10% Primary (Red/Gold).
*   **Contrast:** "Fight Red" must only be used on White or Deep Charcoal backgrounds to maintain WCAG AA compliance.

---

## 3. Typography

We use a modern sans-serif pairing to convey modernity and readability.

### Font Families
*   **Headings:** `Inter`, sans-serif (Bold, Extra Bold)
*   **Body:** `Inter`, sans-serif (Regular, Medium)
*   **Mono:** `JetBrains Mono`, monospace (for code, IDs, or data tables)

### Type Scale

| Style | Size (rem/px) | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 3rem / 48px | 1.1 | 800 | Hero sections, Marketing headers |
| **H1** | 2.25rem / 36px | 1.2 | 700 | Page titles |
| **H2** | 1.875rem / 30px | 1.3 | 700 | Section headers |
| **H3** | 1.5rem / 24px | 1.4 | 600 | Card titles |
| **Body Large**| 1.125rem / 18px| 1.6 | 400 | Introductory text |
| **Body** | 1rem / 16px | 1.5 | 400 | Standard paragraph text |
| **Small** | 0.875rem / 14px| 1.5 | 400 | Meta data, Help text |
| **Tiny** | 0.75rem / 12px | 1.5 | 500 | Badges, Labels |

### Usage Examples
*   **Heads Up:** All H1 and H2 headings should use `Deep Charcoal` (`#1A1A1A`).
*   **Emphasis:** Use *Medium (500)* weight for emphasizing body text, not Bold.
*   **Links:** Links should be `Fight Red` or `Vs Blue` and underlined on hover only.

---

## 4. Spacing & Layout

We use a strict 4px baseline grid to ensure consistent rhythm.

### Spacing Scale
| Token | Value | rem | Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | 0.25 | Tight icon spacing |
| `space-2` | 8px | 0.5 | Component internal padding |
| `space-3` | 12px | 0.75 | Text to icon spacing |
| `space-4` | 16px | 1.0 | Standard padding |
| `space-6` | 24px | 1.5 | Section separation (small) |
| `space-8` | 32px | 2.0 | Section separation (medium) |
| `space-12` | 48px | 3.0 | Section separation (large) |
| `space-16` | 64px | 4.0 | Major layout blocks |

### Grid System
*   **Desktop (1200px+):** 12 Columns, 24px Gutter, 72px Margin
*   **Tablet (768px+):** 8 Columns, 16px Gutter, 32px Margin
*   **Mobile (<768px):** 4 Columns, 16px Gutter, 16px Margin

### Container Widths
*   `max-w-screen-xl`: 1280px (Main App Wrapper)
*   `max-w-screen-lg`: 1024px (Dashboard Content)
*   `max-w-screen-md`: 768px (Form/Auth pages)

---

## 5. Components

### Buttons
*   **Purpose:** Trigger actions (Submit, Vote, Cancel).
*   **Primary:** `Fight Red` background, White text. Rounded corners (`rounded-md`).
    *   *Hover:* Darken 10%.
*   **Secondary:** White background, `Deep Charcoal` border.
    *   *Hover:* Light Gray background.
*   **Ghost:** Transparent background, `Vs Blue` text.
*   **States:** Default, Hover, Active/Pressed, Disabled (Opacity 50%, cursor-not-allowed).

### Inputs & Forms
*   **Purpose:** Data entry for Battle creation.
*   **Default:** `Fog Gray` background, 1px Border (`#E2E8F0`).
*   **Focus:** White background, 2px Border (`Fight Red`), Shadow ring.
*   **Error:** Pink background (`#FFF5F5`), Red Border.
*   **Label:** Top-aligned, `Small` size, Bold.

### Cards (Battle Cards)
*   **Purpose:** Display polling choices and results.
*   **Style:** White background, light shadow (`shadow-sm`), rounded-lg.
*   **Hover:** Lift effect (`translate-y-1`, `shadow-md`).
*   **Content:** Image on top (aspect ratio 4:3), Title, Progress Bar.

### Navigation
*   **Header:** Fixed height (64px). Logo left, User menu right. Sticky on scroll.
*   **Sidebar:** Collapsible (Icon only on mobile). Dark mode usually (`Deep Charcoal`).

### Badges & Tags
*   **Purpose:** Status indicators (e.g., "Active", "Finished").
*   **Pill Shape:** Fully rounded.
*   **Variants:**
    *   *Active:* Green bg / Dark Green text.
    *   *Ended:* Gray bg / Dark Gray text.

### Modals
*   **Purpose:** Confirmations (e.g., "Delete Battle?").
*   **Backdrop:** Black at 50% opacity.
*   **Structure:** Title, Body, Action Row (Right aligned).

### Loading States
*   **Skeleton:** Pulse animation on gray blocks (`bg-gray-200`) mimicking content shape.
*   **Spinner:** `Fight Red` rotating circle for button actions.

---

## 6. Interaction & Motion

Motion in MenuFight adds competitive flair.

### States
*   **Hover:** Standard duration `200ms`, `ease-in-out`. Elements should feel "snappy."
*   **Active:** Buttons scale down 0.98.

### Transitions
*   **Page Transitions:** Slight fade-in + slide-up (`opacity-0` to `1`, `translate-y-4` to `0`).
*   **Battle Results:** Progress bars animate from 0% to value over `1000ms`, `ease-out`.

### Micro-interactions
*   **Voting:** When a user clicks a food item:
    1.  Instant border highlight.
    2.  Confetti pop or "Impact" shake effect.
    3.  Reveal percentages instantly.

---

## 7. Iconography & Imagery

### Icons
*   **Library:** [Lucide Icons](https://lucide.dev/) (React) or Phosphor Icons.
*   **Style:** Outlined, 2px stroke width. Round joins.
*   **Color:** Inherit text color usually.

### Imagery
*   **Food Photos:**
    *   **Do:** High saturation, top-down or 45-degree angle, appetizing, natural light.
    *   **Don't:** Blurry, flash photography, unappetizing compositions.
*   **Radius:** All user uploads should be displayed with `rounded-md`.

---

## 8. Accessibility

MenuFight must be usable by everyone.

*   **Keyboard Nav:** All interactive elements (Buttons, Inputs, Cards) must have a visible `:focus-visible` ring (Offset 2px, Blue or Red).
*   **Contrast:** `Fight Red` used on text must be large or on dark backgrounds. Use darker reds for small text if needed.
*   **Screen Readers:**
    *   Images must have `alt` text (e.g., "Burger with cheese").
    *   Progress bars must use ARIA attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`).

---

## 9. Design Tokens (Reference)

```json
{
  "colors": {
    "primary": "#C62626",
    "secondary": "#2D9CDB",
    "accent": "#F5A623",
    "background": "#FFFFFF",
    "surface": "#F8F9FA",
    "text-main": "#1A1A1A",
    "text-muted": "#6C757D"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "6px",
    "lg": "8px",
    "full": "9999px"
  }
}
```

---

## 10. Developer Handoff Notes

### Naming Conventions
*   **Files:** PascalCase for Components (`BattleCard.tsx`), camelCase for hooks/utils.
*   **CSS Classes:** We follow standard Tailwind CSS utility naming.

### Component Reusability
*   Do not hardcode colors. Use Tailwind config classes (`text-primary`, `bg-surface`).
*   Create a `ui` folder for base atoms (Button, Input) and a `components` folder for complex molecules (BattleCard).

### Tailwind / Shadcn UI Alignment
*   This system is designed to work on top of **shadcn/ui**.
*   Customize the `shadcn` theme file to match our Color System variables.
*   Use `clsx` or `cn` utility for conditional class merging.

### Best Practices
*   **Mobile First:** Write styles for mobile, then add `md:` or `lg:` overrides.
*   **Dark Mode:** Use `dark:` prefix utilities. Start with `dark:bg-gray-900` for the main background.
