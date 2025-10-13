# 💰 Aplikasi Keuangan - Next.js

Aplikasi keuangan pribadi dengan dashboard lengkap, laporan, dan manajemen transaksi.

## 🚀 LANGSUNG DEPLOY (GRATIS)

### Cara 1: Vercel (Paling Mudah)
1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready to deploy"
   git push origin main
   ```

2. **Deploy ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub
   - Klik "New Project" → Pilih repo ini → "Deploy"

3. **Setup Environment Variables di Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXTAUTH_SECRET=rahasia-anda
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

### Cara 2: Railway
```bash
npm install -g @railway/cli
railway login
railway up
```

## 📊 Fitur

- ✅ Dashboard dengan grafik real-time
- ✅ Manajemen transaksi (pemasukan/pengeluaran)
- ✅ Laporan keuangan detail
- ✅ Sistem pesan/kontak
- ✅ Profile management
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Real-time updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Setup Lokal

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local dengan credentials Supabase
   ```

3. **Setup database**
   - Buat project di [Supabase](https://supabase.com)
   - Jalankan SQL dari `SUPABASE_SETUP.md`
   - Copy URL dan API key ke `.env.local`

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka [http://localhost:3000](http://localhost:3000)**

## 🗄️ Database Schema

Aplikasi menggunakan 3 tabel utama:
- `profiles` - Data user
- `transactions` - Transaksi keuangan
- `messages` - Pesan kontak

Lihat `SUPABASE_SETUP.md` untuk SQL lengkap.

## 📱 API Endpoints

- `GET /api/health` - Health check
- `GET /api/health/supabase` - Database connection test
- `GET/POST /api/transactions` - CRUD transaksi
- `GET/POST /api/profiles` - CRUD profiles
- `GET/POST /api/messages` - CRUD messages

## 🔧 Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

## 📄 License

MIT License - feel free to use this project!

---

**🚀 Sekarang aplikasi Anda siap untuk deployment!**