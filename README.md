# 🚀 Kasir Saku Plus - Aplikasi Keuangan PWA

Aplikasi kasir dan manajemen keuangan modern yang dibangun dengan Next.js 15, dilengkapi dengan fitur chat real-time, notifikasi, dan Progressive Web App (PWA) capabilities.

## ✨ Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework dengan App Router
- **📘 TypeScript 5** - Type-safe JavaScript
- **🎨 Tailwind CSS 4** - Utility-first CSS framework
- **📱 PWA** - Progressive Web App dengan service worker

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - Komponen UI berkualitas tinggi
- **🎯 Lucide React** - Library ikon yang konsisten
- **🌈 Framer Motion** - Animasi yang smooth
- **🎨 Next Themes** - Dark mode support

### 🔄 Real-time & State Management
- **🐻 Zustand** - State management yang simple
- **🔄 TanStack Query** - Data synchronization
- **🔌 Socket.IO** - Real-time communication
- **🌐 Axios** - HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Modern ORM dengan SQLite
- **🔐 NextAuth.js** - Authentication solution
- **🔥 Firebase** - Cloud services (opsional)

### 📊 Advanced Features
- **📊 Recharts** - Library untuk chart dan visualisasi
- **🖼️ Sharp** - Image processing
- **📱 PWA** - Offline support dan installable app

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd kasir-saku-plus

# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Build & Deploy

```bash
# Build untuk production
npm run build

# Start production server
npm start

# Export static files (opsional)
npm run export
```

## 🔧 Konfigurasi Database

### 1. Supabase Setup (Opsional)

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Buat file .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Langkah-langkah Supabase:**
1. Buat project baru di [supabase.com](https://supabase.com)
2. Copy URL dan Anonymous Key dari Settings > API
3. Run SQL berikut di Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  category TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'image', 'audio', 'document')),
  content TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view messages involving them" ON messages FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
```

### 2. Firebase Setup (Opsional)

```bash
# Install Firebase
npm install firebase

# Buat file .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Langkah-langkah Firebase:**
1. Buat project baru di [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password, Google, etc.)
3. Enable Firestore Database
4. Enable Cloud Storage (untuk file uploads)
5. Copy konfigurasi ke file `.env.local`

### 3. Local Database (Default)

Aplikasi sudah dikonfigurasi dengan database SQLite lokal:

```bash
# Push schema ke database
npm run db:push

# View database di Prisma Studio
npm run db:studio
```

## 📱 PWA Installation

### Android
1. Buka aplikasi di Chrome
2. Tap "Add to Home Screen" dari menu browser
3. Tap "Add" untuk install

### iOS
1. Buka aplikasi di Safari
2. Tap Share button
3. Scroll dan tap "Add to Home Screen"
4. Tap "Add" untuk install

### Desktop
1. Buka aplikasi di Chrome/Edge
2. Click install icon di address bar
3. Click "Install"

## 🎨 Fitur Utama

### 💰 Manajemen Keuangan
- Dashboard dengan ringkasan transaksi
- Input pemasukan dan pengeluaran
- Kategori transaksi
- Laporan keuangan dengan chart
- Export data

### 💬 Chat Real-time
- Chat dengan kontak
- Notifikasi pesan baru
- Badge notifikasi
- Mark all as read
- File sharing

### 👤 Profil Pengguna
- Edit nama dan avatar
- Status online/offline
- Dropdown menu profile
- PWA update notifications

### 📱 Mobile-First Design
- Responsive design
- Touch-friendly interface
- Swipe gestures
- Bottom navigation
- Sticky headers

## 🔧 Environment Variables

Buat file `.env.local`:

```env
# Supabase (opsional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase (opsional)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Database
DATABASE_URL="file:./dev.db"
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── pesan/             # Chat page
│   ├── laporan/           # Reports page
│   └── riwayat/           # History page
├── components/            # Reusable React components
│   ├── chat/             # Chat components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── profile/          # Profile components
│   ├── transaction/      # Transaction components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── prisma/               # Database schema
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build static version
npm run build

# Deploy folder .next
```

### Docker
```bash
# Build image
docker build -t kasir-saku-plus .

# Run container
docker run -p 3000:3000 kasir-saku-plus
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

Jika mengalami masalah:
1. Check [Issues](../../issues) page
2. Create new issue dengan detail error
3. Join Discord community (coming soon)

---

Built with ❤️ untuk UMKM Indonesia. Powered by Next.js 15 🚀
