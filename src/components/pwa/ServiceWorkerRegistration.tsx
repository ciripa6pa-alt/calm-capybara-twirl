'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // In development, unregister any service workers to prevent caching issues with Next.js dev server
      if (process.env.NODE_ENV !== 'production') {
        try {
          navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
              registrations.forEach((registration) => {
                registration.unregister().catch(() => {})
              })
            })
            .catch(() => {})
        } catch (e) {
          // ignore
        }
        return
      }

      // In production, register service workers
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)

            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available; refresh the page
                    if (confirm('Versi baru aplikasi tersedia. Muat ulang halaman?')) {
                      window.location.reload()
                    }
                  }
                })
              }
            })
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
            // Don't show error to user, just log it
          })

        // Also register Firebase messaging service worker if available
        try {
          navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
              console.log('Firebase SW registered: ', registration)
            })
            .catch((error) => {
              console.log('Firebase SW registration failed: ', error)
              // Don't fail the app if Firebase SW fails
            })
        } catch (error) {
          console.log('Firebase SW not available: ', error)
        }
      })
    }
  }, [])

  return null
}
