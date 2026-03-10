# CherryPick — Premium UI Templates Marketplace

CherryPick is a marketplace for premium UI templates targeting designers and developers. It offers Figma UI Kits, Framer templates, Code components, Bundling packages, and E-books.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, **shadcn/ui**, and **Supabase** as the backend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (template images) |
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
│   │   ├── feature/        # Featured kits
│   │   ├── work-in-progress/
│   │   └── coming-soon/
│   ├── (admin)/           # Admin-only pages (no Navbar/Footer)
│   │   ├── login/          # Admin login
│   │   └── dashboard/
│   │       ├── page.tsx    # Overview with stats
│   │       ├── templates/  # Template CRUD
│   │       ├── categories/ # Category CRUD
│   │       └── orders/     # Order management
│   ├── layout.tsx          # Root layout (fonts, global metadata)
│   ├── sitemap.ts          # Dynamic XML sitemap
│   └── robots.ts           # robots.txt
├── components/
│   ├── Dashboard/          # Admin dashboard components
│   ├── Card/               # Product cards
│   ├── Banner/             # CTA banners
│   ├── Section/            # Page sections
│   ├── Elements/           # UI primitives
│   └── Navbar.tsx / Footer.tsx
└── lib/
    ├── supabase/
    │   ├── client.ts       # Browser Supabase client
    │   ├── server.ts       # Server Supabase client
    │   ├── middleware.ts   # Session refresh helper
    │   └── types.ts        # TypeScript DB types
    └── utils.ts

supabase/
├── migration.sql           # Full DB schema + RLS policies
└── seed.sql                # Sample data
```

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the migration

In the Supabase dashboard, open the **SQL Editor** and paste the contents of `supabase/migration.sql`. Run it to create all tables, enums, indexes, RLS policies, and triggers.

### 3. (Optional) Run seed data

In the SQL Editor, paste and run `supabase/seed.sql` to populate the database with sample categories, templates, reviews, and FAQs.

### 4. Create the storage bucket

In the Supabase dashboard, go to **Storage** and create a bucket named `template-images` with **public access** enabled.

Add these storage policies (in Storage > Policies):
- **SELECT**: `true` (public read)
- **INSERT/UPDATE/DELETE**: `(select role from profiles where id = auth.uid()) = 'admin'`

### 5. Create an admin user

1. In Supabase dashboard, go to **Authentication > Users** and create a new user with your email/password.
2. In the **SQL Editor**, run:

```sql
update public.profiles
set role = 'admin'
where id = '<your-user-uuid>';
```

### 6. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

You can find `SUPABASE_URL` and `SUPABASE_ANON_KEY` in **Project Settings > API**.

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
| `NEXT_PUBLIC_SITE_URL` | Production URL for SEO canonical URLs and sitemap | Yes (prod) |

---

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | Extends Supabase auth users with `role` (admin/customer) |
| `categories` | Template categories (UI Kit, Framer, Code, Bundling, E-book, Webflow) |
| `templates` | Core product table — title, slug, price, status, metadata |
| `template_images` | Gallery images per template, with primary image flag |
| `reviews` | Customer testimonials (admin-managed) |
| `faqs` | Frequently asked questions (admin-managed) |
| `orders` | Purchase records (ready for payment integration) |

All tables have **Row Level Security (RLS)** enabled:
- Public users can read published templates, categories, reviews, and FAQs
- Only admin users can create, update, or delete any records

---

## Routes

### Public

| Route | Page |
|-------|------|
| `/` | Home — hero, featured templates, FAQs |
| `/template` | Template listing with category filter |
| `/template/[slug]` | Template detail with image gallery |
| `/feature` | Featured kits |
| `/work-in-progress` | Templates in development |
| `/coming-soon` | Placeholder for blog, cart, etc. |

### Admin (requires login)

| Route | Page |
|-------|------|
| `/login` | Admin login |
| `/dashboard` | Overview stats |
| `/dashboard/templates` | Template list |
| `/dashboard/templates/new` | Create template |
| `/dashboard/templates/[id]/edit` | Edit template |
| `/dashboard/categories` | Category CRUD |
| `/dashboard/orders` | Order management |

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
3. Add the environment variables in Vercel project settings
4. Deploy

Remember to update `NEXT_PUBLIC_SITE_URL` to your production domain.
