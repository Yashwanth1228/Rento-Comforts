# Architecture

> The frontend foundation and initial visual shell are implemented. No backend, database schema, authentication, or business workflows are implemented. Integrations below remain planned only.

## Implemented application

- Next.js `16.4.2` App Router with React `19.3.0`.
- JavaScript and JSX; there are no TypeScript source or configuration files.
- Tailwind CSS `4.3.3`, ESLint `9.39.5`, npm, and the `@/*` import alias.
- `app/layout.js` provides the root document and page metadata. `app/page.js` renders the hero carousel, category discovery, Rent/Buy explanations, featured products, the informational four-step rental journey, Why Choose Rento Comforts, and the FAQ section. The journey is static educational content; no booking, availability, confirmation, delivery-tracking, or rental-management workflow is implemented. `components/category-discovery.jsx` owns the category grid and frontend-only category-family filters. `components/why-choose-rento.jsx` presents confirmed business facts alongside existing illustrative lifestyle imagery. `components/faq-section.jsx` provides a searchable, single-open FAQ accordion; its support CTA is disabled because no support destination is configured. `app/globals.css` contains Tailwind imports, semantic design tokens, global styles, and responsive rules.
- `components/site-header.jsx` renders the three-layer responsive editorial header, local category-only search suggestions, a six-digit PIN entry that does not claim serviceability, hover/focus/click category mega menus, and touch-friendly mobile accordions. `data/mega-menu-navigation.js` centrally defines the approved Furniture, Appliances, Combos, and Packers & Movers taxonomy as stable group/item IDs with explicit planned status and optional destinations. All subcategories are noninteractive until catalogue or service destinations exist; the desktop furniture/appliance promotional CTAs lead only to the existing illustrative category-discovery section. Mobile navigation expands a main category and then an individual group. Menu listings do not confirm product stock, bundle availability, or moving-service operations. Account and wishlist remain informational; the cart link displays the current in-memory cart item count. Track Order and Contact Us are noninteractive until destinations exist.
- `components/cart-provider.jsx` provides a frontend-only in-memory cart for the current app session. Cart lines distinguish rent and buy modes using separate keys. Rental plans/dates remain pending, and adding either mode does not reserve inventory or create a booking/order. Development preview products are rejected outside development. There is no persistence, server-side price validation, availability/stock check, checkout, or payment integration.
- `components/rental-product-card.jsx` exports a shared `ProductCard` (and the existing `RentalProductCard` alias). Rent mode renders a monthly INR amount; buy mode renders a one-time purchase amount. Both retain the existing image/name/actions presentation and accessible native Quick View dialog. Purchase Quick View conditionally displays supplied brand/category/specification/warranty data and only shows stock status when the record marks it verified. Product-detail routes do not exist yet, so no View Details action is shown.
- `components/featured-products.jsx` is the single homepage product-discovery section. It uses React state to switch between rent and buy collections, defaults to rent, and renders only the selected collection through the shared `ProductCard`. `app/page.js` imports illustrative rental and purchase fixtures only in development; the component filters preview-only records in production and shows a mode-appropriate empty state until approved catalogue records are connected. The purchase fixture and its sample amounts remain in `data/featured-purchase-products.preview.js`; they are illustrative and do not represent actual inventory or approved prices. `components/featured-rental-products.jsx` remains used by the isolated development preview route.
- The `/cart` route can display both modes, uses one-time purchase price without `/mo` for purchase items, and rental monthly price for rentals. It does not total the items or place an order.
- `components/hero-carousel.jsx` renders three manually controlled hero slides. It uses the existing Motion for React package and Next.js image handling; controls include previous/next buttons, slide indicators, and left/right keyboard keys while the viewport is focused. Autoplay is not enabled. Each slide's local image is explicitly labeled illustrative.
- `components/site-footer.jsx` renders the original logo on an ivory light tile, a CSS/SVG ivory wave, working links to existing homepage anchors, noninteractive text for unimplemented navigation destinations, decorative social icons without links (official account URLs are unconfirmed), four business highlights, a dynamic copyright year, and a transparent furniture cutout (`public/images/footer-lounge-cutout-v2.png`). The desktop cutout is contained in a separate lower-right layer to keep the chair, table, and rug clear of navigation and highlights; tablet layout moves it into its own row and mobile hides it. The Get Updates input and button are disabled and do not collect email because no signup workflow or privacy handling is approved. Legal/contact destinations and social URLs remain pending. `components/ui/button.jsx` remains the configured JavaScript shadcn/ui button primitive; `lib/utils.js` provides its shared class-name helper.
- `public/images/rento-living-room.webp`, `public/images/furniture-bedroom.webp`, and `public/images/home-appliances.webp` are locally stored, optimized AI-generated illustrative interiors for category discovery. `public/images/hero-living-room-cutout.webp`, `public/images/hero-bedroom-cutout.webp`, and `public/images/hero-appliances-cutout.webp` are transparent illustrative cutouts for the hero carousel. `public/images/faq-lounge-cutout-v3.webp` is a separate transparent generated lounge-chair and plant illustration used by the FAQ. None represent actual inventory or catalogue records. Design and asset origin/usage notes are in [Design System](DESIGN_SYSTEM.md).
- Ten `public/images/category-*-cutout.webp` files provide transparent illustrative category cutouts for sofas, beds, wardrobes, dining tables, study tables, refrigerators, washing machines, televisions, air conditioners, and microwaves. They are not product listings or availability indicators. `CategoryDiscovery` is a server-rendered component; its accessible links target the homepage Rent/Buy information section because catalogue routes have not been implemented.
- `public/brand/rento-comforts.jpeg` is the original supplied JPEG logo copied without modification. It is shown at its original proportions on a white surface.
- `components.json` configures shadcn/ui for JavaScript and the existing aliases. React Icons supply the icons in the current shell. Motion for React animates the mobile navigation.
- `jsconfig.json`, `next.config.mjs`, `eslint.config.mjs`, `.gitignore`, `package.json`, and `package-lock.json` configure aliases, framework behavior, linting, ignored files, and npm scripts/dependencies.
- React Compiler remains disabled. No optional experimental Next.js features are enabled.

The current UI is a commerce-facing visual foundation, not a working catalogue or sales/rental service. Category search matches only approved category examples and links to those labels; PIN entry always discloses that serviceability is not validated. Account and wishlist remain informational. The cart is an in-memory interface prototype only; it does not persist, validate backend prices, check availability, reserve inventory, or submit orders. No production product catalogue, serviceability checks, or transaction processing exists.

## Planned integrations and stack

- Supabase Auth for authentication and Supabase PostgreSQL as the planned database.
- Prisma as the planned data access/schema tooling.
- Cloudinary for product media.
- Razorpay for payment processing.

These are planned only; no services, schemas, secrets, or integrations have been configured. Compatibility, responsibilities, hosting, and deployment details must be confirmed during later implementation.

## Planned application areas

1. **Storefront:** product discovery, search/filter, product detail, rent/buy options, stock and rental availability status.
2. **Customer account and checkout:** account access, requests/orders, payment flow, rental lifecycle, delivery/pickup details, deposit visibility, and support.
3. **Admin operations:** controlled tools for products, inventory, orders, rentals, payments, support, and operational records.
4. **Delivery team portal:** responsive task views for delivery and pickup workflows, with access limited to information and actions needed for assigned work.
5. **Backend and integrations:** server-side business logic and trusted integration boundaries for database, auth, media, and payment services.

These are future conceptual boundaries. They are not implemented routes, modules, or APIs.

## Security and workflow principles

- Treat browser input as untrusted. Enforce authorization, pricing, inventory, payment state, and critical workflow transitions on trusted server-side code.
- Do not rely on the UI to prevent overselling or unauthorized admin actions.
- Use transaction-safe stock checks/reservations appropriate to the selected inventory model. Record important inventory and payment changes for audit and support.
- Distinguish a rental request from confirmed availability and fulfillment. Surface pending manual confirmation where arranging stock is needed.
- Model quantity-based inventory and individually tracked units as appropriate; the final data model and transition rules require business decisions.
- Keep secrets out of source control and client-visible code. Use provider-supported secret storage and environment configuration when setup is approved.
- Verify payment outcomes through trusted provider mechanisms before treating payment as settled; define idempotent handling and reconciliation during implementation.
- Apply least privilege to customer, admin, and delivery team access. Specify roles and sensitive actions before building permissions.

## Data concepts to evaluate later

Potential concepts include products, product media/specifications, inventory groups and tracked units, customers, carts or requests, orders, rental periods, delivery/pickup tasks, payments, deposits, support cases, staff roles, and audit events. This list is not a database schema. Fields, relationships, lifecycle rules, retention, and ownership are unapproved and unimplemented.

## Not yet decided

Hosting/deployment, environments, database migration and backup process, exact boundary between Supabase and Prisma responsibilities, availability/reservation algorithm, rental and order state machines, provider webhook strategy, audit retention, and role matrix. Resolve these incrementally before the relevant implementation phase.
