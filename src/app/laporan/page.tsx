'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Filter
} from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  created_at: string
}

interface CategoryData {
  name: string
  value: number
  color: string
}

export default function LaporanPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [reportType, setReportType] = useState('all')

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user) return

      try {
        // Fetch transactions from Supabase based on period
        const response = await fetch(`/api/transactions?userId=${user.id}&period=${period}`)
        const result = await response.json()

        if (response.ok && result.data) {
          setTransactions(result.data)
        } else {
          // Fallback to empty array if API fails
          setTransactions([])
        }
      } catch (error) {
        console.error('Error fetching report data:', error)
        // Fallback to empty array
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [user, period])

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getNetIncome = () => {
    return getTotalIncome() - getTotalExpense()
  }

  const getCategoryData = (): CategoryData[] => {
    const categoryMap = new Map<string, number>()
    
    transactions.forEach(transaction => {
      const current = categoryMap.get(transaction.category) || 0
      categoryMap.set(transaction.category, current + transaction.amount)
    })

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
    
    return Array.from(categoryMap.entries()).map((entry, index) => ({
      name: entry[0],
      value: entry[1],
      color: colors[index % colors.length]
    }))
  }

  const getMonthlyData = () => {
    const monthlyMap = new Map<string, { income: number; expense: number }>()
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at)
      const monthKey = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      
      const current = monthlyMap.get(monthKey) || { income: 0, expense: 0 }
      
      if (transaction.type === 'income') {
        current.income += transaction.amount
      } else {
        current.expense += transaction.amount
      }
      
      monthlyMap.set(monthKey, current)
    })

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      ...data
    }))
  }

  const exportReport = () => {
    alert('Laporan akan diunduh dalam format CSV')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalIncome = getTotalIncome()
  const totalExpense = getTotalExpense()
  const netIncome = getNetIncome()
  const categoryData = getCategoryData()
  const monthlyData = getMonthlyData()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PageHeader 
          title="Laporan Keuangan" 
          subtitle="Analisis dan ringkasan transaksi keuangan"
        />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Tipe laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Transaksi</SelectItem>
              <SelectItem value="income">Pemasukan</SelectItem>
              <SelectItem value="expense">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Rp {totalIncome.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                Rp {totalExpense.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                +5.2% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendapatan Bersih</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Rp {netIncome.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                {netIncome >= 0 ? 'Keuntungan' : 'Kerugian'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
                  <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribusi Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Transaksi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      Rp {transaction.amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Rekomendasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Pertimbangkan untuk mengurangi pengeluaran kategori Marketing untuk meningkatkan profitabilitas.
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Penjualan produk menunjukkan tren positif. Pertimbangkan untuk meningkatkan stok.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Biaya operasional meningkat. Segera evaluasi efisiensi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </ProtectedRoute>
  )
}
