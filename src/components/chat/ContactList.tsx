'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Circle, X, CheckCircle } from 'lucide-react'

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

interface ContactListProps {
  contacts: Contact[]
  selectedContact: string | null
  onSelectContact: (contactId: string) => void
  totalUnreadCount?: number
  onMarkAllRead?: () => void
}

export function ContactList({ contacts, selectedContact, onSelectContact, totalUnreadCount = 0, onMarkAllRead }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter(contact =>
    `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays < 7) return `${diffDays} hari lalu`
    return date.toLocaleDateString('id-ID')
  }

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pesan</h2>
            {totalUnreadCount > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {totalUnreadCount > 0 && onMarkAllRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllRead}
                className="h-8 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Tandai Dibaca
              </Button>
            )}
            <button className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari kontak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm">Tidak ada kontak ditemukan</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                selectedContact === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar_url || ''} />
                  <AvatarFallback className="text-sm font-medium">
                    {contact.first_name?.[0] || 'U'}
                    {contact.last_name?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm truncate">
                    {contact.first_name} {contact.last_name}
                  </p>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatLastSeen(contact.last_seen_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate pr-2">
                    {contact.last_message || 'Belum ada pesan'}
                  </p>
                  {contact.unread_count && contact.unread_count > 0 && (
                    <Badge variant="destructive" className="text-xs px-2 py-0 h-5 flex-shrink-0">
                      {contact.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}