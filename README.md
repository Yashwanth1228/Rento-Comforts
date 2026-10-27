# Rento Comforts

Rento Comforts is a company-owned furniture and home-appliance rental and sales business launching in Bengaluru, Karnataka, India. The business is rental-first, with selected products also available to buy.

## Current project status

The JavaScript Next.js App Router foundation and an initial responsive customer-facing visual shell are implemented. The homepage includes a development-only rental-card preview and a frontend-only in-memory cart with a `/cart` view. Catalogue data, account, wishlist, checkout, backend, database schema, authentication, and third-party integrations are not implemented. The cart is not persisted and does not validate prices, check availability, reserve inventory, or create bookings.

## Run locally

Requirements: Node.js 20.9 or later and npm. The project was developed with Node.js `v24.19.0` and npm `11.17.0`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build and local production server:

```bash
npm run build
npm run start
```

Run ESLint with:

```bash
npm run lint
```

Installation, lint, and production build were verified. The homepage currently responds through the existing development server. The production `start` command is provided for running a built app and was not separately exercised in this visual-foundation task. The development server may choose another port if port 3000 is already occupied.

## Technology

Installed: Next.js App Router, React, JavaScript/JSX, Tailwind CSS, ESLint, npm, shadcn/ui configuration, React Icons, and Motion for React. The `@/*` alias is configured. TypeScript and React Compiler are not enabled.

Planned for later, not connected: Supabase Auth, Supabase PostgreSQL, Prisma, Cloudinary, and Razorpay. Additional proposed features and tools remain subject to the decisions in [Project brief](docs/PROJECT_BRIEF.md).

## Project structure

- `app/` — root layout, homepage, cart route, and global stylesheet.
- `components/` — customer website header/footer, rental product cards, in-memory cart provider, and configured shadcn button.
- `lib/` — small shared class-name utility used by the button.
- `public/brand/` — original Rento Comforts logo JPEG, preserved unchanged.
- `docs/` — project scope, visual guidance, architecture notes, and phased plan.
- `AGENTS.md` — working rules for coding agents.
- `components.json` — shadcn/ui JavaScript and project alias configuration.
- `jsconfig.json` — JavaScript editor and `@/*` import alias settings.
- `next.config.mjs` — Next.js configuration.
- `eslint.config.mjs` — ESLint configuration.
- `package.json` / `package-lock.json` — npm scripts and dependency versions.

## Business direction

The planned service includes a customer catalogue, account and checkout journeys, orders, rentals, delivery/pickup coordination, deposit tracking, and support. Admin users will manage products, inventory, orders, rentals, payments, customer support, and operations. A mobile-friendly delivery team portal is part of the direction. Sales must honor available stock. Rental requests that need stock arrangements require manual confirmation before fulfillment is promised.

All prices and monetary amounts must use Indian rupees (INR, ₹). Actual prices, deposits, taxes, delivery fees, cancellation terms, damage deductions, refund timings, and legal wording are unresolved and must be approved by the business.

## Documentation

- [Agent and coding workflow](AGENTS.md)
- [Project brief and scope](docs/PROJECT_BRIEF.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
