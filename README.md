# Next.js Store

Full-stack e-commerce application built with Next.js 14 App Router, featuring authentication, product management, cart, favorites, reviews, and Stripe payments.

**Live demo:** https://nextjs-store-roan-eight.vercel.app/

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| ORM | Prisma v7 |
| Database | PostgreSQL (hosted on Supabase) |
| Auth | Clerk |
| Image Storage | Supabase Storage |
| Payments | Stripe (Embedded Checkout) |
| Validation | Zod |
| Dark mode | next-themes |
| Deploy | Vercel |

---

## Quick Commands

```bash
# Development
npm run dev          # start dev server on http://localhost:3000

# Production
npm run build        # prisma generate + next build
npm run start        # start production server

# Linting
npm run lint
```

### Prisma

```bash
# Push schema changes to DB (no migration history)
npx prisma db push

# Generate Prisma client (required after any schema change)
npx prisma generate

# Open Prisma Studio (GUI to inspect/edit data)
npx prisma studio

# Seed the database with sample products
node prisma/seed.js
```

> **When to run what after modifying `schema.prisma`:**
> 1. `npx prisma db push` — syncs the DB schema (also calls generate automatically)
> 2. If Prisma Client types are stale in the editor, restart the TS server

---

## Environment Variables

Create a `.env` file in the project root. All variables below are required.

```env
# ── Database (Supabase PostgreSQL) ────────────────────────────────────────────
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# ── Clerk (Authentication) ────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect config
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Admin: copy your Clerk user ID from the Clerk dashboard → Users
ADMIN_USER_ID=user_...

# ── Supabase Storage (images) ─────────────────────────────────────────────────
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_KEY=eyJ...   # service_role key (Settings → API)
SUPABASE_PROJECT=[project-ref]

# ── Stripe (Payments) ─────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000   # change to prod URL on Vercel
```

**Where to get each value:**

- **DATABASE_URL** — Supabase dashboard → Project Settings → Database → Connection string (use the *pooler* URI for serverless)
- **Clerk keys** — [clerk.com](https://clerk.com) → Your app → API Keys
- **ADMIN_USER_ID** — Clerk dashboard → Users → click your user → copy User ID
- **SUPABASE_URL / SUPABASE_KEY** — Supabase dashboard → Project Settings → API (use `service_role` key, not `anon`)
- **Stripe keys** — [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys

> **Note on Prisma v7:** the database URL is read from `prisma.config.ts`, not from `schema.prisma` directly. The `prisma.config.ts` file reads `DATABASE_URL` from `.env` automatically via `dotenv/config`.

---

## Project Structure

```
.
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home (hero + featured products)
│   ├── about/                  # About page
│   ├── products/
│   │   ├── page.tsx            # Product listing with search
│   │   └── [id]/page.tsx       # Single product detail
│   ├── cart/page.tsx           # Shopping cart
│   ├── checkout/page.tsx       # Stripe Embedded Checkout
│   ├── favorites/page.tsx      # Saved favorites (auth required)
│   ├── orders/page.tsx         # Order history (auth required)
│   ├── reviews/page.tsx        # User's reviews (auth required)
│   ├── sign-in/ / sign-up/     # Clerk auth pages
│   ├── admin/                  # Admin-only area
│   │   ├── products/           # CRUD products
│   │   └── sales/              # Paid orders dashboard
│   └── api/
│       ├── payment/route.ts    # POST — creates Stripe checkout session
│       └── confirm/route.ts    # GET — Stripe return URL, marks order as paid
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── navbar/                 # Navbar, CartButton, NavSearch, DarkMode, UserIcon
│   ├── home/                   # Hero, HeroCarousel, FeaturedProducts
│   ├── products/               # ProductsGrid, ProductsList, FavoriteToggleButton
│   ├── single-product/         # AddToCart, BreadCrumbs, SelectProductAmount, ShareButton
│   ├── cart/                   # CartItemsList, CartTotals, CartItemColumns
│   ├── reviews/                # ReviewCard, SubmitReview, Rating, Comment
│   ├── form/                   # Reusable form primitives (FormInput, ImageInput, etc.)
│   ├── global/                 # Container, SectionTitle, EmptyList, loading skeletons
│   └── Login/                  # Login prompt component
├── utils/
│   ├── actions.ts              # All Server Actions (product, cart, order, review, favorite)
│   ├── db.ts                   # Prisma client singleton
│   ├── supabase.ts             # Supabase storage helpers (upload/delete image)
│   ├── schemas.ts              # Zod validation schemas
│   ├── types.ts                # Shared TypeScript types
│   ├── format.ts               # Formatting helpers (price, date)
│   └── links.ts                # Navbar link definitions
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.js                 # Seed script (faker.js)
│   └── products.json           # Seed data
├── prisma.config.ts            # Prisma v7 config (reads DATABASE_URL)
├── middleware.ts               # Clerk auth middleware + admin route guard
└── tailwind.config.ts
```

---

## Routes & Access Control

| Route | Auth | Admin only |
|---|---|---|
| `/` | Public | |
| `/products` | Public | |
| `/products/[id]` | Public | |
| `/about` | Public | |
| `/sign-in` / `/sign-up` | Public | |
| `/cart` | Required | |
| `/checkout` | Required | |
| `/favorites` | Required | |
| `/orders` | Required | |
| `/reviews` | Required | |
| `/admin/**` | Required | Yes |

Route protection is handled in `middleware.ts` via Clerk. Admin access is granted to the single user whose Clerk ID matches `ADMIN_USER_ID`.

---

## Database Schema (Prisma)

```
Product
  ├── id, name, company, description, featured, image, price
  ├── clerkId (creator)
  ├── favorites   → Favorite[]
  ├── reviews     → Review[]
  └── cartItems   → CartItem[]

Favorite
  ├── id, clerkId, productId
  └── product → Product (onDelete: Cascade)

Review
  ├── id, clerkId, rating, comment, authorName, authorImageUrl, productId
  └── product → Product (onDelete: Cascade)

Cart
  ├── id, clerkId
  ├── numItemsInCart, cartTotal, shipping, tax, taxRate, orderTotal
  └── cartItems → CartItem[]

CartItem
  ├── id, amount, productId, cartId
  ├── product → Product (onDelete: Cascade)
  └── cart → Cart (onDelete: Cascade)

Order
  └── id, clerkId, email, products, orderTotal, tax, shipping, isPaid
```

---

## Payment Flow (Stripe)

The checkout uses **Stripe Embedded Checkout** (no redirect to Stripe-hosted page).

1. User clicks "Place Order" on `/cart` → `createOrderAction` creates an unpaid `Order` in the DB and redirects to `/checkout?orderId=...&cartId=...`
2. `/checkout` page calls `POST /api/payment` with `orderId` + `cartId`
3. `/api/payment` creates a Stripe Checkout Session with `ui_mode: "embedded"` and returns the `clientSecret`
4. Stripe Embedded Checkout renders inside the page
5. After payment, Stripe redirects to `/api/confirm?session_id=...`
6. `/api/confirm` verifies the session, sets `order.isPaid = true`, deletes the cart, and redirects to `/orders`

---

## Admin Panel

Accessible at `/admin` only when logged in as the `ADMIN_USER_ID` user.

- **Products** — create, edit, delete products (with Supabase image upload)
- **Sales** — view all paid orders

---

## Image Storage

Product images are stored in a Supabase Storage bucket named `main-bucket`. The bucket must exist and be set to **public** for image URLs to work.

- Upload: `utils/supabase.ts → uploadImage()`
- Delete: `utils/supabase.ts → deleteImage()`
