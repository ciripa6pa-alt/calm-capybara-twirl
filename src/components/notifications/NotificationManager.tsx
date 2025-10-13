'use client'

import { useState, useEffect } from 'react'
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase'
import { toast } from '@/hooks/use-toast'
// integrated with Supabase: use auth context to attach user id
import { useAuth } from '@/contexts/AuthContext'

export function NotificationManager() {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  // integrated with Supabase: read session user
  const { user } = useAuth()
  const isProd = process.env.NODE_ENV === 'production'

  useEffect(() => {
    // Check if Firebase messaging is supported
    const checkSupport = () => {
      const supported = 
        isProd &&
        typeof window !== 'undefined' &&
        'Notification' in window && 
        'serviceWorker' in navigator && 
        'PushManager' in window
      
      setIsSupported(supported)
      
      if (supported) {
        initializeNotifications()
      }
    }

    checkSupport()
  }, [isProd])

  const initializeNotifications = async () => {
    try {
      if (!isProd) return
      // Check if Firebase is properly configured
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        console.warn('Firebase configuration is missing. Notifications will be disabled.')
        return
      }

      // Request notification permission
      const token = await requestNotificationPermission()
      
      if (token) {
        setFcmToken(token)
        console.log('FCM Token:', token)
        
        // integrated with Supabase: Save token to backend using Supabase API
        await saveTokenToBackend(token)
        
        toast({
          title: "Notifikasi Aktif",
          description: "Aplikasi akan mengirimkan notifikasi penting kepada Anda.",
        })
      }
    } catch (error) {
      console.error('Error initializing notifications:', error)
      // Don't show error toast to avoid disrupting user experience
    }
  }

  const saveTokenToBackend = async (token: string) => {
    try {
      // integrated with Supabase: call API route to upsert FCM token
      const res = await fetch('/api/fcm-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, user_id: user?.id || null })
      })

      if (!res.ok) {
        console.warn('Failed to save FCM token to backend')
      } else {
        // integrated with Supabase: log success into notification_logs
        await fetch('/api/notification-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user?.id || null, status: 'token_saved', details: { token } })
        })
      }
    } catch (error) {
      console.error('Error saving token:', error)
    }
  }

  // Listen for foreground messages
  useEffect(() => {
    if (!isSupported || !isProd) return

    const unsubscribe = onMessageListener()
      .then((payload: any) => {
        console.log('Received foreground message:', payload)
        
        toast({
          title: payload.notification?.title || 'Pesan Baru',
          description: payload.notification?.body || 'Anda memiliki pesan baru.',
        })
      })
      .catch((error) => {
        console.error('Error setting up message listener:', error)
      })

    return () => {
      unsubscribe.then((unsub: any) => unsub && unsub())
    }
  }, [isSupported, isProd])

  // Handle notification clicks
  useEffect(() => {
    if (!isSupported || !isProd) return

    const handleNotificationClick = (event: any) => {
      console.log('Notification clicked:', event)
      // Handle navigation based on notification data
      if (event.data?.url) {
        window.location.href = event.data.url
      }
    }

    // Listen for notification clicks
    navigator.serviceWorker?.addEventListener('notificationclick', handleNotificationClick)

    return () => {
      navigator.serviceWorker?.removeEventListener('notificationclick', handleNotificationClick)
    }
  }, [isSupported, isProd])

  return null // This component doesn't render anything
}
