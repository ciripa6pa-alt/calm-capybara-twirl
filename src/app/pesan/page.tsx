'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useMessages } from '@/hooks/use-supabase'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { DeleteConfirmDialog } from '@/components/chat/DeleteConfirmDialog'
import { Trash2, MessageSquare, Loader2 } from 'lucide-react'

export default function PesanPage() {
  const { user } = useAuth()
  const { messages, loading, addMessage, deleteAllMessages } = useMessages()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Redirect to login if not authenticated
  if (!user && !loading) {
    window.location.href = '/'
    return null
  }

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'audio' | 'document') => {
    if (!user) return

    try {
      await addMessage({
        user_id: user.id,
        content,
        sender: 'You',
        timestamp: new Date().toISOString(),
        read: false,
      })
    } catch (error: any) {
      console.error('Error sending message:', error)
      // Show user-friendly error
      if (error.message?.includes('Supabase not configured')) {
        alert('Database belum dikonfigurasi. Silakan tambahkan kredensial Supabase di Replit Secrets.')
      } else {
        alert('Gagal mengirim pesan: ' + (error.message || 'Terjadi kesalahan'))
      }
    }
  }

  const handleClearMessages = async () => {
    if (!user) return

    try {
      await deleteAllMessages()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Error clearing messages:', error)
    }
  }

  // Transform messages for ChatWindow component
  const transformedMessages = messages.map((msg, index) => ({
    id: index + 1, // Convert string UUID to number for compatibility
    sender_id: msg.sender === 'You' ? 'current-user' : 'system',
    recipient_id: 'current-user',
    message_type: 'text' as const,
    content: msg.content,
    file_url: null,
    created_at: msg.timestamp,
    delivered_at: msg.timestamp,
    read_at: msg.read ? msg.timestamp : null,
  }))

  // Mock contact for system messages
  const systemContact = {
    id: 'system',
    first_name: 'System',
    last_name: 'Notifications',
    avatar_url: null,
    status: 'online' as const,
    last_seen_at: new Date().toISOString(),
    last_message: messages[0]?.content,
    unread_count: messages.filter(m => !m.read).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat pesan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-50 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <div>
            <h1 className="font-semibold">Pesan</h1>
            <p className="text-xs text-gray-500">Notifikasi dan sistem</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 pt-16">
        <ChatWindow
          contact={systemContact}
          currentUserId="current-user"
          messages={transformedMessages}
          onSendMessage={handleSendMessage}
          onClearMessages={() => setShowDeleteDialog(true)}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleClearMessages}
        messageCount={messages.length}
        contactName="semua pesan"
      />
    </div>
  )
}