# docs/DESIGN_SYSTEM.md — Rento Comforts Visual Language

> This document defines the approved visual language for Rento Comforts.
> Agents: always refer here before making any design, color, or component decision.
> Do not override confirmed values. Flag anything marked UNRESOLVED before implementing.

---

## 1. Brand Principles

Rento Comforts positions itself as a **premium, trustworthy, and approachable** furniture and appliance rental brand. The visual language must communicate:

- **Trust** — customers are inviting this brand into their homes
- **Quality** — items are well-maintained and worth the cost
- **Ease** — renting should feel simpler and lighter than buying
- **Warmth** — a home-oriented brand, not a cold tech product

### Interface Tone by Audience

| Interface | Tone |
|-----------|------|
| Public storefront (home, catalogue, product pages) | Premium, editorial, sophisticated — first impressions matter |
| Customer account / checkout / rentals | Practical, clear, reassuring |
| Admin dashboard | Functional, data-dense, efficient |
| Delivery team portal | Simple, mobile-first, action-oriented |

---

## 2. Color Palette

> **Status notes:**
> - Logo Green exact hex is **UNRESOLVED** — the value below is sampled from a JPEG and may not be the true brand color.
> - All other palette values are **CONFIRMED** as approved.

| Token Name | Hex | Usage |
|------------|-----|-------|
| Logo Green | `~#017F36` *(sampled — confirm exact value)* | Primary CTA buttons, active states, brand accents |
| Deep Forest | `#124734` | Headers, hero backgrounds, dark overlays, footer |
| Warm Ivory | `#F8F7F2` | Primary page background, card surfaces |
| Charcoal | `#252925` | Body text, headings on light backgrounds |
| Soft Sage | `#E9F1E9` | Hover states, section dividers, subtle highlights |

### Usage Guidelines

- **Deep Forest** (`#124734`) is the dominant dark tone — use for navbars, hero sections, and footers.
- **Warm Ivory** (`#F8F7F2`) is the default page background — avoid pure white unless intentional.
- **Logo Green** (confirmed approximate `#017F36`) drives primary actions only. Do not overuse.
- **Charcoal** (`#252925`) is the standard text color. Avoid pure black (`#000000`).
- **Soft Sage** (`#E9F1E9`) is a supporting tint — use for hover backgrounds, section separators, and tag chips.

### Accessibility Contrast Requirements
- All text must meet WCAG AA minimum contrast ratios (4.5:1 for body, 3:1 for large text).
- Verify contrast when using Logo Green on Warm Ivory — green-on-light may require adjustment.
- Do not place Soft Sage text on Warm Ivory backgrounds.

---

## 3. Logo

- The **original Rento Comforts logo must remain completely unchanged** — no alterations to shape, proportions, colors, or typography within the mark.
- Official file location: `public/brand/rento-comforts-logo.jpg` (official JPEG asset supplied by startup).
- **Do not** recreate, trace, or approximate the logo in code or with CSS.
- **Do not** distort, recolor, or attempt automated background removal on the JPEG.
- **Light surface container rule**: Because the official asset is a JPEG with a white background, always mount the logo within a clean white container/card (e.g., `bg-white p-1 rounded-lg border border-border-subtle shadow-xs`) to ensure clean presentation on both Warm Ivory and Deep Forest backgrounds.
- Minimum clear space: maintain padding equal to the logo's height × 0.25 on all sides.

---

## 4. Typography
 
> **Status: PROPOSED** — Implemented in Phase 0 foundation using Google Fonts (`next/font/google`). Pending developer final sign-off.
 
### Selected Font Pairing & Rationale
- **Headings & Editorial Display**: **Playfair Display** (`--font-serif`)
  - *Rationale*: A classic transitional serif with high contrast and refined letterforms. Evokes the warmth, craftsmanship, and sophistication of upscale architectural and home-lifestyle publications.
- **Body, Navigation & UI Controls**: **Plus Jakarta Sans** (`--font-sans`)
  - *Rationale*: A modern geometric humanist sans-serif with a tall x-height and open apertures. Highly legible at compact mobile sizes, button labels, and dense e-commerce UI without feeling sterile.
 
### Technical Implementation
Loaded via `next/font/google` in `app/layout.js` with `display: 'swap'` and CSS variables `--font-serif` and `--font-sans`.
Fallback stack:
- Sans: `var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Serif: `var(--font-serif), ui-serif, Georgia, Cambria, 'Times New Roman', serif`
 
### Type Scale (Implemented)

| Role | Size | Weight |
|------|------|--------|
| Hero / Display | 48–72px | Bold (700) |
| Section heading | 32–40px | Semi-bold (600) |
| Card title / H3 | 22–28px | Medium (500) |
| Body | 16px | Regular (400) |
| Caption / label | 12–14px | Regular / Medium |
| CTA button | 15–16px | Semi-bold (600) |

---

## 5. Component Guidelines

### 5.1 Buttons

| Variant | Use Case |
|---------|----------|
| Primary (Logo Green fill) | Main CTA — "Rent Now", "Add to Cart", "Confirm Order" |
| Secondary (Deep Forest outline) | Secondary actions — "View Details", "Learn More" |
| Ghost / Subtle | Low-emphasis actions in dense UI — admin tables, filters |
| Destructive | Delete or cancel actions — admin only |

- **Border radius:** Medium (8–12px recommended). Not pill-shaped by default.
- **Hover state:** Slight brightness or scale change (do not rely on color alone for state).
- **Focus state:** Visible keyboard focus ring using `outline` or ring utility.

### 5.2 Cards
- Background: Warm Ivory (`#F8F7F2`) or white on Soft Sage sections
- Border: 1px `#E0DED8` or `border-sage` equivalent — subtle, not harsh
- Shadow: Soft, warm — `0 2px 12px rgba(37,41,37,0.07)` — avoid cool grey shadows
- Hover: Subtle lift effect (translate-y -2px + shadow increase)

### 5.3 E-Commerce Navigation Architecture
- **Three-Layer Header**: A Deep Forest (`#124734`) factual utility strip; a Warm Ivory editorial row with the unmodified official logo on its required white tile, anchor navigation, category-example search, a six-digit PIN entry, and account/wishlist/cart controls; then a four-category row for Furniture, Appliances, Combos, and Packers & Movers.
- **Category Mega Menus**: Furniture and appliance groups use the existing homepage category anchors and are explicitly described as illustrative rather than live catalogue results. Combos and Packers & Movers show setup-pending copy until their catalogue/service details exist. A locally stored generated living-room image is used in the Furniture promo panel.
- **Interactions and limits**: Category menus open on desktop hover, focus, or click; Escape and outside interaction close them. Mobile/tablet menu access uses expandable touch groups. Search filters only the current category examples. PIN entry checks six-digit format and retains the value only in the current page session; it cannot verify serviceability. Cart count comes from the existing in-memory cart provider. Account, wishlist, tracking, contact, newsletter, and account features remain unavailable until actual routes/services are implemented.
- **Editorial edges**: The existing `public/images/rento-living-room.webp` illustrative room photo is softly cropped into both outer edges behind the middle row, with the controls kept in a clean central area. It is not a product listing or inventory claim.

### 5.4 Forms
- Input borders: 1px solid, `#D0CEC8` default, Logo Green on focus
- Error states: Red (accessible) with icon and message — never color alone
- Labels: Always visible (no placeholder-only labels for required fields)
- Submit buttons: Primary variant

### 5.5 Product Cards (Catalogue Architecture)
- Reusable component: `components/ui/product-card.js`
- Image aspect ratio: 4:3 with Next.js image optimization, fallback skeleton placeholder, and hover zoom
- Badge indicators: "Rent", "Buy", or "Rent & Buy" mode chips with soft borders
- Pricing model: Prominent rental price in ₹ INR / month with minimum tenure notice; optional purchase price in ₹ INR
- Deposit notice: Transparent refundable deposit indicator
- Action: "View Details" secondary action button and interactive wishlist toggle
- Safety: Strictly uses verified catalogue data in upcoming Phase 2; no fake mock products are rendered on the public storefront

### 5.6 Hero Banner Carousel (Full-Width Borderless Editorial Architecture)
- Reusable component: `components/home/hero-carousel.js` (rendered in `HeroSection`)
- Frame proportions: Full-width responsive viewport (`.hero-carousel__viewport`, width `100%`, height `clamp(450px, 38vw, 540px)`) spanning edge-to-edge without outer left/right container padding
- Border & Styling: Completely **borderless** (`border: none`) with no harsh outline strokes or boxed boundaries
- Canvas & Two-Tone Field Composition:
  - Upper Field (69% height): Seamless Soft Sage (`#E9F1E9` / `var(--soft-sage)` / `.hero-slide__field`) providing an architectural, editorial wall backdrop across the full screen width
  - Lower Field (31% height): Warm Ivory floor (`#F8F7F2` / `var(--warm-ivory)`), establishing depth and ground plane
- Overlapping Furniture Imagery:
  - Three locally stored, optimized transparent WebP cutouts (`hero-living-room-cutout.webp`, `hero-bedroom-cutout.webp`, `hero-appliances-cutout.webp`)
  - Placed at `height: 100%`, `right: 3%`, `object-position: right bottom`, intentionally crossing the 69% Soft Sage color boundary to create high-end magazine depth
- Typography & CTAs (Left Column):
  - Eyebrow with accent bar: `— A considered way to furnish` (with green horizontal dash `var(--brand-green)`)
  - Editorial Headline: `Furnish Your Home, Your Way.` in **Cormorant Garamond** editorial serif (`var(--font-editorial)`, `font-weight: 500`, `text-deep-forest` #124734)
  - Supporting Description: Clear e-commerce value proposition in Charcoal (`#46534a`)
  - Pill CTA Pairing: Primary solid Logo Green pill (*"Explore Rentals →"*) paired with outline Deep Forest pill (*"Shop to Buy →"*)
- Carousel Controls & Motion:
  - Floating circular arrow buttons (`.hero-carousel__arrow`) with hover elevation and green accent
  - Centered horizontal dash indicators (`.hero-carousel__indicator`) with `.is-active` expansion
  - Smooth slide transitions via `motion/react` (`AnimatePresence` and `motion.article`), respecting `prefers-reduced-motion`
  - Keyboard arrow navigation (`ArrowLeft` / `ArrowRight`) when focused
  - Subtle caption note on bottom right: *"Illustrative furniture concept · not a product listing"*
- Trust Badges Strip:
  - 4-column compact assurance strip mounted below the full-width hero banner inside `Container` (*100% Owned Stock*, *Bengaluru Delivery*, *Flexible Tenures*, *Clean & Sanitized*)

### 5.7 Category Discovery Section (Prompt 03E Architecture)
- Reusable component: `components/home/category-grid.js`
- Section Heading: `Shop by Category` (clean, centered heading; no marketing paragraphs or redundant filter tabs)
- Visual Composition: **Transparent Product Cutout Showcase (Prompt 03F)**
  - Clean, product-focused showcase without rectangular card containers, borders, or white card backgrounds
  - 100% transparent PNG/WebP product cutouts displayed directly over the section's warm ivory (`#F8F7F2`) background
  - Consistent bottom alignment and uniform visual scale across varying product silhouettes
  - Centered category name directly beneath each product image in Charcoal (`#252925`), transitioning to Logo Green (`#017F36`) on hover
  - Subtle interactive hover lift/scale (`group-hover:-translate-y-1.5 group-hover:scale-105`) with full `motion-reduce:transform-none` support
- Grid Architecture:
  - Desktop (1440px): 5-column grid forming 2 clean rows:
    - **Row 1 (Furniture)**: 1. Sofas, 2. Beds, 3. Wardrobes, 4. Dining Tables, 5. Study Tables
    - **Row 2 (Home Appliances)**: 6. Refrigerators, 7. Washing Machines, 8. Televisions, 9. Air Conditioners, 10. Microwaves
  - Tablet (768px): 3 columns (`sm:grid-cols-3`)
  - Mobile (375px): 2 columns (`grid-cols-2`)
  - Strict prohibition against card borders, room lifestyle backgrounds, fake discounts, ratings, pricing, or stock availability claims

### 5.8 E-commerce Footer Architecture (Curved Organic Wave & Ambient Lounge Showcase)
- Reusable component: `components/layout/footer.js` (and `components/site-footer.jsx`)
- Visual Composition:
  - **Top Edge**: Smooth organic S-curve wave transition in Warm Ivory (`#F8F7F2`), eliminating abrupt straight divider lines while maintaining compact vertical height.
  - **Background**: Deep forest gradient (`from-[#0c3325] via-[#0f3d2c] to-[#0a2c1f]`) providing rich brand presence.
  - **Brand Lockup**: Official green "R" logo symbol (`/brand/rento-symbol-green.png`) on transparent background paired with bold white "RENTO" and tracked "COMFORTS", eliminating heavy white boxed containers.
  - **Ambient Artwork**: Transparent lounge cutout (`/images/footer-lounge-cutout-v2.png`) featuring an ivory armchair, green accent pillow, round coffee table, potted plant, and overhead brass/forest pendant lamp anchored naturally along the right edge.
  - **Highlights Strip**: 4 assurance pillars mounted on a dedicated divider row (*Wide Range*, *Rent or Buy*, *Bengaluru Focus*, *Transparent Pricing*).
  - **Get Updates**: Integrated newsletter subscription pill with Logo Green accent arrow button.
  - **Vertical Length**: Compact, streamlined vertical padding (`pt-6 pb-6`) ensuring the entire footer is visible in a single screen view without requiring excessive scrolling.

---

## 6. Imagery

- **Hero Carousel Banner Assets (Optimized Transparent WebP Cutouts)**:
  - Slide 1 (Living Room): Sage-green modern 3-seater sofa, cream cushions, draped blanket, and tall floor lamp (`public/images/hero-living-room-cutout.webp`)
  - Slide 2 (Curated Bedroom): Low platform wooden bed with sage accent pillows, ivory duvet, oak nightstand with vase, and brass arc floor lamp (`public/images/hero-bedroom-cutout.webp`)
  - Slide 3 (Everyday Appliances): Modern white refrigerator, front-load washing machine, microwave on wooden console, and potted plant (`public/images/hero-appliances-cutout.webp`)
  - *Note on Illustrative Imagery*: All illustrations are unbranded AI-generated design concepts, not commercial stock photography, Rento Comforts products, inventory, or proof of availability.
- **Shop by Category Cutout Assets (10 Approved Categories in Transparent WebP)**:
  - Row 1 (Furniture):
    - Sofas: `/images/categories/cutout-sofa.webp` (Contemporary 3-seater sofa)
    - Beds: `/images/categories/cutout-bed.webp` (Solid oak platform bed)
    - Wardrobes: `/images/categories/cutout-wardrobe.webp` (3-door natural oak wardrobe)
    - Dining Tables: `/images/categories/cutout-dining-table.webp` (Scandinavian dining table with 4 chairs)
    - Study Tables: `/images/categories/cutout-study-table.webp` (Minimalist study desk with ergonomic chair)
  - Row 2 (Home Appliances):
    - Refrigerators: `/images/categories/cutout-refrigerator.webp` (Double-door stainless steel refrigerator)
    - Washing Machines: `/images/categories/cutout-washing-machine.webp` (Front-load washing machine)
    - Televisions: `/images/categories/cutout-television.webp` (Smart 4K TV on low-profile media console)
    - Air Conditioners: `/images/categories/cutout-air-conditioner.webp` (Wall-mounted split inverter AC)
    - Microwaves: `/images/categories/cutout-microwave.webp` (Countertop digital microwave oven)
- Product photography style: **isolated commercial studio cutouts with 100% transparent alpha backgrounds and subtle contact shadows** — no lifestyle room backgrounds in category navigation
- Use `next/image` for all images (automatic optimization, lazy loading, responsive sizes)
- Placeholder images: use subtle skeleton loaders — do not use generic image-placeholder services
- Cloudinary is the approved media host for product and admin-uploaded images in future phases

---

## 7. Spacing & Layout

- Base spacing unit: **4px** (Tailwind's default scale is fine)
- Standard section padding: `py-16` to `py-24` on desktop; `py-10` to `py-16` on mobile
- Max content width: **1280px** — centered with `mx-auto px-4 sm:px-6 lg:px-8`
- Grid system: CSS Grid and Flexbox via Tailwind utilities

---

## 8. Animation & Motion

- **Library**: Motion for React (approved) and GSAP (approved) — use selectively
- **Principle**: Motion must have purpose — entrance animations, state transitions, feedback. Not decoration.
- **Storefront**: Tasteful scroll-reveal and entrance animations are appropriate
- **Admin / Delivery portals**: Keep animations minimal — these are task-focused interfaces
- **Reduced motion**: Respect `prefers-reduced-motion` — wrap all non-essential animations in a check
- **Duration guidelines**: Micro-interactions 100–200ms; page transitions 300–450ms; hero animations 600–900ms

### What Is Acceptable
- Subtle fade-in / slide-up on product cards as they enter viewport
- Smooth page transitions between catalogue pages
- Loading skeletons with a soft shimmer animation
- Button hover scale (1.00 → 1.02) or brightness shift

### What Is Not Acceptable
- Looping background animations that can't be stopped
- Animation on every element simultaneously
- Scroll-jacking (overriding native scroll behavior)
- Animations that delay core content from appearing

---

## 9. Responsive Breakpoints

Use Tailwind CSS default breakpoints:

| Breakpoint | Width | Primary Use |
|------------|-------|-------------|
| `sm` | 640px | Landscape mobile |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

- Design **mobile-first** — the delivery portal must be fully usable on a 375px smartphone.
- Admin dashboard may be desktop-first but must remain usable on tablets.

---

## 10. Accessibility Checklist

Before marking any page or component complete:

- [ ] All images have descriptive `alt` text
- [ ] Color contrast meets WCAG AA
- [ ] All interactive elements reachable and operable by keyboard
- [ ] Focus indicators visible on all interactive elements
- [ ] Error messages associated with their input fields (aria)
- [ ] `aria-label` or visible label on all icon-only buttons
- [ ] Page `<title>` and `<meta name="description">` set on every page
- [ ] Heading hierarchy is logical (one `h1` per page)

---

## 11. Approved UI Libraries

| Library | Approved Use |
|---------|-------------|
| `shadcn/ui` | Base UI primitives — dialogs, dropdowns, forms, tables |
| React Bits | Creative/premium decorative components — use sparingly on storefront |
| 21st.dev | Additional component patterns — review each component before use |
| Motion for React | Declarative animations and transitions |
| GSAP | Complex timeline or scroll-triggered animations (storefront hero) |
| React Icons | Icon library — prefer a consistent icon family throughout |
| Recharts | **PROPOSED** — admin analytics charts — confirm before installing |

---

*Last updated: 2026-10-22 | Status: Documentation phase — no application code exists yet.*
