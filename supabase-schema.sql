-- Create custom types for user status and message types
CREATE TYPE public.user_status AS ENUM ('online', 'offline');
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'audio', 'document');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.payment_method AS ENUM ('cash', 'qris', 'bank_transfer', 'other');
CREATE TYPE public.fund_source AS ENUM ('from_cash_drawer', 'personal_fund', 'bank', 'other');

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  first_name text,
  last_name text,
  avatar_url text,
  status user_status DEFAULT 'offline',
  last_seen_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_type message_type NOT NULL DEFAULT 'text',
  content text,
  file_url text,
  metadata jsonb,
  replied_to_message_id bigint REFERENCES public.messages(id),
  created_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  read_at timestamptz
);

-- Create transactions table for financial data
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  description text,
  category text,
  payment_method payment_method DEFAULT 'cash',
  fund_source fund_source DEFAULT 'other',
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create FCM tokens table for push notifications
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON public.profiles(last_seen_at);

-- Create Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update message status" ON public.messages FOR UPDATE USING (recipient_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own transactions" ON public.transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (user_id = auth.uid());

-- FCM tokens policies
CREATE POLICY "Users can manage own FCM tokens" ON public.fcm_tokens FOR ALL USING (user_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for testing
INSERT INTO public.profiles (id, first_name, last_name, status) VALUES
  ('user-1', 'Demo', 'User', 'online'),
  ('user-2', 'Ahmad', 'Rizki', 'online'),
  ('user-3', 'Siti', 'Nurhaliza', 'offline'),
  ('user-4', 'Budi', 'Santoso', 'online'),
  ('user-5', 'Dewi', 'Kartika', 'offline')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO public.transactions (user_id, type, amount, description, category, payment_method, fund_source, transaction_date) VALUES
  ('user-1', 'income', 1500000, 'Penjualan Produk A', 'Penjualan', 'cash', 'from_cash_drawer', CURRENT_DATE),
  ('user-1', 'expense', 500000, 'Beli bahan baku', 'Operasional', 'bank_transfer', 'from_cash_drawer', CURRENT_DATE),
  ('user-1', 'income', 2000000, 'Pembayaran Jasa', 'Jasa', 'qris', 'from_cash_drawer', CURRENT_DATE - INTERVAL '1 day'),
  ('user-1', 'expense', 750000, 'Gaji karyawan', 'Gaji', 'bank_transfer', 'personal_fund', CURRENT_DATE - INTERVAL '1 day'),
  ('user-1', 'income', 1000000, 'Penjualan Produk B', 'Penjualan', 'cash', 'from_cash_drawer', CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Insert sample messages
INSERT INTO public.messages (sender_id, recipient_id, message_type, content) VALUES
  ('user-2', 'user-1', 'text', 'Halo, bagaimana kabarnya?'),
  ('user-1', 'user-2', 'text', 'Kabar baik, terima kasih. Kamu gimana?'),
  ('user-2', 'user-1', 'text', 'Alhamdulillah baik. Ada yang bisa dibantu?'),
  ('user-1', 'user-2', 'text', 'Iya, mau tanya tentang produk yang kemarin'),
  ('user-2', 'user-1', 'text', 'Baik, terima kasih infonya')
ON CONFLICT DO NOTHING;