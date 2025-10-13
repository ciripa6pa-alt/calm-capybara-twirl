'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Calendar
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  payment_method: string
  fund_source: string
  transaction_date: string
  created_at: string
}

export default function RiwayatPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today')

  useEffect(() => {
    // Simulasi data - nanti akan diganti dengan API call
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 1500000,
        description: 'Penjualan Produk A',
        category: 'Penjualan',
        payment_method: 'cash',
        fund_source: 'from_cash_drawer',
        transaction_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'expense',
        amount: 500000,
        description: 'Beli bahan baku',
        category: 'Operasional',
        payment_method: 'bank_transfer',
        fund_source: 'from_cash_drawer',
        transaction_date: new Date().toISOString().split('T')[0],
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'income',
        amount: 1000000,
        description: 'Pembayaran Jasa',
        category: 'Jasa',
        payment_method: 'qris',
        fund_source: 'from_cash_drawer',
        transaction_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '4',
        type: 'expense',
        amount: 700000,
        description: 'Biaya pengiriman',
        category: 'Operasional',
        payment_method: 'cash',
        fund_source: 'personal_fund',
        transaction_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '5',
        type: 'income',
        amount: 2000000,
        description: 'Penjualan Paket',
        category: 'Penjualan',
        payment_method: 'bank_transfer',
        fund_source: 'from_cash_drawer',
        transaction_date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        created_at: new Date(Date.now() - 259200000).toISOString(),
      },
    ]

    setTimeout(() => {
      setTransactions(mockTransactions)
      setFilteredTransactions(mockTransactions)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = transactions

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType)
    }

    // Filter by period
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (filterPeriod === 'today') {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.transaction_date)
        return transactionDate >= today
      })
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.transaction_date)
        return transactionDate >= weekAgo
      })
    } else if (filterPeriod === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.transaction_date)
        return transactionDate >= monthAgo
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, filterType, filterPeriod, searchTerm])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getTotalByType = (type: 'income' | 'expense') => {
    return filteredTransactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <PageHeader
        title="Buku Kas Digital"
        subtitle="Riwayat semua transaksi keuangan"
        rightAction={
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Main Content */}
      <div className="p-4 max-w-4xl mx-auto pb-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Pemasukan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(getTotalByType('income'))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">
                Total Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-700">
                {formatCurrency(getTotalByType('expense'))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriod} onValueChange={(value: any) => setFilterPeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="all">Semua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daftar Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Tidak ada transaksi yang ditemukan
                </p>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {transaction.description || 'Tanpa keterangan'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.transaction_date)} • {formatTime(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'income' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {transaction.payment_method}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {transaction.fund_source}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}