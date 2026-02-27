# GoTravel — Full-Stack Travel SaaS

A complete, production-ready travel booking SaaS built with Next.js 14, Express.js, MongoDB Atlas, Razorpay, and Google Gemini AI.

---

## 🗂️ Project Structure

```
e:/Vibe/Travel/
├── apps/
│   ├── api/           # Express.js backend (port 5000)
│   ├── web/           # Next.js frontend (port 3000)
│   └── admin/         # Next.js admin panel (port 3001)
├── packages/
│   └── shared/        # Shared TypeScript types
├── package.json        # Turborepo root
└── turbo.json
```

---

## ⚡ Quick Start

### 1. Install dependencies (root)
```bash
cd "E:/Vibe/Travel"
npm install
```

### 2. Set up API environment
```bash
cd apps/api
copy .env.example .env
```
Then fill in your values in `apps/api/.env`:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any random 32-char string |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Same as above |
| `GEMINI_API_KEY` | Google AI Studio → Get API Key |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password (16-char) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard |
| `ADMIN_EMAIL` | Your email (receives lead alerts) |

### 3. Set up Web environment
```bash
cd apps/web
copy .env.example .env.local
```
Fill in `apps/web/.env.local`:
- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID=` (your Razorpay Key ID)
- `NEXTAUTH_SECRET=` (random 32-char string)
- `GOOGLE_CLIENT_ID=` (optional, Google OAuth)
- `GOOGLE_CLIENT_SECRET=` (optional)

### 4. Set up Admin environment
```bash
cd apps/admin
copy .env.example .env.local
```
Fill in `apps/admin/.env.local`:
- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### 5. Install backend dependencies
```bash
cd apps/api
npm install
```

### 6. Install frontend dependencies
```bash
cd apps/web
npm install
```

### 7. Install admin dependencies
```bash
cd apps/admin
npm install
```

### 8. Seed the database (IMPORTANT — run first!)
```bash
cd apps/api
npm run seed
```
This creates 6 destinations (Kashmir, Manali, Goa, Kerala, Rajasthan, Ladakh), packages, FIT add-ons, and an admin user.

**Admin credentials:**
- Email: `admin@gotravel.in`
- Password: `GoTravel@Admin2024`

### 9. Start all apps (in separate terminals)
```bash
# Terminal 1: Backend
cd apps/api && npm run dev

# Terminal 2: Frontend  
cd apps/web && npm run dev

# Terminal 3: Admin
cd apps/admin && npm run dev
```

| App | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Admin | http://localhost:3001 |
| API | http://localhost:5000 |

---

## 🚀 Deployment

### Backend → Railway
1. Create new project at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set root directory: `apps/api`
4. Add all environment variables from `.env`
5. Deploy command: `npm start`

### Frontend → Vercel
1. Import repo at [vercel.com](https://vercel.com)
2. Set root directory: `apps/web`
3. Add environment variables (use production API URL)
4. Deploy

### Admin → Vercel (separate project)
1. Import same repo at Vercel
2. Set root directory: `apps/admin`
3. Add `NEXT_PUBLIC_API_URL` pointing to production API

---

## 🌟 Key Features

### User-Facing
- **FIT Builder**: Build custom itineraries with à-la-carte add-ons. Live pricing + day recalculation + AI suggestions via Gemini
- **AI Itinerary**: Gemini-powered personalized trip generation
- **4-Step Booking**: Traveler details → Contact → Razorpay payment
- **Destination Listing**: Filter by state, difficulty, travel type with pagination
- **User Dashboard**: View bookings, cancel, track status
- **Auth**: JWT + Google OAuth via NextAuth

### Admin Panel
- **Dashboard**: Revenue charts, booking stats, lead summary
- **Leads CRM**: Status tracking (new → contacted → converted), instant email alerts
- **Bookings**: Full CRUD with status updates
- **Users**: View, block/unblock, spending history
- **Vendors**: Hotel/transport/guide management

### Technical
- **ISR**: Destination pages revalidate every hour
- **SEO**: JSON-LD schema, meta tags, sitemap
- **Analytics**: Google Analytics 4
- **Security**: Helmet, rate limiting, CORS, JWT, bcrypt
- **Email**: HTML templates via Nodemailer (Gmail SMTP)

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion, Zustand |
| Backend | Express.js, Mongoose, MongoDB Atlas |
| Payments | Razorpay |
| AI | Google Gemini API |
| Auth | NextAuth.js + JWT |
| Images | Cloudinary |
| Email | Nodemailer (Gmail) |
| Deploy | Vercel (frontend), Railway (backend) |

---

## 🔑 Gmail SMTP Setup

1. Go to Google Account → Security → App Passwords
2. Select "Mail" and generate a 16-character password
3. Use that as `SMTP_PASS` (not your Gmail login password)

---

## 📞 Support

For any setup issues, contact: `hello@gotravel.in`
