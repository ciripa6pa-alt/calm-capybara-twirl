import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all messages for the user
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error deleting all messages:', error)
      return NextResponse.json({ error: 'Failed to delete messages' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete all messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}