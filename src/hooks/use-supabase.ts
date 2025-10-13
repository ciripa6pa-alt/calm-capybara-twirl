'use client'

import { useState, useEffect } from 'react'
import { supabase, Transaction, Message } from '@/lib/supabase'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!supabase) {
        setError('Supabase not configured')
        return
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setTransactions(data || [])
    } catch (error: any) {
      console.error('Error fetching transactions:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured')
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single()

      if (error) {
        throw error
      }

      setTransactions(prev => [data, ...prev])
      return data
    } catch (error: any) {
      console.error('Error adding transaction:', error)
      throw error
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured')
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (error: any) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
  }
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!supabase) {
        setError('Supabase not configured')
        return
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) {
        throw error
      }

      setMessages(data || [])
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async (message: Omit<Message, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured')
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single()

      if (error) {
        throw error
      }

      setMessages(prev => [data, ...prev])
      return data
    } catch (error: any) {
      console.error('Error adding message:', error)
      throw error
    }
  }

  const markAsRead = async (id: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured')
      }

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', id)

      if (error) {
        throw error
      }

      setMessages(prev => 
        prev.map(msg => msg.id === id ? { ...msg, read: true } : msg)
      )
    } catch (error: any) {
      console.error('Error marking message as read:', error)
      throw error
    }
  }

  const deleteAllMessages = async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured')
      }

      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', 'placeholder') // Delete all records

      if (error) {
        throw error
      }

      setMessages([])
    } catch (error: any) {
      console.error('Error deleting all messages:', error)
      throw error
    }
  }

  const unreadCount = messages.filter(msg => !msg.read).length

  useEffect(() => {
    fetchMessages()
  }, [])

  return {
    messages,
    loading,
    error,
    unreadCount,
    fetchMessages,
    addMessage,
    markAsRead,
    deleteAllMessages,
  }
}

export function useStats() {
  const [stats, setStats] = useState({
    todayIncome: 0,
    todayExpense: 0,
    totalBalance: 0,
    monthIncome: 0,
    monthExpense: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!supabase) {
        setError('Supabase not configured')
        return
      }

      const today = new Date().toISOString().split('T')[0]
      const currentMonth = new Date().toISOString().slice(0, 7)

      // Get today's transactions
      const { data: todayData, error: todayError } = await supabase
        .from('transactions')
        .select('*')
        .eq('transaction_date', today)

      if (todayError) {
        throw todayError
      }

      // Get month's transactions
      const { data: monthData, error: monthError } = await supabase
        .from('transactions')
        .select('*')
        .like('transaction_date', `${currentMonth}%`)

      if (monthError) {
        throw monthError
      }

      // Get all transactions for total balance
      const { data: allData, error: allError } = await supabase
        .from('transactions')
        .select('*')

      if (allError) {
        throw allError
      }

      // Calculate stats
      const todayIncome = todayData?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0
      const todayExpense = todayData?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0
      const monthIncome = monthData?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0
      const monthExpense = monthData?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0
      const totalIncome = allData?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0
      const totalExpense = allData?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0
      const totalBalance = totalIncome - totalExpense

      setStats({
        todayIncome,
        todayExpense,
        totalBalance,
        monthIncome,
        monthExpense,
      })
    } catch (error: any) {
      console.error('Error fetching stats:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}