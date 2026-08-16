# Desi Journey 🌴

> **Bespoke Travel, Beautifully Planned.**  
> A luxury, AI-inspired full-stack travel platform built with React, Vite, Tailwind CSS, and Node.js Express.

---

## ✨ Features

- **Curated Trips & Itineraries**: Domestic & International travel packages with detailed day-wise accordion itineraries, inclusions (`✓`), exclusions (`✕`), and cancellation policies.
- **Accreditations & Certificates**: High-resolution Lightbox gallery for official travel agency affiliations (TAAB, ETAA, Chhattisgarh Tourism Board, Ramakrishna Mission).
- **Admin Dashboard**: Comprehensive admin management portal (`/admin`) protected by JWT authentication to create, edit, and manage tours, blog posts, certificates, and announcement popups.
- **Keyword Search**: Instant search across tours, locations, and travel journals.
- **Responsive Luxury Design**: Fluid layouts, animations (Framer Motion), and modern styling with Tailwind CSS.
- **Dual Deployment Ready**: Configured for Vercel Serverless Functions (`/api/*`) and Firebase Hosting.

---

## 🏗️ Project Architecture

```text
DesiJourney_Website/
├── api/                  # Vercel serverless function entrypoint
│   └── index.js
├── backend/              # Node.js Express REST API
│   ├── controllers/      # Route controllers (tours, posts, achievements, etc.)
│   ├── data/             # JSON data storage (tours, posts, achievements, popups)
│   ├── middleware/       # JWT Auth & error handling middlewares
│   ├── routes/           # Express API route declarations
│   ├── server.js         # Express app configuration
│   └── .env.example      # Backend environment variables template
├── client/               # Vite + React Frontend SPA
│   ├── public/           # Static assets (certificates, icons)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React contexts (AuthContext)
│   │   ├── data/         # Offline seed fallbacks & content
│   │   ├── hooks/        # Custom hooks (useTours, usePosts, useAchievements)
│   │   ├── pages/        # Public and Admin pages
│   │   ├── services/     # Axios API service layer
│   │   └── styles/       # Tailwind CSS & global styles
│   └── .env.example      # Client environment variables template
├── firebase/             # Firebase configuration & security rules
├── firebase.json         # Firebase Hosting configuration
├── vercel.json           # Vercel deployment configuration
└── package.json          # Monorepo scripts & dependencies
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Copy the example environment files:
```bash
# Windows
copy backend\.env.example backend\.env
copy client\.env.example client\.env

# macOS / Linux
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

### 3. Run in Development Mode
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Admin Panel**: [http://localhost:5173/admin](http://localhost:5173/admin) *(Default Admin Password: `1234`)*

---

## 📦 Production Builds & Deployment

### Build Frontend
```bash
npm run build
```

### Deploy to Vercel (Frontend + Serverless Backend)
```bash
npx vercel --prod
```

### Deploy to Firebase Hosting
```bash
npx firebase deploy --only hosting
```

---

## 🔒 Security Note
Never commit `.env` files or secret keys to source control. Use the provided `.env.example` templates for configuration.
