import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Message, Transaction } from '@/lib/supabase'

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })

      if (error) throw error

      setMessages(data || [])
    } catch (err: any) {
      console.error('Error fetching messages:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async (message: Omit<Message, 'id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    try {
      const fullMessage = {
        ...message,
        timestamp: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(fullMessage)
        .select()
        .single()

      if (error) throw error

      setMessages(prev => [...prev, data])
      return data
    } catch (err: any) {
      console.error('Error adding message:', err)
      throw err
    }
  }

  const deleteAllMessages = async () => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    try {
      const { error } = await supabase.from('messages').delete().neq('id', 'placeholder')
      if (error) throw error
      setMessages([])
    } catch (err: any) {
      console.error('Error deleting all messages:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchMessages()

    if (!supabase) return

    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages((prev) => [...prev, payload.new as Message])
        } else if (payload.eventType === 'DELETE') {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
        } else if (payload.eventType === 'UPDATE') {
          setMessages((prev) =>
            prev.map((m) => (m.id === payload.new.id ? (payload.new as Message) : m))
          )
        }
      })
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return {
    messages,
    loading,
    error,
    addMessage,
    deleteAllMessages,
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async (userId?: string) => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error

      setTransactions(data || [])
    } catch (err: any) {
      console.error('Error fetching transactions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single()

      if (error) throw error

      setTransactions(prev => [data, ...prev])
      return data
    } catch (err: any) {
      console.error('Error adding transaction:', err)
      throw err
    }
  }

  const deleteTransaction = async (id: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err: any) {
      console.error('Error deleting transaction:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchTransactions()

    if (!supabase) return

    const channel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTransactions((prev) => [payload.new as Transaction, ...prev])
        } else if (payload.eventType === 'DELETE') {
          setTransactions((prev) => prev.filter((t) => t.id !== payload.old.id))
        } else if (payload.eventType === 'UPDATE') {
          setTransactions((prev) =>
            prev.map((t) => (t.id === payload.new.id ? (payload.new as Transaction) : t))
          )
        }
      })
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(channel)
      }
    }
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
