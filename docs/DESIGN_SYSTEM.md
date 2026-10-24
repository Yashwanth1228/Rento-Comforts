# Design System

This document records the implemented visual foundation and the design proposals used for it. Storefront design remains an early direction; broader portal conventions should be applied as those interfaces are built.

## Brand and palette

- **CONFIRMED:** Use the supplied company logo unchanged. The original JPEG is stored at `public/brand/rento-comforts.jpeg`; it has a white background and is placed on light surfaces with its aspect ratio preserved.
- **CONFIRMED:** Approved palette:

| Semantic token | Value | Intended use |
|---|---|---|
| `--brand-green` | `#017F36` | Primary action and selected emphasis; approximate sampled logo green. |
| `--deep-forest` | `#124734` | Editorial headings, strong navigation, and secondary emphasis. |
| `--warm-ivory` | `#F8F7F2` | Main page and warm surface backgrounds. |
| `--charcoal` | `#252925` | Main text and high-contrast elements. |
| `--soft-sage` | `#E9F1E9` | Subtle supporting surfaces and calm highlights. |

The shared semantic tokens in `app/globals.css` also define background, foreground, card, primary, secondary, muted, accent, border, input, and focus-ring colors for reuse with shadcn/ui components. Do not use color alone to communicate availability, errors, or status.

## Typography proposal

**PROPOSED, not finalized:** The current site uses self-hosted Manrope Variable for body copy and interface labels, paired with Cormorant Garamond Variable for large editorial headings. Manrope gives dense navigation and practical interface copy a clear modern shape; Cormorant Garamond adds a restrained editorial voice to display headings. Both are loaded from the installed Fontsource packages rather than a remote font service. Keep this two-family pairing provisional until reviewed against final brand content and supported languages.

Use a clear size hierarchy, comfortable line-height, limited line lengths, and responsive display sizes. Avoid introducing further font families without a specific need.

## Implemented components and conventions

- **Layout:** `.page-container` provides a centered responsive content width. Section rhythm and shared breakpoints live in `app/globals.css`. The current homepage banner establishes a repeatable brand treatment for later storefront surfaces: warm ivory as the base, soft sage as a broad editorial field, Deep Forest typography, and Logo Green reserved for primary actions. Apply these tokens consistently as customer and operations screens are built; the banner composition itself is specific to the homepage.
- **Header:** `SiteHeader` uses a slim Deep Forest context strip and a compact shopping row with the unchanged logo, category/business-model navigation, category-only search suggestions, a PIN-code input that cannot validate serviceability yet, and account/wishlist/cart information states. At tablet and mobile widths the search and PIN entry remain visible while the four navigation links move into a keyboard-operable Motion menu.
- **Hero carousel:** `HeroCarousel` presents three wide sage-and-ivory editorial banners for the brand, furniture, and appliances. Each uses a locally optimized transparent furniture/appliance illustration that crosses the color-field boundary, with copy and rounded CTAs aligned to the left on desktop and intentionally stacked on mobile. Each image is labeled as illustrative, not a product listing. Slides have meaningful in-page destinations, previous/next controls, and direct slide indicators. Arrow keys work when the carousel viewport itself is focused. There is no autoplay; transitions use Motion for React and collapse under reduced-motion preferences.
- **Category discovery:** `CategoryDiscovery` presents the ten confirmed furniture and appliance category examples in two ordered rows of transparent product cutouts. On desktop each row has five items; tablet and mobile use three and two columns. The product artwork sits directly on the warm-ivory background, shares a bottom alignment, and has only a centered category name beneath it. Each accessible link points to the existing Rent/Buy information section while catalogue routes are unavailable. Existing category anchors remain available for header navigation and search. Cutouts are identified as illustrative concepts to assist nonvisual users; the section does not show product counts, prices, stock claims, or catalogue results.
- **Rent/Buy:** `.discovery-options` presents two image-led navigation banners, with rental discovery given slightly more desktop width. Each banner uses a single brand-color field, concise copy on the left, and a transparent illustrative cutout aligned on the right. The panels stack below 800px while retaining the same copy-and-image composition. CTAs link to the existing category section; they do not imply catalogue or checkout functionality.
- **How it works:** A compact three-step section describes the intended journey without promising fulfillment timing or service policies.
- **Footer:** `SiteFooter` provides category and Rent/Buy navigation, Bengaluru as the initial region, and an explicit note that help and policy details are awaiting approval.
- **Buttons, links, and states:** `.button`, `.button--primary`, `.button--secondary`, and `.text-link` style real in-page navigation. Hero actions use rounded pill shapes; the primary rental path uses Logo Green while the secondary path uses a light neutral surface with a restrained Deep Forest outline. Keep navigation as anchors and interactive controls as buttons. Do not style unavailable actions to imply they are operational.
- **Typography:** Manrope Variable remains the interface/body proposal, paired with Cormorant Garamond Variable for editorial headings. The hierarchy uses restrained display scales, compact uppercase eyebrows, and comfortable body line-height. This pairing remains **PROPOSED**, not a finalized company standard.
- **States:** Preserve visible keyboard focus, usable hover states, and explicit text labels for disabled or future controls.

## Responsive design and accessibility

The current shell adapts at 1120px, 900px, 640px, and 370px breakpoints. Search and category navigation remain visible on mobile, with the PIN check and menu arranged for narrow screens; cards and the journey section stack intentionally. Check touch targets and prevent horizontal overflow at narrow widths. Future catalogue, checkout, admin, and delivery work still needs separate responsive design and testing.

Use landmarks, heading order, descriptive image alternatives, accessible control names, keyboard operation, visible focus, sufficient contrast, and text alongside any status color. Respect `prefers-reduced-motion`; animation must never block content or critical actions.

## Motion

Motion for React is used only to open and close the mobile navigation. `useReducedMotion` disables its movement and shortens the transition when a reduced-motion preference is active. CSS also removes smooth scrolling and minimizes transitions/animations under that preference. Category image hover feedback uses a brief CSS transition and is likewise minimized by the reduced-motion rule. Keep transitions purposeful; do not animate the same element with multiple systems.

## Homepage imagery

The homepage uses locally stored illustrative assets. Hero imagery is `public/images/hero-living-room-cutout.webp`, `public/images/hero-bedroom-cutout.webp`, and `public/images/hero-appliances-cutout.webp`; broader interior imagery is `public/images/rento-living-room.webp`, `public/images/furniture-bedroom.webp`, and `public/images/home-appliances.webp`. The Rent/Buy banners use the transparent PNG concepts `public/images/rent-banner-sofa.png` and `public/images/buy-banner-appliances.png`, generated on 2026-10-24 for this section. The category showcase uses the transparent cutouts `public/images/category-sofas-cutout.webp`, `category-beds-cutout.webp`, `category-wardrobes-cutout.webp`, `category-dining-tables-cutout.webp`, `category-study-tables-cutout.webp`, `category-refrigerators-cutout.webp`, `category-washing-machines-cutout.webp`, `category-televisions-cutout.webp`, `category-air-conditioners-cutout.webp`, and `category-microwaves-cutout.webp` under `public/images/`. These are unbranded AI-generated concepts, not commercial stock photography, Rento Comforts products, inventory, or proof of availability. No third-party image licenses or external image hotlinks are used. Generated output is subject to applicable terms and law; see [OpenAI Terms of Use](https://openai.com/policies/row-terms-of-use/). Replace illustrative visuals with approved company-owned or appropriately licensed photography before representing actual inventory.

## Unresolved

The typography pairing is a proposal, not an approved company standard. The exact original logo color, final type standards, and treatment for actual product photography remain to be reviewed. Logo Green is approximate because the asset is a JPEG. Product catalogue, account, wishlist, cart, serviceability, checkout, admin, and delivery functionality are not implemented.
