# Project Brief

## Status labels

- **CONFIRMED** — explicitly supplied project requirement.
- **PROPOSED** — client suggestion for evaluation; not approved for launch.
- **UNRESOLVED** — decision or business information is still needed.

## Business and product scope

### CONFIRMED

- Rento Comforts is a real-world furniture and home-appliance rental and sales business launching in Bengaluru, Karnataka, India.
- Inventory is owned by the company; this is not a marketplace.
- The business model is rental-first. Selected products may also be offered for purchase.
- Initial service region is Bengaluru. Use INR (₹) for prices and monetary values throughout; never display USD prices.
- Product catalogue covers furniture and appliances, with product images, descriptions, specifications, search, and filtering.
- A product may support rent, buy, or both.
- Planned customer workflows include accounts, checkout, orders, rentals, delivery and pickup, deposit tracking, maintenance, and support.
- Admin roles cover products, inventory, orders, rentals, payments, customer support, and operations.
- A mobile-friendly delivery team portal is part of the project direction.
- Sales must respect available stock and show out-of-stock status.
- Rental requests that depend on arranging stock may need manual availability confirmation. Do not promise fulfillment before that confirmation.
- Inventory is hybrid: track quantities for suitable stock and individual units where needed.
- Critical inventory, payment, and permission checks must be enforced securely on the backend.
- Planned stack: Next.js App Router, React, JavaScript (not TypeScript), Tailwind CSS, Supabase Auth, Supabase PostgreSQL, Prisma, Cloudinary, and Razorpay.
- Original brand logo remains unchanged. Approved color guidance and visual principles are in [Design system](DESIGN_SYSTEM.md).

### PROPOSED — evaluate for launch vs later

Daily/weekly rental plans; quarterly/annual plans; rent-to-own; EMI; coupons; ratings/reviews; comparison; bundles; loyalty; AI recommendations; corporate rentals; multiwarehouse functionality; wishlist; notifications; exchange/upgrade workflows; detailed analytics; and advanced operational automation. Recharts is proposed for analytics, not confirmed.

These are ideas only. Do not implement or represent them as committed scope without an explicit business decision.

## Launch priorities

1. Establish a reliable catalogue and accurate product availability.
2. Support clear rental and purchase intent, with fulfillment confirmation where required.
3. Securely manage customer requests, payments, inventory, deliveries/pickups, deposits, and support.
4. Provide practical admin and mobile delivery workflows.
5. Keep the first release small enough for one developer to build, verify, and operate.

## UNRESOLVED business decisions

- Actual product prices, rental durations/plans, and which products are purchasable.
- Security deposit rules and amounts, taxes, delivery and pickup fees, and applicable invoicing details.
- Cancellation terms, damage deductions, refund timings, and legal wording.
- Which rental requests require manual review, who confirms them, and expected response times.
- Bengaluru service boundaries, delivery capacity, scheduling windows, and operational processes.
- Inventory rules for reserving units between request, confirmation, payment, delivery, return, inspection, and maintenance.
- Admin role definitions and who may perform sensitive actions.
- Launch selection from the proposed feature list.

Do not fill these gaps with assumed business policy. Record approved decisions before they are needed in implementation.
