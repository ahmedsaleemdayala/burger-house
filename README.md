# 🍔 BurgerHouse — Restaurant Website with WhatsApp Ordering

A modern, premium, fully responsive burger restaurant website with a complete WhatsApp-based ordering system, a secure admin dashboard, live analytics, and a Supabase-powered backend.

**Highlights:** Dark premium UI · Multi-item cart · WhatsApp checkout · Order status tracking · Customer reviews · Admin CRUD with image uploads · Real-time analytics

---

## ✨ Features

### Customer-Facing Website
- **Home** — animated hero, featured burgers, "why choose us", popular items, customer reviews, gallery, FAQ, and call-to-action sections
- **Menu** — live search, dynamic category filters, price/rating sorting, loading skeletons, and badge system (Best Seller / New / Deal)
- **WhatsApp Ordering** — customers add one or more burgers to a cart, fill in a checkout popup (name, phone, delivery address, special instructions), and the complete order opens in WhatsApp as a formatted message with per-item pricing and a grand total
- **Customer Reviews** — visitors can submit star-rated reviews that are stored in the database and displayed on the home page
- **Contact** — contact form (name, phone, message), Google Map, and social links
- Floating WhatsApp button, sticky glass navbar, back-to-top button, smooth animations (Framer Motion), and full mobile responsiveness

### Admin Dashboard (`/admin`)
Protected by username/password authentication with 24-hour token sessions.

| Tab | Capabilities |
|---|---|
| **Analytics** | Total / daily / weekly / monthly orders, most & least ordered burgers, WhatsApp clicks, visitor count, conversion rate, monthly trend line chart, orders-by-burger pie chart, daily orders bar chart, device breakdown, top landing pages |
| **Orders** | Live order list with customer details, items, and totals. Four-stage status pipeline: **Received → Preparing → Out for delivery → Delivered** |
| **Burgers** | Full menu management — add, edit, and delete burgers; toggle availability; upload images directly to Supabase Storage or paste an image URL |
| **Messages** | All contact form submissions with a one-click **Reply on WhatsApp** action |

### Engineering
- 100% database-driven content — burgers, reviews, orders, and messages all come from Supabase (no hardcoded data)
- SEO: semantic HTML5, meta tags, Open Graph, Twitter Cards, canonical URL, `robots.txt`, `sitemap.xml`, Schema.org Restaurant markup, image alt attributes, and lazy loading
- Performance: route-level code splitting, manual vendor chunks, gzip compression, and optimized images
- Accessibility: keyboard navigation, ARIA labels, visible focus states, and `prefers-reduced-motion` support
- Automatic session handling — expired admin tokens trigger a clean re-login flow

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, Tailwind CSS v4, Framer Motion, React Router 7, Axios, Recharts, Lucide Icons, React Hot Toast |
| Backend | Node.js, Express 4, Helmet, Compression, Multer |
| Database & Storage | Supabase (PostgreSQL + Storage) |
| Auth | HMAC-signed session tokens (24h expiry) |

---

## 📁 Project Structure

```
burger-house/
├── frontend/                     # React + Vite application
│   ├── index.html                # SEO meta tags, Open Graph, Schema markup
│   ├── public/                   # robots.txt, sitemap.xml
│   └── src/
│       ├── components/           # Navbar, Footer, BurgerCard, OrderModal, CartBar, Reviews…
│       │   └── admin/            # AdminLogin, AnalyticsPanel, BurgersAdmin, OrdersAdmin, MessagesAdmin
│       ├── pages/                # Home, Menu, About, Contact, Dashboard
│       ├── lib/                  # config.js, api.js, cart.jsx, whatsapp.js, status.js, track.js
│       └── data/                 # Static content only (FAQs)
├── backend/                      # Express API
│   ├── server.js                 # App entry + Supabase connection check
│   ├── .env.example              # Environment template
│   └── src/
│       ├── auth.js               # Token creation / verification / middleware
│       ├── supabase.js           # Service-role client
│       └── routes/               # burgers, orders, analytics, contact, reviews, auth, upload
├── supabase/
│   ├── complete-setup.sql        # Full database setup (fresh install)
│   ├── add-reviews.sql           # Incremental: reviews table
│   ├── add-status.sql            # Incremental: order status column
│   └── add-contact-phone.sql     # Incremental: contact phone column
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) 18+ (LTS recommended)
- A free [Supabase](https://supabase.com) account

### 1. Set Up the Database
1. Create a new project on Supabase.
2. Open **SQL Editor → New query**.
3. Paste the contents of `supabase/complete-setup.sql` and click **Run**.
   This creates all tables (`burgers`, `orders`, `visits`, `whatsapp_clicks`, `contact_messages`, `reviews`), configures Row Level Security, creates the `burger-images` storage bucket, and seeds the menu. The script is idempotent — running it twice causes no errors or duplicates.

### 2. Configure the Backend
```bash
cd backend
cp .env.example .env        # Windows: copy .env.example .env
npm install
```

Edit `backend/.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_KEY=your-secret-service-role-key
PORT=5000

ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
AUTH_SECRET=any-long-random-string
```

> ⚠️ **Key type matters:** `SUPABASE_SERVICE_KEY` must be the **secret / service_role** key (starts with `sb_secret_` or `eyJ`), found under **Project Settings → API Keys**. The publishable key (`sb_publishable_…`) will not work — Row Level Security will block all writes. Never expose the secret key in frontend code or screenshots.

Start the API:

```bash
npm run dev
```

On startup the server verifies its database connection and prints either
`✅ Supabase connected — orders will be saved.` or a detailed error explaining what to fix.

### 3. Configure & Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

The site runs at `http://localhost:5173` (API requests are proxied to port 5000 automatically).

Set your business details in `frontend/src/lib/config.js`:

```js
export const WHATSAPP_NUMBER = "923XXXXXXXXX"; // country code + number, no "+"
export const RESTAURANT = { name, phone, email, address, socials, … };
```

### 4. Log In to the Admin Dashboard
Visit `http://localhost:5173/admin` and sign in with the credentials from `backend/.env`.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Admin login → returns session token |
| `GET` | `/api/burgers` | — | Full menu |
| `POST` | `/api/burgers` | Admin | Create a burger |
| `PATCH` | `/api/burgers/:id` | Admin | Update a burger |
| `DELETE` | `/api/burgers/:id` | Admin | Delete a burger |
| `POST` | `/api/upload` | Admin | Upload an image to Supabase Storage |
| `POST` | `/api/orders` | — | Save an order (called at WhatsApp checkout) |
| `GET` | `/api/orders` | Admin | List recent orders |
| `PATCH` | `/api/orders/:id/status` | Admin | Update order status |
| `GET` | `/api/reviews` | — | Latest customer reviews |
| `POST` | `/api/reviews` | — | Submit a review |
| `POST` | `/api/contact` | — | Save a contact message |
| `GET` | `/api/contact` | Admin | List contact messages |
| `POST` | `/api/analytics/visit` | — | Record a page visit |
| `POST` | `/api/analytics/whatsapp-click` | — | Record a floating-button click |
| `GET` | `/api/analytics/summary` | — | Aggregated dashboard data |
| `GET` | `/api/health` | — | Health check |

---

## 📦 How Ordering Works

1. The customer adds burgers to the cart and taps **Order on WhatsApp**.
2. A checkout popup collects their name, phone, address, and any special instructions.
3. On submit, the order is **saved to Supabase first** (items, quantities, totals, device, browser, page URL, IP).
4. WhatsApp then opens with a fully formatted message — every item with quantity × rate = amount, the grand total, and the customer's details — ready to send to the restaurant's number.
5. Staff manage the order from the admin **Orders** tab through the status pipeline until it is marked **Delivered**.

---

## ☁️ Deployment

| Part | Recommended Host | Notes |
|---|---|---|
| Frontend | Vercel / Netlify | Build command `npm run build`, output directory `dist`. Set `VITE_API_URL` to your deployed API base URL (e.g. `https://your-api.up.railway.app/api`). |
| Backend | Railway / Render | Root directory `backend/`, start command `npm start`. Set all variables from `.env`. |
| Database | Supabase | Already cloud-hosted — no changes required. |

After deploying, update the production domain in `frontend/index.html` (canonical/OG URLs) and `frontend/public/sitemap.xml`.

---

## 🔐 Security Notes

- The Supabase **service_role key lives only on the backend** and is never shipped to the browser.
- Row Level Security is enabled on every table; the public (anon) key can only read the menu and reviews.
- All admin endpoints require a signed bearer token; tokens expire after 24 hours.
- Change `ADMIN_PASSWORD` and `AUTH_SECRET` before going live, and rotate any key that has ever been shared or screenshotted.

---

## 📄 License

This project was built as a client deliverable. All burger imagery is sourced from [Unsplash](https://unsplash.com) under the Unsplash License.
