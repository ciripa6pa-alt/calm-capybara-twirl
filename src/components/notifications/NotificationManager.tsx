'use client'

import { useState, useEffect } from 'react'
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase'
import { toast } from '@/hooks/use-toast'

export function NotificationManager() {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Firebase messaging is supported
    const checkSupport = () => {
      const supported = 
        'Notification' in window && 
        'serviceWorker' in navigator && 
        'PushManager' in window
      
      setIsSupported(supported)
      
      if (supported) {
        initializeNotifications()
      }
    }

    checkSupport()
  }, [])

  const initializeNotifications = async () => {
    try {
      // Request notification permission
      const token = await requestNotificationPermission()
      
      if (token) {
        setFcmToken(token)
        console.log('FCM Token:', token)
        
        // Save token to backend (in real app)
        await saveTokenToBackend(token)
        
        toast({
          title: "Notifikasi Aktif",
          description: "Aplikasi akan mengirimkan notifikasi penting kepada Anda.",
        })
      }
    } catch (error) {
      console.error('Error initializing notifications:', error)
    }
  }

  const saveTokenToBackend = async (token: string) => {
    try {
      // Simulasi saving token to backend
      console.log('Saving FCM token to backend:', token)
      
      // In real implementation:
      // await fetch('/api/fcm-tokens', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token })
      // })
    } catch (error) {
      console.error('Error saving token:', error)
    }
  }

  // Listen for foreground messages
  useEffect(() => {
    if (!isSupported) return

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
  }, [isSupported])

  // Handle notification clicks
  useEffect(() => {
    if (!isSupported) return

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
  }, [isSupported])

  return null // This component doesn't render anything
}