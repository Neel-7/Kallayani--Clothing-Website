# Design System: Kallayani

This document is the visual source of truth for Kallayani's storefront. Use it when creating or revising screens, components, imagery, and motion. New work should feel like a quiet, contemporary textile house: culturally rooted, editorial, tactile, and commercially clear.

## 1. Visual Theme & Atmosphere

Kallayani combines Bengali and South Indian craft traditions with the restraint of a modern New York gallery. The interface should feel warm without becoming rustic, luxurious without becoming ornamental, and editorial without obscuring the path to purchase.

- **Density: 4/10 — gallery airy.** Product and campaign photography receives generous space. Commerce controls remain compact and legible.
- **Variance: 6/10 — composed asymmetry.** Use split layouts, staggered editorial modules, offset copy blocks, and shifts in image scale. Repetition is acceptable in product rails, but campaign sections should not become a sequence of identical cards.
- **Motion: 5/10 — quiet and tactile.** Motion supports hierarchy, product discovery, and state change. It should feel weighted and calm, never playful or theatrical.
- **Texture:** Let weave, grain, architecture, and natural light live inside the photography. UI surfaces remain mostly flat so the materials carry the visual richness.
- **Shape language:** Predominantly square corners and clean rules. Circular geometry is reserved for icon controls, status marks, and the lotus brand motif.
- **Hierarchy:** Photography first, editorial typography second, functional UI third. Do not decorate empty space merely to make a screen feel busy.

### Brand principles

1. **Craft is specific.** Name the textile, maker tradition, and region when known.
2. **Images carry emotion.** Use real-feeling scenes, material detail, and culturally grounded styling rather than generic luxury imagery.
3. **Commerce stays clear.** Price, size, availability, delivery, and calls to action must be easy to find and understand.
4. **Restraint signals confidence.** One accent hue, few type styles, thin rules, and limited elevation are enough.

## 2. Color Palette & Roles

Use this warm-neutral palette across the entire storefront. Oxblood is the only brand accent. Do not introduce purple, electric blue, neon hues, or unrelated seasonal UI colors.

| Token | Value | Role |
| --- | --- | --- |
| **Paper White** | `#FFFFFF` | Primary canvas, header, product details, elevated overlays |
| **Soft Loom** | `#F5F5F3` | Image placeholders, quiet section contrast, skeleton bases |
| **Woven Parchment** | `#F3EEE7` | Optional immersive surface for account and story-led pages |
| **Charcoal Ink** | `#171412` | Primary text, primary buttons, footer; replaces pure black |
| **Muted Thread** | `#69635F` | Supporting copy, metadata, captions |
| **Loom Line** | `#DEDBD7` | Structural borders, dividers, inactive indicators |
| **Kallayani Oxblood** | `#4A1116` | The single accent: active states, links, focus, selected controls, brand mark |
| **Paper on Ink** | `#FFFFFF` | Text and icons on Charcoal Ink or Oxblood |

### Color rules

- Keep large backgrounds neutral. Oxblood may fill a button, small active control, brand mark, or focused editorial panel; it should not flood every section.
- Use Charcoal Ink instead of `#000000`.
- Maintain at least WCAG AA contrast for text and essential icons.
- Photography may contain saturated color, but UI chrome remains in the palette above.
- Over photographs, use a bottom-weighted Charcoal Ink overlay between roughly 35% and 65% opacity. Text must remain readable over every carousel frame.
- Tinted shadows use warm ink, such as `rgba(44, 30, 25, 0.11)`, never cool gray or colored glow.
- Do not add a second accent. Legacy bright red treatments should be normalized to Oxblood in new work.

## 3. Typography Rules

The type pairing is intentionally editorial: Cormorant Garamond supplies heritage and emotion; Jost keeps navigation and commerce precise. Both are locally hosted assets and should load before layout-critical text appears.

### Families

- **Brand and editorial display:** `Cormorant Garamond`, variable weight `300–700`. This is the approved Kallayani display face, not a generic Garamond substitute.
- **UI and body:** `Jost`, variable weight `400–700`.
- **Numeric data:** Jost with tabular numerals for prices, quantities, totals, and order references.
- **Fallback behavior:** Use the closest readable serif/sans category only while the local font is unavailable. Do not introduce Inter, Times New Roman, Georgia, Garamond, Palatino, or a second display font in authored designs.

### Type scale

| Style | Specification | Use |
| --- | --- | --- |
| **Campaign display** | `clamp(3.25rem, 5.4vw, 5.125rem)`, weight `500`, line-height `.98–1.02`, tracking `-.025em` | Collection and campaign heroes |
| **Page title** | `clamp(2.5rem, 4vw, 3.5rem)`, weight `500`, line-height `.95`, tracking `-.035em` | Product and account titles |
| **Section title** | `clamp(1.875rem, 2.5vw, 2.625rem)`, weight `600`, line-height `1.1`, tracking `-.02em` | Rails, categories, editorial sections |
| **Editorial statement** | `clamp(2rem, 3vw, 2.875rem)`, weight `500`, line-height `1.08` | Brand signature and story moments |
| **Body** | `1rem`, weight `400`, line-height `1.6` | General copy; keep lines at `55–65ch` |
| **Product/body small** | `.8125–.9375rem`, line-height `1.4–1.7` | Descriptions, provenance, metadata |
| **Eyebrow** | `.6875–.75rem`, weight `600`, uppercase, tracking `.12–.20em` | Collection, region, and section labels |
| **Navigation** | `.8125–.875rem`, weight `500`, uppercase, tracking `.07em` | Primary navigation |

### Typography behavior

- Prefer sentence case for headlines and actions. Reserve uppercase for navigation, compact eyebrows, and button labels.
- Keep display text to approximately 12–18 words and no more than three lines on desktop.
- Use `text-wrap: balance` for short hero headings, never for paragraphs.
- Italics may emphasize one brief phrase in editorial copy; do not italicize full interface labels or long passages.
- Body copy never drops below `14px`; critical mobile actions and inputs should be `16px` where browser zoom behavior matters.
- Establish hierarchy through family, weight, spacing, and color before increasing size.

## 4. Imagery & Art Direction

Photography is the primary expression of the brand. It should show clothing and objects as lived culture rather than isolated inventory.

- **Campaign images:** Full-bleed environmental portraits with warm natural light, heritage architecture, textile studios, courtyards, or lived domestic spaces.
- **Product images:** Consistent `3:4` or `4:5` portrait crops, an unobstructed silhouette, true textile color, and calm neutral or contextual backgrounds.
- **Editorial images:** Pair one wide establishing frame with closer human or material detail. Use intentional asymmetry rather than three equal tiles.
- **Object positioning:** Store and preserve an explicit focal point per asset so faces, garments, and motifs survive responsive crops.
- **Overlays:** Use only when copy sits on an image. Avoid heavy global color grading that masks fabric color.
- **Alt text:** Describe the person or object, garment, material or motif, and meaningful setting. Do not begin with “image of.”
- **Placeholders:** Use Soft Loom, then a dimension-matched skeleton. Never show broken image icons or unstable remote image URLs.

Do not overlap editorial text across a subject's face or garment detail. If image and copy cannot coexist cleanly, place copy in a separate spatial zone or a restrained Paper White inset panel.

## 5. Component Styling

### Buttons and links

- **Primary button:** Charcoal Ink fill, white label, `1px` Charcoal Ink border, square corners, minimum height `44px`, horizontal padding `24px`. Hover to Oxblood.
- **Editorial primary:** Oxblood fill is allowed for a single high-intent action on account or story-led pages.
- **Outline button:** Paper White or transparent fill with a `1px` Charcoal Ink border. Hover may invert to Charcoal Ink.
- **Ghost action:** No container unless the control needs a touch target. Use underlining or Oxblood text on hover to communicate action.
- **Icon button:** Minimum `44 × 44px` target. Circular containers are acceptable for wishlist, carousel, and compact utility controls.
- **Active feedback:** Use `scale(.98)` or a `1px` downward translation. Do not use bounce, glow, or elastic overshoot.
- **CTA restraint:** Give a campaign panel one primary CTA. Avoid pairs such as “Shop now” plus “Learn more” unless both actions are genuinely necessary.

### Cards, tiles, and product rails

- Product tiles are image-first and normally have no enclosing border or rounded shell.
- Category tiles may use a soft warm shadow: `0 2px 8px rgba(44, 30, 25, .11)`; hover may deepen slightly.
- Use elevation only when it clarifies layering, such as a mega-menu, sheet, or copy panel over photography.
- Product images zoom no more than `1.025–1.05` on hover over `450–700ms`.
- A desktop quick-add tray may rise from the image bottom. It must remain visible without hover on touch devices.
- Prefer rails, two-column editorial pairings, and mixed-scale layouts. Do not use a generic row of three equal feature cards.

### Forms and selection controls

- Place labels above fields. Helper text follows the field; errors appear directly below it.
- Default form treatment is a quiet bottom border; use a full rectangular border when the field needs stronger grouping.
- Focus changes the border to Oxblood and preserves the global visible outline.
- Inputs use transparent or Paper White fills, `15–16px` text, and no floating labels.
- Size selectors use a thin Loom Line border and a minimum `44px` target. Selected state is Oxblood with white text.
- Checkbox and radio controls must expose native semantics even when visually customized.
- Inline success and error messages use a left Oxblood rule or a clear icon plus text. Do not rely on color alone.

### Navigation and overlays

- The header is sticky, Paper White, and separated by a single Loom Line rule.
- Desktop navigation is horizontally composed; mobile navigation becomes a clean sheet, never a compressed desktop bar.
- Mega-menus use columns separated by thin rules plus one supporting campaign image. They enter with a short fade and `4px` vertical shift.
- Sheets use Paper White, square corners, and a Charcoal Ink overlay near 40% opacity.
- Breadcrumbs are compact, muted, and truncatable. The current page uses Charcoal Ink.

### Feedback states

- **Loading:** Use skeleton blocks matching final image and text dimensions with a subtle warm-neutral shimmer. No generic circular spinner for page-level loading.
- **Empty:** Pair concise guidance with one relevant action and, when appropriate, a restrained textile or product composition.
- **Error:** State the problem in plain language beside the affected control and offer a recovery action.
- **Disabled:** Reduce opacity to about 35%, retain legible structure, and remove hover animation.

## 6. Layout Principles

### Grid and containment

- Build page structure with CSS Grid. Use Flexbox for one-dimensional alignment, not percentage-based layout math.
- Global horizontal gutter: `clamp(16px, 2vw, 40px)`.
- Standard content maximum: `1200px`. Wide editorial and merchandising regions may extend to `1400px` or full bleed.
- The base spatial unit is `4px`. Prefer intervals of `8, 12, 16, 24, 32, 40, 48, 64, 88px`.
- Typical section rhythm is `clamp(3rem, 8vw, 6rem)` for story-led sections and `28–44px` for compact commerce rails.
- Borders are `1px`. Square corners are the default; avoid indiscriminate `rounded-xl` containers.

### Composition rules

- Heroes may be full-bleed when a supplied campaign image is designed to hold overlaid copy. Keep copy in a clear lower or side zone, never over faces.
- For new story-led heroes, prefer a `5/7` or `7/5` image-and-copy split, left-aligned copy, or large asymmetric whitespace. Do not default every new page to centered text over an image.
- Editorial sections should vary rhythm: two-up portrait imagery followed by one wide scene is a preferred pattern.
- Product detail uses a two-column media/purchase split with roughly `44–88px` between columns and a `1200px` maximum width.
- Replace unnecessary containers with whitespace and top rules. Nested cards are not part of the visual language.
- Never stack unrelated content with absolute positioning. Absolute positioning is reserved for overlays, media controls, and anchored decorative treatment with a stable containing block.

### Responsive behavior

- **Desktop:** Above `900px`; preserve full navigation and multi-column editorial layouts.
- **Compact navigation:** Below `1050px`; reduce header geometry before switching to mobile navigation.
- **Tablet:** `900px` and below; multi-column merchandising may reduce to two or three columns.
- **Phone:** `600px` and below; all narrative and form splits become one column. Product grids may retain two columns only when labels and touch targets remain comfortable.
- No horizontal page scrolling at any width.
- Use fluid display sizes with `clamp()`. Keep body text at least `14px` and interactive targets at least `44px`.
- Use `min-height: 100dvh` for new full-height experiences. Do not use `h-screen`; `svh` is acceptable for intentionally stable campaign crops.
- Campaign imagery must retain its stored focal point. Move copy below the image when a crop cannot preserve both subject and readable text.
- Hover-only actions must have a visible touch-device equivalent.

## 7. Motion & Interaction

Motion should resemble cloth settling: soft, deliberate, and quickly at rest.

- **Micro transitions:** `180–300ms` with a decelerating ease such as `cubic-bezier(.22, 1, .36, 1)`.
- **Image hover:** `450–700ms`, scale only, maximum `1.05`.
- **Entrances:** Fade plus `8–28px` vertical movement. Stagger repeated items by `60–90ms`; never mount a long list with simultaneous dramatic motion.
- **Spring default for JavaScript motion:** stiffness `100`, damping `20`. Use only when a spring materially improves direct manipulation.
- **Hero autoplay:** Approximately `6000ms` per slide. Pause on pointer hover and keyboard focus, expose a play/pause control, and stop animation under reduced-motion preferences.
- **Active loops:** Reserve perpetual animation for elements that communicate ongoing time or work, such as carousel progress or a skeleton shimmer. Do not make every decorative object float or pulse.
- Animate `transform` and `opacity` whenever possible. Avoid animating `top`, `left`, `width`, or `height`; disclosure rows may use a grid-row transition when content height is unknown.
- Always respect `prefers-reduced-motion: reduce`: remove autoplay, parallax, cascades, and nonessential transforms while keeping state changes understandable.
- Never use a custom cursor.

## 8. Accessibility & Content

- Every interactive element must be keyboard reachable and show a visible `2px` Oxblood focus outline with approximately `4px` offset.
- Use one `h1` per page. Headings descend in a logical order even when visual scale differs.
- Icon-only controls require a specific accessible name. Decorative icons are hidden from assistive technology.
- Carousels expose their current item, named previous/next controls, pause/play state, and inert off-screen slides where supported.
- Do not encode state solely with color; pair it with text, shape, position, or an icon.
- Announce add-to-bag, errors, and form success through an appropriate live region in production flows.
- Copy should be concrete, calm, and culturally specific. Prefer “Handwoven Jamdani from Bengal” to vague luxury language.
- Avoid generic placeholder names, fabricated impact statistics, and fake round-number claims.

## 9. Anti-Patterns: Never Do

- No emojis in interface copy.
- No Inter, generic serif substitutions, or ad hoc third typeface.
- No pure black (`#000000`).
- No purple or blue neon, outer glow, glassmorphism as a default, or oversaturated accents.
- No large gradient-filled headline text.
- No rounded container applied to every component.
- No three equal feature cards as the default composition.
- No cards nested inside cards.
- No text overlapping faces, product silhouettes, or other text.
- No centered hero as the automatic solution for every page.
- No generic “Scroll to explore,” bouncing chevrons, or decorative scroll prompts.
- No custom mouse cursors.
- No essential action available only on hover.
- No broken remote image links or unstable image placeholders.
- No fake social proof or arbitrary values such as “99.99% satisfaction.”
- No copy clichés such as “Elevate,” “Seamless,” “Unleash,” “Next-Gen,” or “Redefine your style.”
- No decorative animation that competes with garments, craft, or buying decisions.

## 10. Implementation Reference

The current codebase expresses these rules through Tailwind tokens. Keep semantic names aligned with their roles:

```ts
colors: {
  paper: "#FFFFFF",
  soft: "#F5F5F3",
  ink: "#171412",
  muted: "#69635F",
  line: "#DEDBD7",
  wine: "#4A1116",
}

fontFamily: {
  brand: ["Cormorant Garamond", "serif"],
  editorial: ["Cormorant Garamond", "serif"],
  nav: ["Jost", "sans-serif"],
  ui: ["Jost", "sans-serif"],
}

spacing: {
  gutter: "clamp(16px, 2vw, 40px)",
}
```

When a new screen requires a visual choice not covered here, choose the option that makes the photography more legible, the craft more specific, and the purchase path clearer. Reuse existing primitives before creating a new style exception.
