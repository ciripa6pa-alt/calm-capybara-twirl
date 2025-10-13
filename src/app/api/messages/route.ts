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
    const contactId = searchParams.get('contactId')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    if (!userId || !contactId) {
      return NextResponse.json(
        { error: 'User ID and Contact ID are required' },
        { status: 400 }
      )
    }
    
    // integrated with Supabase: adjusted to schema user_id/recipient_id
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`(user_id.eq.${userId},recipient_id.eq.${contactId}),(user_id.eq.${contactId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    // integrated with Supabase: map DB rows to UI message shape
    const mapped = (data || []).reverse().map((m: any) => ({
      id: m.id,
      sender_id: m.user_id,
      recipient_id: m.recipient_id,
      message_type: m.image_url ? 'image' : 'text',
      content: m.content,
      file_url: m.image_url || null,
      created_at: m.created_at,
      delivered_at: null,
      read_at: m.read_at || null,
    }))
    return NextResponse.json({ data: mapped })
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
      sender_id,
      recipient_id,
      message_type,
      content,
      file_url,
      replied_to_message_id
    } = body
    
    // Validation
    if (!sender_id || !recipient_id) {
      return NextResponse.json(
        { error: 'Missing required fields: sender_id, recipient_id' },
        { status: 400 }
      )
    }
    
    if (!content && !file_url) {
      return NextResponse.json(
        { error: 'Either content or file_url is required' },
        { status: 400 }
      )
    }
    
    // integrated with Supabase: adhere to schema columns
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: sender_id,
        recipient_id,
        content: content || null,
        image_url: file_url || null,
        replied_to_message_id: replied_to_message_id || null,
        metadata: message_type ? { message_type } : null,
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    // integrated with Supabase: map DB row to UI message shape
    const mapped = {
      id: data.id,
      sender_id: data.user_id,
      recipient_id: data.recipient_id,
      message_type: data.image_url ? 'image' : 'text',
      content: data.content,
      file_url: data.image_url || null,
      created_at: data.created_at,
      delivered_at: null,
      read_at: data.read_at || null,
    }
    return NextResponse.json({ data: mapped }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}