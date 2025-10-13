'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          router.push('/')
          return
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [router])

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          toast({
            title: "Login Berhasil",
            description: "Selamat datang kembali!",
          })
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, toast])

  const handleLoginSuccess = () => {
    toast({
      title: "Login Berhasil",
      description: "Selamat datang di Kasir Saku Plus!",
    })
  }

  const handleLoginError = (error: string) => {
    toast({
      title: "Login Gagal",
      description: error,
      variant: "destructive",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Kasir Saku Plus
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Aplikasi keuangan personal dengan sistem chat terintegrasi
          </p>
        </div>

        {/* Login Form */}
        <LoginForm
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Belum punya akun? Daftar gratis sekarang
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600">Syarat & Ketentuan</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </div>
  )
}
