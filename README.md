# CherryPick — Premium UI Templates Marketplace

CherryPick is a marketplace for premium UI templates targeting designers and developers. It offers Figma UI Kits, Framer templates, Code components, Bundling packages, and E-books.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, **shadcn/ui**, **Supabase** as the backend, and **Lemon Squeezy** for payments.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (template images) |
| Payments | Lemon Squeezy |
| Language | TypeScript 5 |
| Font | Manrope (Google Fonts) |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages (Navbar + Footer)
│   │   ├── page.tsx        # Home
│   │   ├── template/
│   │   │   ├── page.tsx    # Template listing
│   │   │   └── [slug]/     # Dynamic template detail
│   │   ├── order-success/  # Post-checkout confirmation page
│   │   ├── feature/        # Featured kits
│   │   ├── work-in-progress/
│   │   └── coming-soon/
│   ├── api/
│   │   ├── checkout/       # POST — creates Lemon Squeezy checkout session
│   │   └── webhooks/
│   │       └── lemonsqueezy/  # POST — handles LS order events
│   ├── (admin)/           # Admin-only pages (no Navbar/Footer)
│   │   ├── login/          # Admin login
│   │   └── dashboard/
│   │       ├── page.tsx    # Overview with stats
│   │       ├── templates/  # Template CRUD (includes LS Variant ID field)
│   │       ├── categories/ # Category CRUD
│   │       └── orders/     # Order management (populated by LS webhooks)
│   ├── layout.tsx          # Root layout (fonts, CartProvider, CartSheet)
│   ├── sitemap.ts          # Dynamic XML sitemap
│   └── robots.ts           # robots.txt
├── components/
│   ├── Cart/
│   │   └── CartSheet.tsx   # Slide-over cart panel
│   ├── Dashboard/          # Admin dashboard components
│   ├── Card/               # Product cards (Detail cards have Buy Now + Add to Cart)
│   ├── Banner/             # CTA banners
│   ├── Section/            # Page sections
│   ├── Elements/           # UI primitives
│   └── Navbar.tsx / Footer.tsx
├── contexts/
│   └── CartContext.tsx     # Cart state (localStorage-persisted)
└── lib/
    ├── lemonsqueezy.ts     # LS API client + webhook signature verification
    ├── supabase/
    │   ├── client.ts       # Browser Supabase client
    │   ├── server.ts       # Server Supabase client
    │   ├── middleware.ts   # Session refresh helper
    │   └── types.ts        # TypeScript DB types
    └── utils.ts

supabase/
├── migration.sql               # Full DB schema + RLS policies
├── lemonsqueezy_migration.sql  # Adds LS fields to templates and orders
└── seed.sql                    # Sample data
```

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the migration

In the Supabase dashboard, open the **SQL Editor** and paste the contents of `supabase/migration.sql`. Run it to create all tables, enums, indexes, RLS policies, and triggers.

### 3. Run the Lemon Squeezy migration

In the SQL Editor, run `supabase/lemonsqueezy_migration.sql` to add the Lemon Squeezy fields to `templates` and `orders`.

### 4. (Optional) Run seed data

In the SQL Editor, paste and run `supabase/seed.sql` to populate the database with sample categories, templates, reviews, and FAQs.

### 5. Create the storage bucket

In the Supabase dashboard, go to **Storage** and create a bucket named `template-images` with **public access** enabled.

Add these storage policies (in Storage > Policies):
- **SELECT**: `true` (public read)
- **INSERT/UPDATE/DELETE**: `(select role from profiles where id = auth.uid()) = 'admin'`

### 6. Create an admin user

1. In Supabase dashboard, go to **Authentication > Users** and create a new user with your email/password.
2. In the **SQL Editor**, run:

```sql
update public.profiles
set role = 'admin'
where id = '<your-user-uuid>';
```

### 7. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com

LEMONSQUEEZY_API_KEY=your-api-key
LEMONSQUEEZY_STORE_ID=your-store-id
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
```

You can find `SUPABASE_URL` and `SUPABASE_ANON_KEY` in **Project Settings > API**.
You can find `SUPABASE_SERVICE_ROLE_KEY` in **Project Settings > API > Service role**.

---

## Lemon Squeezy Setup

Lemon Squeezy is the payment provider. It handles checkout, payments, and digital file delivery (download links are sent by LS via email after purchase).

### 1. Create a Lemon Squeezy account

Sign up at [lemonsqueezy.com](https://www.lemonsqueezy.com).

### 2. Create a Store

In the LS dashboard, go to **Settings > Store** and create your store. Note your **Store ID** — it's the number in the URL or shown in the settings page.

### 3. Create a Product for each template

For each template you want to sell:

1. Go to **Products > Add Product**.
2. Set the product name, price, and description.
3. Under the product, there will be at least one **Variant** created automatically.
4. Click on the variant to view its details. Copy the **Variant ID** from the URL — e.g., in `https://app.lemonsqueezy.com/products/123/variants/456789`, the Variant ID is `456789`.

### 4. Add the Variant ID to your template in CherryPick

In the admin dashboard at `/dashboard/templates/[id]/edit`, paste the **Variant ID** into the **Lemon Squeezy Variant ID** field. This links your CherryPick template to the LS product variant.

Once a variant ID is set, the **Buy Now** and **Add to Cart** buttons will become active on the template detail page.

### 5. Get your API Key

Go to **Settings > API** in the LS dashboard and create an API key. Copy it to `LEMONSQUEEZY_API_KEY` in your `.env.local`.

### 6. Configure the Webhook

Webhooks are how Lemon Squeezy notifies your site after a purchase. You need to register your webhook URL.

1. Go to **Settings > Webhooks** in the LS dashboard.
2. Click **Add Webhook**.
3. Set the **URL** to: `https://your-domain.com/api/webhooks/lemonsqueezy`
4. Under **Events**, enable:
   - `order_created`
   - `order_refunded`
5. Set a **Signing Secret** — this is any random string you choose. Copy it to `LEMONSQUEEZY_WEBHOOK_SECRET` in your `.env.local`.
6. Save.

> **For local development**, use a tunnel like [ngrok](https://ngrok.com) or [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) to expose `localhost:3000` to the internet, then register that URL as your webhook.

### How the payment flow works

```
User clicks "Buy Now"
        │
        ▼
POST /api/checkout
(sends variantId + templateId to LS API)
        │
        ▼
LS returns a hosted checkout URL
        │
        ▼
User is redirected to Lemon Squeezy checkout
        │
        ▼
User completes payment on LS checkout page
        │
        ├──▶ LS sends webhook POST /api/webhooks/lemonsqueezy
        │         (order_created event)
        │         → Creates order in Supabase
        │         → Increments template sales_count
        │
        └──▶ LS redirects user to /order-success
             LS also emails the user a download link
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.

Open [http://localhost:3000/login](http://localhost:3000/login) to access the admin dashboard.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Yes |
| `NEXT_PUBLIC_SITE_URL` | Production URL for SEO and checkout redirect | Yes (prod) |
| `LEMONSQUEEZY_API_KEY` | Your Lemon Squeezy API key (server-only) | Yes |
| `LEMONSQUEEZY_STORE_ID` | Your Lemon Squeezy store ID | Yes |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret from LS dashboard | Yes |

---

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | Extends Supabase auth users with `role` (admin/customer) |
| `categories` | Template categories (UI Kit, Framer, Code, Bundling, E-book, Webflow) |
| `templates` | Core product table — title, slug, price, status, `lemon_squeezy_variant_id` |
| `template_images` | Gallery images per template, with primary image flag |
| `reviews` | Customer testimonials (admin-managed) |
| `faqs` | Frequently asked questions (admin-managed) |
| `orders` | Purchase records — populated by LS webhooks, includes `lemon_squeezy_order_id` and `customer_email` |

All tables have **Row Level Security (RLS)** enabled:
- Public users can read published templates, categories, reviews, and FAQs
- Only admin users can create, update, or delete any records
- The webhook handler uses the Supabase service role key to bypass RLS

---

## Routes

### Public

| Route | Page |
|-------|------|
| `/` | Home — hero, featured templates, FAQs |
| `/template` | Template listing with category filter |
| `/template/[slug]` | Template detail with image gallery, Add to Cart, Buy Now |
| `/order-success` | Post-checkout confirmation page |
| `/feature` | Featured kits |
| `/work-in-progress` | Templates in development |
| `/coming-soon` | Placeholder for blog, cart, etc. |

### API

| Route | Method | Description |
|-------|--------|-------------|
| `/api/checkout` | POST | Creates a Lemon Squeezy checkout session, returns `{ url }` |
| `/api/webhooks/lemonsqueezy` | POST | Receives LS webhook events, updates orders in Supabase |

### Admin (requires login)

| Route | Page |
|-------|------|
| `/login` | Admin login |
| `/dashboard` | Overview stats |
| `/dashboard/templates` | Template list |
| `/dashboard/templates/new` | Create template (includes LS Variant ID field) |
| `/dashboard/templates/[id]/edit` | Edit template |
| `/dashboard/categories` | Category CRUD |
| `/dashboard/orders` | Order management (populated by LS webhooks) |

### SEO

| Route | Description |
|-------|-------------|
| `/sitemap.xml` | Dynamic sitemap (all published templates) |
| `/robots.txt` | Crawler rules (blocks /dashboard, /login) |

---

## SEO Features

- Global metadata with Open Graph and Twitter Card tags
- Per-page `metadata` and `generateMetadata` for dynamic routes
- JSON-LD structured data: `Organization`, `WebSite` with SearchAction, `Product` (rich snippets), `FAQPage`, `BreadcrumbList`
- Dynamic XML sitemap with all published templates
- `robots.ts` blocking admin routes from crawlers
- Semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive alt texts on all images

---

## Deployment

Deploy to [Vercel](https://vercel.com) for the best Next.js experience:

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy
5. Register your production URL as the Lemon Squeezy webhook endpoint

Remember to update `NEXT_PUBLIC_SITE_URL` to your production domain.
