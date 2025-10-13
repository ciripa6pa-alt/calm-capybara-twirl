import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test connection by checking if we can access the service
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Supabase connection failed',
          error: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to Supabase',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}