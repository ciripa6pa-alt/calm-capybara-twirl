import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// integrated with Supabase: Todos API
export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured', data: [] },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { searchParams } = new URL(request.url)

    const userId = searchParams.get('userId')
    const isCompleteParam = searchParams.get('isComplete')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) query = query.eq('user_id', userId)
    if (isCompleteParam !== null) query = query.eq('is_complete', isCompleteParam === 'true')

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
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
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const body = await request.json()

    const { user_id, task } = body

    if (!user_id || !task) {
      return NextResponse.json({ error: 'Missing required fields: user_id, task' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({ user_id, task })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
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

    const { id, task, is_complete } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('todos')
      .update({
        task: task ?? undefined,
        is_complete: typeof is_complete === 'boolean' ? is_complete : undefined,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
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
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}