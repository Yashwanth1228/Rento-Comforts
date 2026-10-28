# Implementation Plan

This plan is intentionally incremental for a single developer. A phase is completed only after its code and behavior are checked against its acceptance criteria. Future business work has not started.

## Phase 1 — Confirm launch rules and operational decisions

**Status: NOT STARTED**

**Prerequisites:** Business owner input on launch products, pricing, rental rules, Bengaluru service coverage, payment/deposit/tax/fee policies, cancellation/refund/damage terms, manual availability confirmation, and staff roles.

**Acceptance criteria:** Decisions needed for the first customer and operations workflows are documented and approved; unresolved items remain explicitly marked; no policy is invented by implementation.

## Phase 2 — Initialize the application foundation

**Status: COMPLETED — verified**

**Prerequisites:** Approval to initialize Next.js and install dependencies.

**Acceptance criteria:** JavaScript App Router project and Tailwind baseline are initialized; setup instructions match the actual project; no secrets are committed; ESLint, production build, and local homepage response pass. No business workflow is implied.

**Completed:** Next.js `16.4.2`, React `19.3.0`, Tailwind CSS `4.3.3`, ESLint `9.39.5`, JavaScript App Router, npm scripts, and the `@/*` alias. TypeScript and React Compiler are not enabled.

## Phase 3 — Establish the initial customer visual foundation

**Status: IN PROGRESS — visual foundation refined; browser QA incomplete**

**Prerequisites:** Approved logo asset and brand palette; authorization to install only the UI and animation libraries used by the initial shell.

**Acceptance criteria:** The unchanged original logo is presented accessibly; responsive header, mobile navigation, homepage introduction, basic category sections, and footer render; navigation works; reduced-motion behavior is implemented; lint and production build pass. Catalogue, account, cart, and transaction features remain future work.

**Implemented so far:** Semantic design tokens, provisional Manrope/Cormorant Garamond typography, shadcn/ui JavaScript configuration and button foundation, React Icons, and Motion for React transitions for the mobile menu and hero carousel. The homepage has an image-led three-slide hero, two illustrated category groups with approved category examples, Rent/Buy discovery panels, an informational shopping journey, category-only search, a PIN form that does not claim serviceability, informative future account/cart/wishlist states, and an expanded footer. Product cards are not populated because verified catalogue data is unavailable. Responsive breakpoints and reduced-motion CSS are present. Visual checks at 375px, 768px, and 1440px, mobile-menu and carousel interaction, and browser-console checks remain unverified because no browser is exposed to this session. Recheck these before marking this phase complete. This phase does not complete a catalogue or shopping workflow.

### Phase 3C — Commerce homepage visual refinement

**Status: IMPLEMENTED — lint/build and local HTTP checks passed; visual/browser QA incomplete**

**Prerequisites:** Existing JavaScript Next.js application and confirmed logo/colors.

**Implemented:** Homepage, header, footer, styles, and design/architecture documentation were updated. Two locally optimized, generated illustrative interior images are documented as not representing actual inventory. No dependencies were added.

**Remaining acceptance checks:** Inspect the rendered page at mobile, tablet, and desktop widths; exercise category-only search, PIN message, CTAs, menu keyboard behavior, and header informational states; inspect browser console and image presentation. Browser automation is not available in the current session, so this phase is not marked fully verified.

### Phase 3D — Commerce navbar and hero carousel

**Status: IMPLEMENTED — lint/build and local HTTP checks passed; browser interaction/viewport QA incomplete**

**Implemented:** The header has a compact factual region/currency strip and responsive shopping row. The hero is a three-slide manually controlled carousel with transparent illustrative furniture/appliance cutouts, a soft-sage field over warm ivory, editorial copy, rounded Rent/Buy actions, previous/next controls, slide indicators, focused-viewport arrow-key support, in-page CTAs, and Motion transitions that respect reduced motion. The same semantic colors and layout conventions are documented for later customer and operations screens. Autoplay is intentionally omitted. Existing category, Rent/Buy, journey, and footer sections were retained.

**Verification evidence:** ESLint and production build passed after this refinement. The running development server returned HTTP 200 for the homepage, original logo, and all three new cutout WebP assets. Browser-based carousel/mobile-menu interaction, keyboard operation, console inspection, and actual mobile/tablet/desktop layout checks remain outstanding; no browser surface is exposed in this session. Do not mark this phase fully verified until those checks are performed.

### Phase 3E — Homepage category discovery

**Status: SUPERSEDED by Phase 3F**

**Implemented:** Replaced the two broad category panels with ten category-specific illustrative image cards for the confirmed furniture and appliance examples. Added All Categories, Furniture, and Home Appliances frontend filters, accessible pressed states, responsive card columns, retained category-navigation anchors, and card links to the existing Rent/Buy information section. Category imagery is AI-generated and labeled as illustrative; no catalogue results, counts, availability, prices, or offers are implied.

**Verification evidence:** The earlier filter-based category UI passed lint/build and local HTTP checks. It has been replaced by the simpler cutout showcase in Phase 3F.

### Phase 3F — Transparent category cutout showcase

**Status: IMPLEMENTED — lint/build and local asset checks passed; browser visual QA incomplete**

**Implemented:** Replaced the category photos and filters with two ordered five-category rows using transparent product cutouts, centered category names, responsive columns, keyboard-focus styling, and subtle reduced-motion-aware hover feedback. Category links lead to the existing Rent/Buy information section; no catalogue route or inventory claim is implied. The header, hero, footer, and other homepage sections were not changed.

**Verification evidence:** ESLint and production build passed. The homepage returned HTTP 200 and rendered all ten category labels. All ten local WebP assets returned HTTP 200 and were inspected with Sharp; each reports an alpha channel. The project contains no `.ts` or `.tsx` files. Browser-based responsive layout, hover/focus behavior, console, horizontal overflow, and screenshot checks remain incomplete because no browser is available in this session.

### Phase 3G — Rent/Buy banner refinement

**Status: IMPLEMENTED — lint/build passed; browser visual QA incomplete**

**Implemented:** Replaced the repeated sofa and appliance artwork with two new transparent, unbranded AI-generated illustrative concepts for the Rent and Buy banners. Adjusted the banner grid breakpoint and image composition so desktop can show paired promos while smaller layouts stack, with transparent cutouts contained on the right and text aligned on the left. Updated alt text and design-system asset notes. The images are illustrative concepts only and do not represent company inventory.

**Verification evidence:** `npm.cmd run lint` and `npm.cmd run build` passed. Generated PNG dimensions are 1774×887; PNG color type 6 confirms alpha support. A browser UI was not available in this session, so responsive appearance, CTA interaction, browser console, and horizontal-overflow checks remain outstanding.

### Phase 3H — Rental card actions and in-memory cart foundation

**Status: IMPLEMENTED — lint/build and local HTTP checks passed; browser interaction checks incomplete**

**Implemented:** Rental cards keep the product image, one ellipsized product-name line, and monthly INR price on the following line. The featured grid uses two columns on mobile/tablet and four on wide desktop; mobile card actions stack vertically for touch use. Hover-capable screens scale the card up subtly. On wide screens, Quick View and Add to Cart appear in a panel visually attached below the card without shifting other page content; keyboard focus reveals the same state and mouse leave collapses it. Added a lightweight app-session cart and `/cart` view with removal. Sample preview records are blocked from the cart outside development; adding an item does not reserve inventory or create a booking. No product-detail route exists, so no View Details action is shown.

**Verification evidence:** `npm.cmd run lint` and `npm.cmd run build` passed. Local development homepage and production homepage/cart returned HTTP 200; the production development-preview route returned 404, and sample product labels were absent from the production homepage. Browser visual and interaction checks remain outstanding because no supported browser surface is available in this session.

**Limitations:** Cart contents are not persisted and there is no backend pricing validation, rental plan/date selection, availability check, reservation, checkout, or payment processing.

### Phase 3I — Featured purchase products

**Status: IMPLEMENTED — lint/build and desktop browser interaction checks passed; mobile/tablet and console QA incomplete**

**Implemented:** Added a Featured Products to Buy section after rental products. It reuses the existing product-card design and Quick View dialog, showing a one-time INR amount without rental suffixes or rental-only terms. Local development loads four clearly labeled illustrative records and sample prices from a separate preview fixture. Production omits that fixture and shows the verified-catalogue empty state. The in-memory cart now separates rental and purchase line items; its cart view labels modes and displays the corresponding price type. Sample products remain blocked from the cart outside development. No order or inventory reservation is created.

**Verification evidence:** ESLint and the optimized production build passed. The production homepage artifact contains the purchase section and empty state, with no preview product name, sample amount, or preview notice. The development homepage and cart routes returned HTTP 200 and showed all four purchase previews with INR amounts and no `/mo` label. In Chrome at a 1140px window, the purchase cards rendered in a four-column row; hovering revealed the actions below the details, Quick View opened with one-time purchase pricing and no rental terms, and Add to Cart changed the header count and disabled the duplicate action. Mobile/tablet layout and browser-console checks remain incomplete. A focus change during a later cart-view attempt ended UI testing before the cart route could be inspected.

**Limitations:** Illustrative preview amounts are not approved purchase prices. Real purchase catalogue data, verified stock, server-side price validation, cart persistence, order creation, checkout, payment, and inventory reservation are not implemented.

### Phase 3J — Unified Rent / Buy featured products

**Status: IMPLEMENTED — lint, production build, and desktop browser interactions verified; responsive and console checks pending**

**Implemented:** Replaced the two adjacent homepage product sections with one Featured Products section. Rent is the initial selection; the Rent and Buy controls switch the visible collection in client-side React state. The existing `ProductCard` component and its card styling, Quick View, cart mode separation, development-only fixtures, and production preview-data filter are reused. The purchase-only homepage wrapper was removed; the rental wrapper remains for the dedicated development preview route.

**Verified:** ESLint and production build pass. Desktop browser checks confirmed each tab displays only its mode, rent prices include `/mo`, purchase prices do not, Quick View presents purchase pricing without rental terms, and Add to Cart updates cart state while preserving the selected mode. Production homepage output excludes preview records and sample prices. The existing long-running development server retained stale CSS during this check; restart it before visual review. Mobile/tablet and browser-console checks remain pending.

**Limitations:** Real catalogue data, verified pricing/stock, backend price validation, cart persistence, order creation, checkout, payment, and inventory reservation are not implemented.

### Phase 3K — Renting Made Simple homepage journey

  **Status: IMPLEMENTED — lint and production build passed for the latest UI refinements; browser layout checks pending**

  **Implemented:** Replaced the old informational three-step block with the four requested rental-journey steps, numbered 01–04 and paired with custom colorful furniture-rental illustrations. The subtitle is “Discover how renting with Rento Comforts works.” The unified section uses warm-ivory process cards: four columns on desktop, two on tablet, and one on mobile. The marker-to-heading gap is reduced. Each original transparent illustration is split from the source sprite into its own equal-sized PNG and displayed with `object-fit: contain`, preserving the artwork and proportions. The copy is informational and does not implement booking or promise operational behavior. Artwork was generated specifically for this project using the supplied screenshot as a style reference; source sprite: `public/images/renting-journey-illustrations.png`.

  **Verification:** ESLint and the production build passed after these refinements. CSS breakpoints define the desktop, tablet, and mobile layouts. Desktop/tablet/mobile visual checks and browser-console checks remain pending because no browser surface is available in this session.

### Phase 3L — Why Choose Rento Comforts homepage section

**Status: IMPLEMENTED — lint/build and source review passed; responsive browser checks pending**

**Implemented:** Added the editorial split section after Renting Made Simple. It pairs the existing illustrative living-room image with four approved factual points and restrained soft-sage React Icons. The pricing copy describes a planned display capability, and the image caption states that it is illustrative rather than a catalogue listing. At tablet widths, the heading and image sit side by side with the two-column benefits below. On mobile, the image sits between the introduction and the single-column benefits list. No operational business workflow was added.

**Verification:** ESLint and the production build passed. Desktop and tablet screenshots were inspected, and a mobile screenshot confirmed the intended heading → image → benefits order. The headless mobile capture reported a 512 CSS-pixel viewport despite a 375-pixel screenshot width, so exact 375 CSS-pixel visual verification remains outstanding. Browser-console checks remain pending.

### Phase 3M — Homepage FAQ section

**Status: IMPLEMENTED — ESLint and production build passed; browser interaction and responsive checks pending**

**Implemented:** Added `components/faq-section.jsx` after Why Choose Rento Comforts. The five approved FAQ entries use a single-open accessible accordion, with client-side search across question and answer text and an empty result state. The left visual uses the transparent `public/images/faq-lounge-cutout-v3.webp` illustration, with the plant left and chair facing right, plus CSS chat details. Two overlapping soft-sage organic forms extend behind the plant and chair; both remain clipped to the illustration area below the search field and above the support banner. The support banner is present, but Contact Support is disabled because no support route or contact method is configured. No backend workflow or new dependency was added.

**Verification:** `npm.cmd run lint` and `npm.cmd run build` passed. Source review confirmed the FAQ is after Why Choose in the homepage and the approved answers are used. A stale dev-server CSS artifact caused the initial unstyled render; restarting Next.js rebuilt the stylesheet, and the current server now returns the FAQ selectors. The new image also returns HTTP 200. Browser interaction, keyboard operation, responsive visual checks, overflow and console checks remain pending.

### Phase 3N — Approved dark-green footer

**Status: IMPLEMENTED — lint/build passed; desktop cutout rendering inspected; tablet/mobile and link/keyboard checks pending**

**Implemented:** Replaced the compact footer placeholder with the approved deep-forest layout, ivory SVG wave, original logo presented unchanged on a light tile, Shop/Company/Help navigation using available homepage anchors, decorative social icons pending verified account URLs, a Get Updates column with a disabled email field pending an approved signup workflow, a transparent furniture cutout placed over the continuous green background, four confirmed business highlights, and the current-year copyright line. Contact details and fake legal destinations were not added.

**Verification:** ESLint and production build passed. The 1536×1024 transparent WebP was composited over the footer green for visual review; the complete rug edge is visible in the replacement cutout. Source review confirmed the artwork is aligned within the viewport, the ivory wave and green background remain continuous, the social icon row is visual-only pending verified URLs, and the update signup remains disabled. The logo source remains the original JPEG and footer links target existing homepage anchors. A full rendered browser screenshot, tablet/mobile rendering, link activation, keyboard focus, console, and horizontal-overflow checks remain pending because the browser preview was unavailable.

## Phase 4 — Establish data, identity, and authorization foundations

**Status: NOT STARTED**

**Prerequisites:** Agreed initial domain model, inventory policy, customer/staff roles, and approved Supabase/Prisma setup.

**Acceptance criteria:** Database migrations/schema and authentication integration are implemented and verified; role enforcement is server-side; privileged actions have appropriate audit records; documented setup reflects real behavior.

## Phase 5 — Build catalogue and inventory visibility

**Status: NOT STARTED**

**Prerequisites:** Product data requirements, image/content ownership, approved design direction, and inventory policy.

**Acceptance criteria:** Admin can manage initial product information and images; customers can browse, search, filter, and inspect details; rent/buy availability is explicit; out-of-stock sales are blocked securely; INR is used consistently.

## Phase 6 — Implement customer order and rental request workflows

**Status: NOT STARTED**

**Prerequisites:** Approved checkout, rental request, availability confirmation, price, fee, tax, deposit, and cancellation rules; payment integration setup approval.

**Acceptance criteria:** Customer intent is recorded accurately; stock checks and important state changes are server-side and safe under concurrent requests; manual-confirmation cases cannot appear guaranteed; payment state is verified through trusted Razorpay integration; error and retry paths are reviewed.

## Phase 7 — Implement operations and delivery workflows

**Status: NOT STARTED**

**Prerequisites:** Agreed order/rental lifecycle, delivery/pickup process, staff roles, and service boundaries.

**Acceptance criteria:** Authorized admins can manage operational records; delivery team can use assigned mobile-friendly tasks; delivery, pickup, return, and deposit records follow approved transitions; critical changes are traceable.

## Phase 8 — Support, hardening, and launch readiness

**Status: NOT STARTED**

**Prerequisites:** Core flows implemented and business policies approved.

**Acceptance criteria:** Support and maintenance entry points work; accessibility, mobile usability, security, payment reconciliation, backups, monitoring, and failure recovery are reviewed; launch content and legal wording are supplied and approved; release procedures are documented.

## Deferred feature evaluation

Daily/weekly and quarterly/annual plans, rent-to-own, EMI, coupons, reviews, comparison, bundles, loyalty, AI recommendations, corporate rentals, multiwarehouse support, wishlist, notifications, exchange/upgrade workflows, detailed analytics, and advanced automation are **PROPOSED**. Decide separately whether any belong after the core launch. Recharts is proposed for analytics only; it is not confirmed.
