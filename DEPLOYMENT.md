# 🚀 Deployment Guide - Vercel

Aplikasi Kasir Saku Plus sudah dioptimasi untuk deployment ke Vercel tanpa error. Berikut adalah panduan lengkap untuk deployment.

## ✅ Pre-Deployment Checklist

### 1. Build Status ✅
- [x] Production build berhasil (`npm run build`)
- [x] Tidak ada build errors
- [x] Tidak ada TypeScript errors
- [x] Tidak ada ESLint errors
- [x] API routes berfungsi dengan baik

### 2. Environment Variables ✅
- [x] API routes aman tanpa environment variables
- [x] Graceful fallback untuk Supabase/Firebase tidak terkonfigurasi
- [x] Production-ready configuration

### 3. Dependencies ✅
- [x] `postinstall` script untuk Prisma generation
- [x] Tidak ada dependencies yang bermasalah
- [x] Compatible dengan Vercel serverless environment

## 📋 Langkah Deployment ke Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy dari root directory
vercel

# Follow prompts:
# - Set up and deploy "~/project"? [Y/n] y
# - Which scope do you want to deploy to? [pilih scope]
# - Link to existing project? [y/N] n
# - What's your project's name? kasir-saku-plus
# - In which directory is your code located? ./
# - Want to override the settings? [y/N] n
```

### Option 2: GitHub Integration

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import repository GitHub
   - Vercel akan auto-detect Next.js
   - Click "Deploy"

### Option 3: Drag & Drop

1. Run `npm run build`
2. Zip folder `.next`
3. Drag & drop ke [vercel.com](https://vercel.com)

## 🔧 Environment Variables di Vercel

Setelah project terdeploy, tambahkan environment variables:

1. Buka project dashboard di Vercel
2. Go to **Settings** → **Environment Variables**
3. Tambahkan variables berikut (opsional):

```env
# Supabase (jika menggunakan)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase (jika menggunakan)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth (jika menggunakan)
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🏗️ Build Configuration

Aplikasi sudah dikonfigurasi dengan:

### `package.json`
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### `next.config.ts`
- Production optimizations
- Security headers
- Image optimization
- Serverless-compatible

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install && npm run db:generate",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

## 📊 Build Results

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    11.4 kB         158 kB
├ ○ /_not-found                            986 B         103 kB
├ ƒ /api/health                            149 B         102 kB
├ ƒ /api/health/supabase                   149 B         102 kB
├ ƒ /api/messages                          149 B         102 kB
├ ƒ /api/profiles                          149 B         102 kB
├ ƒ /api/transactions                      149 B         102 kB
├ ○ /laporan                              112 kB         249 kB
├ ○ /pesan                               7.26 kB         119 kB
└ ○ /riwayat                                5 kB         141 kB
+ First Load JS shared by all             102 kB
```

## 🔍 Troubleshooting

### Build Errors
Jika terjadi build errors:

1. **Check logs** di Vercel dashboard
2. **Local test**: `npm run build`
3. **Clear cache**: `vercel --force`

### Runtime Errors
Jika terjadi runtime errors:

1. **Check API routes** - semua routes memiliki error handling
2. **Environment variables** - pastikan sudah di-set dengan benar
3. **Database connection** - Supabase/Firebase sudah dikonfigurasi dengan fallback

### Performance Issues
1. **Check Vercel Analytics**
2. **Optimize images** - sudah dikonfigurasi
3. **Enable caching** - sudah ada security headers

## 🌐 Domain Configuration

### Custom Domain
1. Buka Vercel project → **Settings** → **Domains**
2. Add custom domain
3. Update DNS records
4. Wait for SSL certificate

### Environment-Specific URLs
- **Production**: `https://your-domain.vercel.app`
- **Preview**: `https://your-branch-name.your-domain.vercel.app`

## 📱 PWA Features

Aplikasi sudah mendukung PWA:
- ✅ Service Worker registration
- ✅ Manifest.json
- ✅ Installable on mobile
- ✅ Offline support (basic)

## 🔄 CI/CD Pipeline

Dengan GitHub integration:

1. **Auto-deploy** setiap push ke main branch
2. **Preview deployments** untuk pull requests
3. **Rollback** ke deployment sebelumnya
4. **Branch aliases** untuk staging

## 📈 Monitoring

### Vercel Analytics
- Page views
- Web Vitals
- Error tracking
- Performance metrics

### Health Checks
```bash
# API Health
curl https://your-domain.vercel.app/api/health

# Supabase Health
curl https://your-domain.vercel.app/api/health/supabase
```

## 🚀 Production Best Practices

### 1. Security
- ✅ Security headers sudah dikonfigurasi
- ✅ Environment variables tidak exposed
- ✅ API routes memiliki validation

### 2. Performance
- ✅ Image optimization
- ✅ Code splitting
- ✅ Static generation
- ✅ Edge runtime compatibility

### 3. Reliability
- ✅ Error handling di semua API routes
- ✅ Graceful fallback untuk external services
- ✅ 404 page yang user-friendly

## 🎉 Deployment Success!

Setelah deployment berhasil:

1. ✅ **Visit** `https://your-domain.vercel.app`
2. ✅ **Test** semua features
3. ✅ **Install** sebagai PWA di mobile
4. ✅ **Monitor** performance di Vercel dashboard

Aplikasi sudah siap production-ready dan dapat diakses globally! 🌟