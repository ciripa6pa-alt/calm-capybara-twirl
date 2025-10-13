'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  CreditCard, 
  Smartphone,
  Building,
  DollarSign,
  X
} from 'lucide-react'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: 'income' | 'expense'
}

export function TransactionModal({ isOpen, onClose, initialType }: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(initialType || 'income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [fundSource, setFundSource] = useState('')
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (initialType) {
      setTransactionType(initialType)
    }
  }, [initialType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulasi penyimpanan transaksi
    const transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(amount),
      description,
      category,
      paymentMethod,
      fundSource,
      transactionDate,
      createdAt: new Date().toISOString()
    }

    console.log('Transaction saved:', transaction)
    
    // Reset form
    setAmount('')
    setDescription('')
    setCategory('')
    setPaymentMethod('')
    setFundSource('')
    setTransactionDate(new Date().toISOString().split('T')[0])
    
    onClose()
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '')
    return new Intl.NumberFormat('id-ID').format(parseInt(number || '0'))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setAmount(formatCurrency(value))
  }

  const incomeCategories = [
    'Penjualan Produk',
    'Jasa',
    'Konsultasi',
    'Komisi',
    'Investasi',
    'Lainnya'
  ]

  const expenseCategories = [
    'Operasional',
    'Gaji',
    'Marketing',
    'Utilitas',
    'Transport',
    'Makan',
    'Lainnya'
  ]

  const paymentMethods = [
    { value: 'cash', label: 'Tunai', icon: Wallet },
    { value: 'qris', label: 'QRIS', icon: Smartphone },
    { value: 'bank_transfer', label: 'Transfer Bank', icon: Building },
    { value: 'other', label: 'Lainnya', icon: CreditCard }
  ]

  const fundSources = [
    { value: 'from_cash_drawer', label: 'Ambil dari Kas', icon: Wallet },
    { value: 'personal_fund', label: 'Dana Pribadi', icon: DollarSign },
    { value: 'bank', label: 'Bank', icon: Building },
    { value: 'other', label: 'Lainnya', icon: CreditCard }
  ]

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {transactionType === 'income' ? (
              <>
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                Tambah Pemasukan
              </>
            ) : (
              <>
                <ArrowDownRight className="h-5 w-5 text-red-600" />
                Tambah Pengeluaran
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Masukkan detail transaksi {transactionType === 'income' ? 'pemasukan' : 'pengeluaran'} Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type Toggle */}
          <Tabs value={transactionType} onValueChange={(value) => setTransactionType(value as 'income' | 'expense')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income" className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Pemasukan
              </TabsTrigger>
              <TabsTrigger value="expense" className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4" />
                Pengeluaran
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="pl-12 text-lg font-bold"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Keterangan</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan keterangan transaksi..."
              rows={2}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Button
                    key={method.value}
                    type="button"
                    variant={paymentMethod === method.value ? 'default' : 'outline'}
                    className="h-12 flex items-center gap-2"
                    onClick={() => setPaymentMethod(method.value)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Fund Source (for expenses) */}
          {transactionType === 'expense' && (
            <div className="space-y-2">
              <Label>Sumber Dana</Label>
              <div className="grid grid-cols-2 gap-2">
                {fundSources.map((source) => {
                  const Icon = source.icon
                  return (
                    <Button
                      key={source.value}
                      type="button"
                      variant={fundSource === source.value ? 'default' : 'outline'}
                      className="h-12 flex items-center gap-2"
                      onClick={() => setFundSource(source.value)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{source.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Transaction Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal Transaksi</Label>
            <Input
              id="date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          {/* Preview */}
          {amount && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Preview:</span>
                  <Badge variant={transactionType === 'income' ? 'default' : 'destructive'}>
                    {transactionType === 'income' ? '+' : '-'} Rp {amount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 ${
                transactionType === 'income' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
