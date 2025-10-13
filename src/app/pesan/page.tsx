'use client'

import { useState, useEffect } from 'react'
import { ContactList } from '@/components/chat/ContactList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { DeleteConfirmDialog } from '@/components/chat/DeleteConfirmDialog'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useNotifications } from '@/hooks/use-notifications'
import { useAuth } from '@/contexts/AuthContext'
import { Trash2 } from 'lucide-react'

interface Contact {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  status: 'online' | 'offline'
  last_seen_at: string
  last_message?: string
  unread_count?: number
}

interface Message {
  id: number
  sender_id: string
  recipient_id: string
  message_type: 'text' | 'image' | 'audio' | 'document'
  content: string | null
  file_url: string | null
  created_at: string
  delivered_at: string | null
  read_at: string | null
}

export default function PesanPage() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContactList, setShowContactList] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { addMessage, markAllAsRead } = useNotifications()

  useEffect(() => {
    const fetchContactsAndMessages = async () => {
      if (!user) return

      try {
        // Fetch contacts (profiles) from Supabase
        const profilesResponse = await fetch('/api/profiles')
        const profilesResult = await profilesResponse.json()

        if (profilesResponse.ok && profilesResult.data) {
          const contactsData: Contact[] = profilesResult.data.map((profile: any) => ({
            id: profile.id,
            first_name: profile.first_name || 'Unknown',
            last_name: profile.last_name || '',
            avatar_url: profile.avatar_url,
            status: profile.status || 'offline',
            last_seen_at: profile.last_seen_at || new Date().toISOString(),
            last_message: '',
            unread_count: 0
          }))
          setContacts(contactsData)
        } else {
          // Fallback to mock contacts if API fails
          const mockContacts: Contact[] = [
            {
              id: 'demo-user-1',
              first_name: 'Ahmad',
              last_name: 'Demo',
              avatar_url: null,
              status: 'online',
              last_seen_at: new Date().toISOString(),
              last_message: 'Halo! Ini adalah pesan demo',
              unread_count: 1
            },
            {
              id: 'demo-user-2',
              first_name: 'Siti',
              last_name: 'Demo',
              avatar_url: null,
              status: 'offline',
              last_seen_at: new Date(Date.now() - 3600000).toISOString(),
              last_message: 'Pesan demo untuk testing',
              unread_count: 0
            }
          ]
          setContacts(mockContacts)
        }

        // If there's a selected contact, fetch messages
        if (selectedContact) {
          const messagesResponse = await fetch(`/api/messages?userId=${user.id}&contactId=${selectedContact}`)
          const messagesResult = await messagesResponse.json()

          if (messagesResponse.ok && messagesResult.data) {
            setMessages(messagesResult.data)
          } else {
            // Fallback to mock messages
            const mockMessages: Message[] = [
              {
                id: 1,
                sender_id: selectedContact,
                recipient_id: user.id,
                message_type: 'text',
                content: 'Halo! Ini adalah pesan demo dari Supabase',
                file_url: null,
                created_at: new Date(Date.now() - 3600000).toISOString(),
                delivered_at: new Date(Date.now() - 3500000).toISOString(),
                read_at: null,
              }
            ]
            setMessages(mockMessages)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to mock data
        const mockContacts: Contact[] = [
          {
            id: 'demo-user-1',
            first_name: 'Ahmad',
            last_name: 'Demo',
            avatar_url: null,
            status: 'online',
            last_seen_at: new Date().toISOString(),
            last_message: 'Halo! Ini adalah pesan demo',
            unread_count: 1
          }
        ]
        setContacts(mockContacts)
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    fetchContactsAndMessages()
  }, [user, selectedContact])

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'audio' | 'document') => {
    if (!selectedContact || !user) return

    try {
      // Send message to API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: user.id,
          recipient_id: selectedContact,
          message_type: type,
          content,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        const newMessage: Message = result.data

        setMessages([...messages, newMessage])

        // Update last message in contacts
        setContacts(contacts.map(contact => 
          contact.id === selectedContact 
            ? { ...contact, last_message: content, unread_count: 0 }
            : contact
        ))

        // Add notification
        addMessage({
          content: `Pesan terkirim ke ${contacts.find(c => c.id === selectedContact)?.first_name}`,
          sender: 'You',
          read: true
        })
      } else {
        // Fallback to local state if API fails
        const newMessage: Message = {
          id: messages.length + 1,
          sender_id: user.id,
          recipient_id: selectedContact,
          message_type: type,
          content,
          file_url: null,
          created_at: new Date().toISOString(),
          delivered_at: new Date().toISOString(),
          read_at: null,
        }

        setMessages([...messages, newMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Fallback to local state
      const newMessage: Message = {
        id: messages.length + 1,
        sender_id: user.id,
        recipient_id: selectedContact,
        message_type: type,
        content,
        file_url: null,
        created_at: new Date().toISOString(),
        delivered_at: new Date().toISOString(),
        read_at: null,
      }

      setMessages([...messages, newMessage])
    }
  }

  const handleSelectContact = (contactId: string) => {
    setSelectedContact(contactId)
    
    // Mark messages as read for this contact
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, unread_count: 0 }
        : contact
    ))
    
    // Close contact list on mobile after selection
    if (window.innerWidth < 768) {
      setShowContactList(false)
    }
  }

  const handleMarkAllRead = () => {
    setContacts(contacts.map(contact => ({ ...contact, unread_count: 0 })))
    markAllAsRead()
  }

  const handleClearMessages = () => {
    setMessages([])
    // Update contact last message
    setContacts(contacts.map(contact => 
      contact.id === selectedContact 
        ? { ...contact, last_message: undefined, unread_count: 0 }
        : contact
    ))
  }

  const getSelectedContact = () => {
    return contacts.find(contact => contact.id === selectedContact) || null
  }

  const getFilteredMessages = () => {
    if (!selectedContact || !user) return []
    return messages.filter(
      message => 
        (message.sender_id === user.id && message.recipient_id === selectedContact) ||
        (message.sender_id === selectedContact && message.recipient_id === user.id)
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  const getTotalUnreadCount = () => {
    return contacts.reduce((total, contact) => total + (contact.unread_count || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-50 relative">
        {/* Mobile Contact List Overlay */}
        {showContactList && (
          <div className="fixed inset-0 z-50 md:relative md:z-auto">
            {/* Mobile Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 md:hidden"
              onClick={() => setShowContactList(false)}
            />
            
            {/* Contact List */}
            <div className="relative w-full md:w-80 h-full bg-white md:border-r md:border-gray-200">
              <ContactList
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={handleSelectContact}
                totalUnreadCount={getTotalUnreadCount()}
                onMarkAllRead={handleMarkAllRead}
              />
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header with Back Button */}
          <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setShowContactList(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {getTotalUnreadCount() > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {getTotalUnreadCount() > 9 ? '9+' : getTotalUnreadCount()}
                </div>
              )}
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {getSelectedContact()?.first_name?.[0] || '?'}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">
                  {getSelectedContact()?.first_name} {getSelectedContact()?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {getSelectedContact()?.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            {getSelectedContact() && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <ChatWindow
            contact={getSelectedContact()}
            currentUserId={user?.id || ''}
            messages={getFilteredMessages()}
            onSendMessage={handleSendMessage}
            onClearMessages={handleClearMessages}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleClearMessages}
          messageCount={getFilteredMessages().length}
          contactName={`${getSelectedContact()?.first_name} ${getSelectedContact()?.last_name}`}
        />
      </div>
    </ProtectedRoute>
  )
}
