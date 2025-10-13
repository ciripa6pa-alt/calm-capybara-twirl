'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, X, Smartphone, Home } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkIfInstalled()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show banner after a delay
      setTimeout(() => {
        setShowInstallBanner(true)
      }, 3000)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false)
    }
    
    setDeferredPrompt(null)
  }

  const handleDismissBanner = () => {
    setShowInstallBanner(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-banner-dismissed', 'true')
  }

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed')
    if (dismissed) {
      setShowInstallBanner(false)
    }
  }, [])

  if (isInstalled) {
    return null
  }

  return (
    <>
      {/* Install Banner */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Install Kasir Saku Plus</h3>
                  <p className="text-sm text-blue-100 mb-3">
                    Install aplikasi untuk pengalaman lebih baik dan akses offline
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleInstallClick}
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Install
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDismissBanner}
                      className="text-white hover:bg-white/20"
                    >
                      Nanti
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDismissBanner}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Install Button (for manual install) */}
      {!isInstalled && deferredPrompt && !showInstallBanner && (
        <div className="fixed bottom-20 right-4 z-40">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-4 py-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        </div>
      )}
    </>
  )
}