'use client'

import { useState, useEffect } from 'react'

interface NotificationState {
  unreadCount: number
  hasPWAUpdate: boolean
  messages: Array<{
    id: string
    content: string
    sender: string
    timestamp: Date
    read: boolean
  }>
}

export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    unreadCount: 0,
    hasPWAUpdate: false,
    messages: []
  })

  // Simulasi pesan masuk - disabled in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    
    const interval = setInterval(() => {
      const shouldReceiveMessage = Math.random() > 0.8 // 20% chance
      
      if (shouldReceiveMessage) {
        const newMessage = {
          id: Date.now().toString(),
          content: 'Halo, ada pesan baru untuk Anda!',
          sender: 'System',
          timestamp: new Date(),
          read: false
        }
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage],
          unreadCount: prev.unreadCount + 1
        }))
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Check for PWA updates
  useEffect(() => {
    const handleSWUpdate = () => {
      setState(prev => ({ ...prev, hasPWAUpdate: true }))
    }

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleSWUpdate)
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleSWUpdate)
      }
    }
  }, [])

  const markAllAsRead = () => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => ({ ...msg, read: true })),
      unreadCount: 0
    }))
  }

  const markAsRead = (messageId: string) => {
    setState(prev => {
      const updatedMessages = prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
      const unreadCount = updatedMessages.filter(msg => !msg.read).length
      
      return {
        ...prev,
        messages: updatedMessages,
        unreadCount
      }
    })
  }

  const clearPWAUpdate = () => {
    setState(prev => ({ ...prev, hasPWAUpdate: false }))
  }

  const addMessage = (message: Omit<NotificationState['messages'][0], 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      unreadCount: message.read ? prev.unreadCount : prev.unreadCount + 1
    }))
  }

  return {
    ...state,
    markAllAsRead,
    markAsRead,
    clearPWAUpdate,
    addMessage
  }
}