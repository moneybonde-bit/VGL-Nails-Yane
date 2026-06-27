# VGL Nails — Premium Nail Art Studio Website

A production-ready website for **VGL Nails**, a premium nail art studio in Bahodopi, Morowali, Sulawesi Tengah, Indonesia.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · TailwindCSS 3.4 · Supabase (Auth / DB / Storage) · Framer Motion

**Design:** Minimalist, mobile-first, premium feminine aesthetic inspired by Apple + Korean beauty sites. Soft whites, dusty pinks, rose gold accents.

---

## ✨ Features

### Public Website
- **Hero** — fullscreen with CTA buttons (Book Appointment + Gallery)
- **Gallery** — masonry grid, category filters (Simple/Luxury/Wedding/Character/Gel/Extension), fullscreen lightbox with keyboard navigation
- **Services** — icon cards for each service category
- **Pricing** — card-based layout (Basic/Premium/Luxury tiers + add-ons)
- **Testimonials** — auto-scrolling marquee cards with ratings
- **Location** — embedded Google Maps + "Open in Maps" button
- **FAQ** — animated accordion
- **Booking Form** — modal form with Supabase insert + WhatsApp fallback
- **Mobile Sticky CTA** — bottom bar with WhatsApp / Book Now / Maps
- **SEO** — full meta tags, Open Graph, JSON-LD (NailSalon/LocalBusiness), sitemap.xml, robots.txt

### Admin Dashboard (`/admin`)
- Login via Supabase Auth (email + password)
- **Dashboard** — booking & gallery counts + recent bookings
- **Gallery CRUD** — full create/edit/delete, image upload to Supabase Storage, publish/draft toggle, category/tags/price/duration
- **Bookings** — list with status management (new → confirmed → done → cancelled), WhatsApp link, delete
- **Services** — CRUD with icon selector
- **Pricing** — tiers + add-ons management
- **Testimonials** — CRUD with star rating
- **FAQ** — CRUD with sort order

### Technical
- TypeScript strict mode with `noUncheckedIndexedAccess`
- Fallback seed data — site renders without Supabase configured
- Server Components where possible, Client Components only when needed
- Framer Motion animations with `prefers-reduced-motion` support
- Mobile-first responsive design (target: women 16–40 on smartphones)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (20 recommended)
- A [Supabase](https://supabase.com) project (free tier works)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/vgl-nails.git
cd vgl-nails
npm install
```

> **Note:** If you encounter peer dependency warnings with React 19 + Framer Motion, run:
> ```bash
> npm install --legacy-peer-deps
> ```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find these in your Supabase dashboard → Settings → API.

### 3. Run Database Migration

1. Go to your Supabase dashboard → **SQL Editor**
2. Paste the contents of `supabase/migrations/0001_init.sql`
3. Click **Run**

This creates all tables, enables RLS policies, seeds sample data, and creates storage buckets (`gallery` + `references`).

### 4. Create Admin User

1. Go to Supabase dashboard → **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter email + password
4. This user can log in at `/admin/login`

### 5. Create Storage Buckets (if migration didn't auto-create)

If the storage buckets weren't created by the migration:

1. Go to **Storage** in your Supabase dashboard
2. Create bucket `gallery` — set to **Public**
3. Create bucket `references` — set to **Public**

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### 7. Deploy to Vercel

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`)
4. Deploy

---

## 💻 Development Without Installing Locally

If you're on a locked-down laptop without admin permissions (can't install Node/Git), you can use browser-based development:

### GitHub Codespaces (Recommended)
1. Push the code to a GitHub repo
2. On the repo page, click **Code → Codespaces → Create codespace**
3. A full VS Code editor opens in your browser with Node.js pre-installed
4. Run `npm install && npm run dev` in the terminal
5. Codespaces will auto-forward port 3000

### github.dev
- Press `.` on any GitHub repo page to open a web-based editor
- Good for quick file edits, but no terminal (can't run `npm`)

---

## 📁 Project Structure

```
vgl-nails/
├── public/                     # Static assets (add favicon.ico, og-image.jpg)
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/          # Admin login page
│   │   │   └── (panel)/        # Admin panel (sidebar layout)
│   │   │       ├── dashboard/
│   │   │       ├── gallery/    # Full CRUD + image upload
│   │   │       ├── bookings/   # Booking management
│   │   │       ├── services/   # Service CRUD
│   │   │       ├── pricing/    # Pricing tier + addon CRUD
│   │   │       ├── testimonials/
│   │   │       └── faq/
│   │   ├── globals.css
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   ├── page.tsx            # Homepage (server component)
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── admin/ui.tsx        # Shared admin UI components
│   │   ├── booking/            # Booking form modal
│   │   ├── sections/           # Homepage sections
│   │   ├── seo/                # JSON-LD structured data
│   │   └── ui/                 # Shared UI (Header, CTA, etc.)
│   ├── lib/
│   │   ├── data/fallback.ts    # Fallback data (works without Supabase)
│   │   ├── site-config.ts      # Site metadata & contact info
│   │   └── supabase/           # Supabase client/server/middleware
│   ├── services/content.ts     # Data fetching with Supabase-or-fallback
│   ├── store/booking.tsx       # Booking modal state (React Context)
│   ├── types/database.ts       # TypeScript types for all tables
│   └── utils/                  # Helpers (cn, formatIDR, formatDuration)
├── supabase/
│   └── migrations/0001_init.sql  # Full schema + RLS + seed data
├── tailwind.config.ts          # Brand design tokens
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## ⚙️ Customization Checklist

Before going live, update these:

| What | Where | Notes |
|------|-------|-------|
| Studio name, tagline, description | `src/lib/site-config.ts` | |
| WhatsApp number | `src/lib/site-config.ts` | Format: `6281234567890` (no +) |
| Address & GPS coordinates | `src/lib/site-config.ts` | Used for Maps embed + JSON-LD |
| Operating hours | `src/lib/site-config.ts` | Display + JSON-LD |
| Social media links | `src/lib/site-config.ts` | Instagram, TikTok |
| Hero background image | `src/components/sections/Hero.tsx` | Replace Unsplash URL with real photo |
| Gallery photos | Admin panel → Gallery | Upload real nail art photos |
| Favicon | `public/favicon.ico` | Add your logo |
| OG image | `public/og-image.jpg` | 1200×630px recommended |
| Pricing & services | Admin panel | Update via admin dashboard |
| Testimonials | Admin panel | Add real customer reviews |

---

## 🔒 Security Notes

- **RLS (Row Level Security)** is enabled on all tables
- Public users can only SELECT published gallery items, services, pricing, testimonials, and FAQ
- Public users can INSERT bookings but cannot read other people's bookings
- Only authenticated users (admin) have full CRUD access
- Admin routes are protected by Supabase middleware
- `/admin` pages are excluded from search engine indexing (`robots.txt` + `noindex` meta)

---

## 📝 Known Limitations & Honest Notes

1. **Build verified** — the project compiles successfully with `next build`, but you may encounter minor TypeScript warnings or Supabase-related runtime issues when connecting to your specific project. These are typically quick fixes.

2. **Image placeholders** — hero and fallback gallery images use Unsplash URLs. Replace with real photos of your nail art work.

3. **Google Maps** — uses a keyless iframe embed (works for basic display). For heavy traffic, consider adding a Google Maps API key.

4. **Booking form** — inserts to Supabase and shows a WhatsApp fallback on error. There's no email notification built in — consider adding a Supabase Edge Function or webhook for notifications.

5. **No image cropping in-browser** — the admin gallery upload accepts images as-is. Consider pre-cropping images to consistent aspect ratios for best visual results.

6. **Mobile-first** — designed primarily for smartphone users. Desktop layout works but is simpler.

---

## License

Private project for VGL Nails. Not open-source.
