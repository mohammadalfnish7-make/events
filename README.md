# Event Planning Website

A multilingual event planning website built with Next.js 15, featuring an admin dashboard, PostgreSQL database, and Docker containerization.

## Features

- 🌐 **Multi-language Support** - Arabic (RTL) and English
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Gradient effects, animations, dark mode ready
- 🔐 **Admin Dashboard** - Manage services and media
- 📁 **Self-hosted Media** - Upload images and videos locally
- 🐳 **Docker Ready** - Development and production configs

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### Development

```bash
# Start with Docker
docker compose up -d

# Database setup (first time only)
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

Visit: http://localhost:3000

**Admin Login:**
- Email: `admin@events.sa`
- Password: `admin123`

### Production

```bash
# Create .env file
cp .env.example .env
# Edit .env with your production values

# Build and start
docker compose -f docker-compose.prod.yml up -d --build
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── [locale]/          # Locale-based routing (Next.js 15 async params)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── services/      # Services page
│   │   │   ├── portfolio/     # Gallery page
│   │   │   ├── contact/       # Contact page
│   │   │   └── dashboard/     # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/            # UI components
│   ├── lib/                   # Utilities
│   └── i18n/                  # Internationalization
├── messages/                  # Translation files
├── prisma/                    # Database schema
└── public/uploads/            # Uploaded media
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **Database:** PostgreSQL + Prisma
- **Styling:** Tailwind CSS
- **i18n:** next-intl
- **Container:** Docker

