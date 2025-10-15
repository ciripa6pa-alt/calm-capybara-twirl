# Overview

This is a Next.js 15-based personal finance management application called "Kasir Saku Plus" (Cash Pocket Plus). The application provides comprehensive financial tracking capabilities including income/expense management, transaction history, reporting with charts, messaging system, and PWA (Progressive Web App) functionality. It's built with TypeScript and modern React patterns, now optimized for Replit deployment.

The application includes both a simple demo version (client-side only) and a full-featured version that integrates with Supabase for data persistence and authentication. The codebase is production-ready with proper error handling, responsive design, and dark mode support.

# Recent Changes

**October 15, 2025 - Replit Migration:**
- Migrated from Vercel to Replit platform
- Configured dev and production servers to bind to 0.0.0.0:5000 for Replit compatibility
- Removed X-Frame-Options header to allow Replit iframe display
- Added cache control headers to prevent caching issues
- Fixed missing useTransactions hook in use-supabase.ts with full CRUD and realtime support
- Configured autoscale deployment for production
- Environment variables now managed through Replit Secrets (see .env.example for required keys)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & UI:**
- Next.js 15 with App Router for routing and server-side rendering
- TypeScript for type safety
- React 18 with client and server components
- Tailwind CSS v4 (experimental) for styling with CSS variables
- shadcn/ui component library built on Radix UI primitives
- Responsive mobile-first design with bottom navigation

**State Management:**
- React Context API for authentication (`AuthContext`)
- Custom hooks for data fetching and state (`useMessages`, `useTransactions`, `useNotifications`)
- React Hook Form with Zod for form validation

**Component Structure:**
- Modular component architecture with clear separation:
  - `/components/ui` - Base UI components (shadcn)
  - `/components/auth` - Authentication components
  - `/components/chat` - Messaging functionality
  - `/components/dashboard` - Dashboard widgets
  - `/components/transaction` - Transaction management
  - `/components/layout` - Layout components (navigation, headers)
  - `/components/pwa` - PWA installation and service worker management

**Routing:**
- `/` - Landing page
- `/simple` - Demo app (no database required)
- `/laporan` - Financial reports with charts
- `/riwayat` - Transaction history
- `/pesan` - Messaging system
- `/todos` - Todo list (authenticated)
- `/login` - Authentication page

## Backend Architecture

**API Routes:**
- Next.js API routes in `/src/app/api`
- RESTful endpoints for CRUD operations
- Serverless functions optimized for Vercel deployment (max 30s duration)

**Database & ORM:**
- Primary: Supabase (PostgreSQL) for production
- ORM: Prisma Client for database operations
- Local development: SQLite (`dev.db`) as fallback
- Schema includes tables for: profiles, transactions, messages, contacts, todos

**Authentication:**
- Supabase Auth with email/password
- Session management with persistent storage
- Protected routes with authentication guards
- Graceful degradation when Supabase is not configured (build-time safety)

**Real-time Features:**
- Socket.IO integration for WebSocket communication
- Custom server setup (`server.ts`) combining Next.js with Socket.IO
- Message delivery and read receipts

## Data Storage Solutions

**Primary Database (Supabase):**
- PostgreSQL with real-time subscriptions
- Auth helpers for Next.js integration
- Row-level security policies
- Database schema defined in `/supabase/schema.sql`

**Client-side Storage:**
- LocalStorage for PWA state and preferences
- Service Worker caching for offline functionality
- IndexedDB potential for offline data (via service worker)

**Database Schema:**
- `profiles` - User profile information
- `transactions` - Financial transactions (income/expense)
- `messages` - Chat messages
- `contacts` - User contacts with status
- `todos` - Task management
- Timestamps and soft deletes implemented

## Authentication & Authorization

**Supabase Authentication:**
- Email/password authentication
- OAuth providers support (configured in Supabase)
- Session persistence with auto-refresh
- JWT tokens for API authentication

**Authorization Patterns:**
- `ProtectedRoute` component wrapper for authenticated pages
- User ID-based data filtering in queries
- Environment-aware authentication (build-time checks)
- Fallback UI for unauthenticated users

**Security Measures:**
- NextAuth secret for session encryption
- Security headers (X-Content-Type-Options, Referrer-Policy)
- CORS configuration for Socket.IO
- Input validation with Zod schemas

# External Dependencies

**Core Services:**
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Real-time)
  - URL: `NEXT_PUBLIC_SUPABASE_URL`
  - Anon Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Optional, gracefully degrades if not configured

- **Firebase Cloud Messaging** (Optional) - Push notifications
  - Configuration in `/public/firebase-messaging-sw.js`
  - VAPID key for web push notifications

**Third-party Libraries:**

*UI & Components:*
- `@radix-ui/*` - Accessible UI primitives
- `recharts` - Chart visualization library
- `lucide-react` - Icon library
- `react-day-picker` - Date picker component
- `@dnd-kit/*` - Drag and drop functionality
- `vaul` - Drawer component

*Data & Forms:*
- `@prisma/client` - Database ORM
- `@supabase/auth-helpers-nextjs` - Supabase integration
- `react-hook-form` - Form management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation resolvers

*Real-time & Communication:*
- `socket.io` - WebSocket server
- `socket.io-client` - WebSocket client

*PWA & Utilities:*
- `@mdxeditor/editor` - Rich text editor
- `cmdk` - Command palette
- `embla-carousel-react` - Carousel component
- `class-variance-authority` - Component variants
- `tailwind-merge` - Tailwind class merging

**Deployment Configuration:**
- Optimized for Vercel with `vercel.json`
- Environment variables configured in Vercel dashboard
- Prisma generation in postinstall hook
- Serverless function timeout: 30 seconds
- Region: Singapore (sin1)

**Build & Development Tools:**
- Next.js with Turbopack (dev mode)
- TypeScript strict mode
- ESLint with Next.js config
- Tailwind CSS v4 with PostCSS

**Service Workers & PWA:**
- `/public/sw.js` - Custom service worker for caching
- `/public/firebase-messaging-sw.js` - FCM background messages
- `/public/manifest.json` - PWA manifest with icons
- Install prompt handling with beforeinstallprompt API