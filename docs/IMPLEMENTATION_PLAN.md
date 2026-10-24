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
