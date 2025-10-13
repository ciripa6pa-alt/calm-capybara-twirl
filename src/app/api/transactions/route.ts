import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured', data: [] },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { searchParams } = new URL(request.url)
    
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const period = searchParams.get('period')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    
    // Filter by period
    if (period) {
      const now = new Date()
      let startDate: Date
      
      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }
      
      query = query.gte('transaction_date', startDate.toISOString().split('T')[0])
    }
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const body = await request.json()
    
    const {
      user_id,
      type,
      amount,
      description,
      category,
      payment_method,
      fund_source,
      transaction_date
    } = body
    
    // Validation
    if (!user_id || !type || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, type, amount' },
        { status: 400 }
      )
    }
    
    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { error: 'Type must be either income or expense' },
        { status: 400 }
      )
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id,
        type,
        amount,
        description: description || null,
        category: category || null,
        payment_method: payment_method || 'cash',
        fund_source: fund_source || 'other',
        transaction_date: transaction_date || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const body = await request.json()
    const { id, type, amount, description, category, payment_method, fund_source, transaction_date } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 })
    }

    if (type && type !== 'income' && type !== 'expense') {
      return NextResponse.json({ error: 'Type must be either income or expense' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        type: type ?? undefined,
        amount: amount ?? undefined,
        description: description ?? undefined,
        category: category ?? undefined,
        payment_method: payment_method ?? undefined,
        fund_source: fund_source ?? undefined,
        transaction_date: transaction_date ?? undefined,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing required query: id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}