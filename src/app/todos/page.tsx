'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Todo {
  id: string
  user_id: string
  task: string
  is_complete: boolean
  created_at: string
}

export default function TodosPage() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch todos for current user
  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return
      setLoading(true)
      try {
        // integrated with Supabase: read todos
        const res = await fetch(`/api/todos?userId=${user.id}`)
        const json = await res.json()
        if (res.ok) {
          setTodos(json.data || [])
        } else {
          console.error('Failed fetching todos:', json.error)
        }
      } catch (e) {
        console.error('Error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchTodos()
  }, [user])

  const handleAddTodo = async () => {
    if (!user || !newTask.trim()) return
    try {
      // integrated with Supabase: insert todo
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, task: newTask.trim() }),
      })
      const json = await res.json()
      if (res.ok) {
        setTodos(prev => [json.data, ...prev])
        setNewTask('')
      } else {
        console.error('Failed adding todo:', json.error)
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }

  const toggleComplete = async (todo: Todo) => {
    try {
      // integrated with Supabase: update todo
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id, is_complete: !todo.is_complete }),
      })
      const json = await res.json()
      if (res.ok) {
        setTodos(prev => prev.map(t => (t.id === todo.id ? json.data : t)))
      } else {
        console.error('Failed updating todo:', json.error)
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      // integrated with Supabase: delete todo
      const res = await fetch(`/api/todos?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (res.ok) {
        setTodos(prev => prev.filter(t => t.id !== id))
      } else {
        console.error('Failed deleting todo:', json.error)
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Todos</h1>

      <Card className="p-3 flex gap-2">
        <Input
          placeholder="Tulis tugas baru..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button onClick={handleAddTodo} disabled={!newTask.trim() || loading}>Tambah</Button>
      </Card>

      <Card className="p-3">
        {loading ? (
          <p>Memuat...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-500">Belum ada tugas</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between gap-2 border rounded p-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.is_complete}
                    onChange={() => toggleComplete(todo)}
                  />
                  <span className={todo.is_complete ? 'line-through text-gray-500' : ''}>{todo.task}</span>
                </label>
                <Button variant="destructive" size="sm" onClick={() => deleteTodo(todo.id)}>Hapus</Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}