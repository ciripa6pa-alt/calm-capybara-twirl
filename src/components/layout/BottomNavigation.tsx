'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTransactionModal } from '@/components/transaction/TransactionModalProvider'
import { 
  Home, 
  History, 
  MessageSquare, 
  BarChart3, 
  Plus,
  Wallet
} from 'lucide-react'

const navigation = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Riwayat', href: '/riwayat', icon: History },
  { name: 'Tambah', href: '#', icon: Plus, isAction: true },
  { name: 'Pesan', href: '/pesan', icon: MessageSquare },
  { name: 'Laporan', href: '/laporan', icon: BarChart3 },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { openModal } = useTransactionModal()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href && !item.isAction
          const Icon = item.icon
          
          if (item.isAction) {
            return (
              <button
                key={item.name}
                className="relative -mt-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
                onClick={() => openModal()}
              >
                <Icon className="h-6 w-6" />
                <span className="sr-only">{item.name}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}