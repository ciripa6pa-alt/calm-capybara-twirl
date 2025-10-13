# Supabase Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (https://supabase.com)

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Project Name**: `kasir-saku-plus`
   - **Database Password**: Create a strong password
   - **Region**: Choose nearest region to your users
5. Click "Create new project"
6. Wait for project to be ready (2-3 minutes)

### 2. Get Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://xxxxxxxx.supabase.co`)
   - **anon public** API key

### 3. Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Database Configuration
DATABASE_URL="file:./dev.db"

# Other Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Setup Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the schema

### 5. Enable Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, enter: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`
4. Enable **Email** authentication provider
5. Save changes

### 6. Test Connection

Start your development server:

```bash
npm run dev
```

Test the Supabase connection by visiting:
```
http://localhost:3000/api/health/supabase
```

You should see:
```json
{
  "status": "success",
  "message": "Supabase connection successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Database Schema

The application uses the following tables:

### `profiles`
User profile information linked to Supabase auth users.

### `transactions`
Financial transactions (income/expense) for each user.

### `messages`
Chat messages and notifications for each user.

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic profile creation on user signup
- Secure API endpoints with authentication checks

## 🚀 Deployment

For production deployment:

1. Update environment variables with production values
2. Configure proper CORS settings in Supabase
3. Enable Row Level Security policies
4. Set up proper authentication providers

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check your `.env.local` file
   - Ensure you're using the correct project URL and anon key

2. **"Database relation does not exist"**
   - Run the schema setup SQL in Supabase SQL Editor
   - Check table names match exactly

3. **"Permission denied"**
   - Ensure RLS policies are properly configured
   - Check user is authenticated

4. **"Connection timeout"**
   - Check Supabase project status
   - Verify network connectivity

### Debug Mode

Add this to your code to debug Supabase issues:

```typescript
// Enable debug mode
const supabase = createClient(url, key, {
  db: {
    schema: 'public'
  },
  auth: {
    debug: true
  }
})
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/nextjs)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify environment variables are correctly set
3. Test connection via `/api/health/supabase`
4. Check Supabase dashboard for any service alerts

---

**Note**: This application requires Supabase for full functionality. Without proper Supabase setup, the app will show authentication errors and won't be able to save data.