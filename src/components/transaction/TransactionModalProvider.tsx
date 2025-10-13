'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { TransactionModal } from './TransactionModal'

interface TransactionModalContextType {
  isOpen: boolean
  openModal: (type?: 'income' | 'expense') => void
  closeModal: () => void
  initialType: 'income' | 'expense' | null
}

const TransactionModalContext = createContext<TransactionModalContextType | undefined>(undefined)

export function TransactionModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialType, setInitialType] = useState<'income' | 'expense' | null>(null)

  const openModal = (type?: 'income' | 'expense') => {
    if (type) {
      setInitialType(type)
    }
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setInitialType(null)
  }

  return (
    <TransactionModalContext.Provider value={{ isOpen, openModal, closeModal, initialType }}>
      {children}
      <TransactionModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        initialType={initialType || undefined}
      />
    </TransactionModalContext.Provider>
  )
}

export function useTransactionModal() {
  const context = useContext(TransactionModalContext)
  if (context === undefined) {
    throw new Error('useTransactionModal must be used within a TransactionModalProvider')
  }
  return context
}