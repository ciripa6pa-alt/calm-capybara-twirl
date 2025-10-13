# 🚀 Deployment Guide - Kasir Saku Plus

## 📋 Prerequisites

- Node.js 18+ 
- Supabase project (see `SUPABASE_SETUP.md`)
- Git repository
- Vercel account (recommended) or other hosting platform

## 🔧 Environment Variables

### Required Environment Variables

Create `.env.production` with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# Optional
DATABASE_URL=postgresql://user:password@host:port/database
```

### Generate NEXTAUTH_SECRET

```bash
# Generate secure secret
openssl rand -base64 32
# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🌐 Vercel Deployment (Recommended)

### 1. Connect to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

### 2. Configure Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### 3. Deploy

```bash
# Production deployment
vercel --prod

# Or push to GitHub connected repository
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Build and Run

```bash
# Build image
docker build -t kasir-saku-plus .

# Run container
docker run -p 3000:3000 --env-file .env.production kasir-saku-plus
```

## 🟢 Netlify Deployment

### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.next
```

## 🔧 Railway Deployment

### 1. Configure Railway

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will auto-detect Next.js and deploy

### 2. Railway Configuration

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🛠️ Traditional Server Deployment

### 1. Server Setup

```bash
# Clone repository
git clone your-repo-url
cd kasir-saku-plus

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Start production server
npm start
```

### 2. PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start npm --name "kasir-saku-plus" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Pre-Deployment Checklist

### ✅ Code Quality

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build test
npm run build
```

### ✅ Environment Setup

- [ ] Supabase project created and configured
- [ ] Database schema applied
- [ ] Environment variables set
- [ ] Authentication providers configured
- [ ] CORS settings configured

### ✅ Security

- [ ] HTTPS enabled
- [ ] Environment variables are secret
- [ ] Database access is restricted
- [ ] API routes are protected
- [ ] Rate limiting configured (if needed)

### ✅ Performance

- [ ] Images optimized
- [ ] Caching configured
- [ ] Bundle size analyzed
- [ ] Core Web Vitals checked

## 🚨 Common Deployment Issues

### 1. Build Errors

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### 2. Database Connection Issues

- Check Supabase project URL and keys
- Verify RLS policies are enabled
- Test connection via health endpoint

### 3. Environment Variables

- Ensure all required variables are set
- Check variable names match exactly
- Verify no trailing spaces

### 4. Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 📊 Monitoring

### Health Check Endpoints

- `/api/health` - General health
- `/api/health/supabase` - Supabase connection

### Performance Monitoring

- Vercel Analytics (if using Vercel)
- Google Analytics
- Sentry for error tracking

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

If you encounter deployment issues:

1. Check deployment logs
2. Verify environment variables
3. Test Supabase connection
4. Check build output
5. Review this guide

---

**Note**: Always test deployment in a staging environment before going to production!