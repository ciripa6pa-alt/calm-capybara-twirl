export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true }) // urut dari lama ke baru

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

    // ✅ Tambahkan listener realtime agar chat otomatis update
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
      supabase.removeChannel(channel)
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
