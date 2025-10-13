'use client'

import { useState, useEffect } from 'react'
import { DashboardCards } from '@/components/dashboard/DashboardCards'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProfileDropdown } from '@/components/profile/ProfileDropdown'
import { useTransactionModal } from '@/components/transaction/TransactionModalProvider'
import { useNotifications } from '@/hooks/use-notifications'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Calendar, TrendingUp, Users, Download, LogOut } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  transaction_date: string
  created_at: string
}

function MonthlySummary({ userId }: { userId: string }) {
  const [monthlyData, setMonthlyData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netIncome: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!userId) return

      try {
        const response = await fetch(`/api/transactions?userId=${userId}&period=month`)
        const result = await response.json()

        if (response.ok && result.data) {
          const transactions = result.data
          const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
          const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
          
          setMonthlyData({
            totalIncome,
            totalExpense,
            netIncome: totalIncome - totalExpense
          })
        }
      } catch (error) {
        console.error('Error fetching monthly data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMonthlyData()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-blue-100 text-sm">Total Pemasukan</p>
            <p className="text-xl font-bold">Loading...</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Pengeluaran</p>
            <p className="text-xl font-bold">Loading...</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-400">
          <p className="text-blue-100 text-sm">Laba Bersih</p>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-blue-100 text-sm">Total Pemasukan</p>
          <p className="text-xl font-bold">
            Rp {new Intl.NumberFormat('id-ID').format(monthlyData.totalIncome)}
          </p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Total Pengeluaran</p>
          <p className="text-xl font-bold">
            Rp {new Intl.NumberFormat('id-ID').format(monthlyData.totalExpense)}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-blue-400">
        <p className="text-blue-100 text-sm">Laba Bersih</p>
        <p className="text-2xl font-bold">
          Rp {new Intl.NumberFormat('id-ID').format(monthlyData.netIncome)}
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const [todayIncome, setTodayIncome] = useState(0)
  const [todayExpense, setTodayExpense] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Ahmad Rizki')
  const { openModal } = useTransactionModal()
  const { unreadCount, hasPWAUpdate, markAllAsRead, clearPWAUpdate } = useNotifications()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Fetch today's transactions
        const response = await fetch(`/api/transactions?userId=${user.id}&period=today`)
        const result = await response.json()

        if (response.ok && result.data) {
          const transactions = result.data
          const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
          const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)

          setTodayIncome(income)
          setTodayExpense(expense)

          // Fetch all transactions for total balance
          const allResponse = await fetch(`/api/transactions?userId=${user.id}&period=all`)
          const allResult = await allResponse.json()

          if (allResponse.ok && allResult.data) {
            const allTransactions = allResult.data
            const totalIncome = allTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0)
            const totalExpense = allTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0)
            
            setTotalBalance(totalIncome - totalExpense)
          }

          // Set recent transactions (last 5)
          setRecentTransactions(transactions.slice(0, 5))
        } else {
          // Fallback to mock data if API fails
          setTodayIncome(0)
          setTodayExpense(0)
          setTotalBalance(0)
          setRecentTransactions([])
        }

        // Set user name from auth
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name)
        } else if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name)
        } else {
          setUserName(user.email?.split('@')[0] || 'User')
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Fallback to mock data
        setTodayIncome(0)
        setTodayExpense(0)
        setTotalBalance(0)
        setRecentTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const todayProfit = todayIncome - todayExpense

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleEditProfile = () => {
    const newName = prompt('Edit nama:', userName)
    if (newName && newName.trim()) {
      setUserName(newName.trim())
    }
  }

  const handleUpdatePWA = () => {
    clearPWAUpdate()
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Sticky Header */}
        <PageHeader
          title="Kasir Saku Plus"
          subtitle={new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          showProfile={true}
          profileComponent={
            <ProfileDropdown
              userName={userName}
              unreadCount={unreadCount}
              hasPWAUpdate={hasPWAUpdate}
              onLogout={handleLogout}
              onEditProfile={handleEditProfile}
              onMarkAllRead={markAllAsRead}
              onUpdatePWA={handleUpdatePWA}
            />
          }
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
        <div className="p-4 max-w-md mx-auto pb-20">
          {/* Dashboard Cards */}
          <DashboardCards
            todayIncome={todayIncome}
            todayExpense={todayExpense}
            todayProfit={todayProfit}
            totalBalance={totalBalance}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Button
              variant="outline"
              className="h-16 flex flex-col gap-1"
              onClick={() => openModal('income')}
            >
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-xs">Pemasukan</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col gap-1"
              onClick={() => openModal('expense')}
            >
              <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
              <span className="text-xs">Pengeluaran</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col gap-1 relative"
              onClick={() => window.location.href = '/pesan'}
            >
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Pesan</span>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <div className="h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                </div>
              )}
            </Button>
          </div>

          {/* Recent Transactions */}
          <RecentTransactions transactions={recentTransactions} />

          {/* Summary Card */}
          <Card className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Ringkasan Bulan Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlySummary userId={user?.id || ''} />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
