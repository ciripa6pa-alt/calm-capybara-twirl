'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, Paperclip, Mic, Image, File, Reply, Trash2, X } from 'lucide-react'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { useTapHold } from '@/hooks/use-tap-hold'

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

interface Contact {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  status: 'online' | 'offline'
}

interface ChatWindowProps {
  contact: Contact | null
  currentUserId: string
  messages: Message[]
  onSendMessage: (content: string, type: 'text' | 'image' | 'audio' | 'document') => void
  onClearMessages?: () => void
}

export function ChatWindow({ contact, currentUserId, messages, onSendMessage, onClearMessages }: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const replyPrefix = replyingTo ? `> ${replyingTo.content}\n\n` : ''
      onSendMessage(replyPrefix + messageInput.trim(), 'text')
      setMessageInput('')
      setReplyingTo(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (type: 'image' | 'document') => {
    if (type === 'image') {
      imageInputRef.current?.click()
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = e.target.files?.[0]
    if (file) {
      onSendMessage(`File: ${file.name}`, type)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMessageStatus = (message: Message) => {
    if (message.read_at) return 'read'
    if (message.delivered_at) return 'delivered'
    return 'sent'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return '✓✓'
      case 'delivered':
        return '✓✓'
      default:
        return '✓'
    }
  }

  const handleClearMessages = () => {
    onClearMessages?.()
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-screen">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Send className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Selamat Datang di Kasir Saku Plus Chat
          </h3>
          <p className="text-gray-600 text-base">
            Pilih kontak untuk memulai percakapan
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col pb-16 md:pb-0">
      {/* Header */}
      <div className="hidden md:flex items-center gap-3 p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="relative">
          <Avatar>
            <AvatarImage src={contact.avatar_url || ''} />
            <AvatarFallback>
              {contact.first_name?.[0] || 'U'}
              {contact.last_name?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-base">
            {contact.first_name} {contact.last_name}
          </p>
          <p className="text-sm text-gray-500">
            {contact.status === 'online' ? 'Online' : 'Offline'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area - Flex with proper scrolling */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-base">Belum ada pesan</p>
              <p className="text-sm mt-2">Kirim pesan untuk memulai percakapan</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === currentUserId
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  currentUserId={currentUserId}
                  onReply={setReplyingTo}
                />
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
        {/* Reply Indicator */}
        {replyingTo && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Reply className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-blue-600 font-medium">Membalas pesan</p>
                <p className="text-sm text-gray-700 truncate">
                  {replyingTo.content}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelReply}
              className="h-6 w-6 text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => handleFileChange(e, 'document')}
            className="hidden"
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'image')}
            className="hidden"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleFileSelect('document')}
            className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleFileSelect('image')}
            className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
          >
            <Image className="h-5 w-5" aria-label="Upload image" />
          </Button>

          <div className="flex-1 min-w-0">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              className="text-base py-3 px-4 h-auto min-h-[44px]"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onTouchStart={() => setIsRecording(true)}
            onTouchEnd={() => setIsRecording(false)}
            className={`h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 ${
              isRecording ? 'text-red-500' : ''
            }`}
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            size="icon"
            className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleClearMessages}
        messageCount={messages.length}
        contactName={`${contact.first_name} ${contact.last_name}`}
      />
    </div>
  )
}

// Message Bubble Component with Tap & Hold functionality
function MessageBubble({ 
  message, 
  isOwn, 
  currentUserId, 
  onReply 
}: { 
  message: Message
  isOwn: boolean
  currentUserId: string
  onReply: (message: Message) => void
}) {
  const { isHolding, handleStart, handleMove, handleEnd } = useTapHold({
    onHold: () => {
      if (isOwn) {
        onReply(message)
      }
    },
    holdDuration: 500
  })

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMessageStatus = (message: Message) => {
    if (message.read_at) return 'read'
    if (message.delivered_at) return 'delivered'
    return 'sent'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return '✓✓'
      case 'delivered':
        return '✓✓'
      default:
        return '✓'
    }
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-md lg:max-w-lg xl:max-w-xl ${
        isOwn ? 'order-2' : 'order-1'
      }`}>
        <div 
          className={`px-4 py-3 rounded-2xl relative select-none transition-all duration-200 ${
            isOwn 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-white border border-gray-200 rounded-bl-md'
          } ${isHolding && isOwn ? 'scale-95 opacity-80' : ''} ${
            isOwn ? 'cursor-pointer' : ''
          }`}
          onMouseDown={(e) => {
            if (isOwn) {
              handleStart(e.clientX, e.clientY)
            }
          }}
          onMouseMove={(e) => {
            if (isOwn) {
              handleMove(e.clientX, e.clientY)
            }
          }}
          onMouseUp={() => {
            if (isOwn) {
              handleEnd()
            }
          }}
          onMouseLeave={() => {
            if (isOwn) {
              handleEnd()
            }
          }}
          onTouchStart={(e) => {
            if (isOwn) {
              const touch = e.touches[0]
              handleStart(touch.clientX, touch.clientY)
            }
          }}
          onTouchMove={(e) => {
            if (isOwn) {
              const touch = e.touches[0]
              handleMove(touch.clientX, touch.clientY)
            }
          }}
          onTouchEnd={() => {
            if (isOwn) {
              handleEnd()
            }
          }}
        >
          {message.message_type === 'text' && (
            <p className="text-sm sm:text-base leading-relaxed break-words">
              {message.content}
            </p>
          )}
          {message.message_type === 'image' && (
            <div className="space-y-2">
              <img 
                src={message.file_url || ''} 
                alt="Shared image" 
                className="rounded-lg max-w-full h-auto"
              />
              {message.content && (
                <p className="text-sm sm:text-base">{message.content}</p>
              )}
            </div>
          )}
          {message.message_type === 'document' && (
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <p className="text-sm sm:text-base truncate">{message.content}</p>
            </div>
          )}
          {message.message_type === 'audio' && (
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <p className="text-sm sm:text-base">Pesan Suara</p>
            </div>
          )}
          
          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>
              {formatTime(message.created_at)}
            </span>
            {isOwn && (
              <span>
                {getStatusIcon(getMessageStatus(message))}
              </span>
            )}
          </div>

          {/* Hold indicator */}
          {isHolding && isOwn && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              Balas pesan
            </div>
          )}
        </div>
      </div>
    </div>
  )
}