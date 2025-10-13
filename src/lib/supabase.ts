import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for build time if environment variables are missing
const createMockClient = () => ({
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
    signInWithOAuth: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
    signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    refreshSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
      in: () => ({
        data: [],
        error: null,
      }),
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null }),
    }),
  }),
  realtime: {
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
  },
})

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : createMockClient()

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          status: 'online' | 'offline'
          last_seen_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          status?: 'online' | 'offline'
          last_seen_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          status?: 'online' | 'offline'
          last_seen_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: number
          sender_id: string
          recipient_id: string
          message_type: 'text' | 'image' | 'audio' | 'document'
          content: string | null
          file_url: string | null
          metadata: any | null
          replied_to_message_id: number | null
          created_at: string
          delivered_at: string | null
          read_at: string | null
        }
        Insert: {
          id?: number
          sender_id: string
          recipient_id: string
          message_type?: 'text' | 'image' | 'audio' | 'document'
          content?: string | null
          file_url?: string | null
          metadata?: any | null
          replied_to_message_id?: number | null
          created_at?: string
          delivered_at?: string | null
          read_at?: string | null
        }
        Update: {
          id?: number
          sender_id?: string
          recipient_id?: string
          message_type?: 'text' | 'image' | 'audio' | 'document'
          content?: string | null
          file_url?: string | null
          metadata?: any | null
          replied_to_message_id?: number | null
          created_at?: string
          delivered_at?: string | null
          read_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          description: string | null
          category: string | null
          payment_method: 'cash' | 'qris' | 'bank_transfer' | 'other'
          fund_source: 'from_cash_drawer' | 'personal_fund' | 'bank' | 'other'
          transaction_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          description?: string | null
          category?: string | null
          payment_method?: 'cash' | 'qris' | 'bank_transfer' | 'other'
          fund_source?: 'from_cash_drawer' | 'personal_fund' | 'bank' | 'other'
          transaction_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'income' | 'expense'
          amount?: number
          description?: string | null
          category?: string | null
          payment_method?: 'cash' | 'qris' | 'bank_transfer' | 'other'
          fund_source?: 'from_cash_drawer' | 'personal_fund' | 'bank' | 'other'
          transaction_date?: string
          created_at?: string
        }
      }
      fcm_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_status: 'online' | 'offline'
      message_type: 'text' | 'image' | 'audio' | 'document'
      transaction_type: 'income' | 'expense'
      payment_method: 'cash' | 'qris' | 'bank_transfer' | 'other'
      fund_source: 'from_cash_drawer' | 'personal_fund' | 'bank' | 'other'
    }
  }
}
