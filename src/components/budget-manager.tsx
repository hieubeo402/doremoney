'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Plus, Trash2 } from 'lucide-react'

export function BudgetManager() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [user, setUser] = useState<any>(null)
  
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) setUser(session.user)

    // 1. Fetch Expense Categories
    const { data: cats } = await supabase.from('categories').select('*').eq('type', 'expense')
    if (cats) setCategories(cats)

    if (!session) {
      setLoading(false)
      return
    }

    // 2. Fetch Budgets
    const { data: bData } = await supabase.from('budgets')
      .select('*, categories(*)')
      .eq('user_id', session.user.id)
      .eq('month', currentMonth)
      .eq('year', currentYear)
    if (bData) setBudgets(bData)

    // 3. Fetch Transactions for this month to calculate spent amount
    const startDate = new Date(currentYear, currentMonth - 1, 1).toISOString()
    const endDate = new Date(currentYear, currentMonth, 0).toISOString()
    
    const { data: txData } = await supabase.from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('type', 'expense')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      
    if (txData) setTransactions(txData)

    setLoading(false)
  }

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Vui lòng đăng nhập để thiết lập ngân sách!")
      return
    }

    const { error } = await supabase.from('budgets').insert([{
      category_id: categoryId,
      amount: parseInt(amount.replace(/,/g, '') || '0', 10),
      month: currentMonth,
      year: currentYear,
      user_id: user.id
    }])

    if (error) {
      alert("Lỗi hoặc Danh mục này đã có ngân sách trong tháng này.")
    } else {
      setCategoryId('')
      setAmount('')
      fetchData()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Xóa ngân sách này?")) {
      await supabase.from('budgets').delete().eq('id', id)
      fetchData()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Thiết lập ngân sách</CardTitle>
          <CardDescription>Tháng {currentMonth}/{currentYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div className="space-y-2">
              <Label>Danh mục chi tiêu</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hạn mức tối đa (VNĐ)</Label>
              <Input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ví dụ: 3000000" className="bg-white/50" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
              <Plus className="w-4 h-4 mr-2" /> Thêm Ngân sách
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-4">
        {loading ? <p>Đang tải...</p> : budgets.length === 0 ? <p className="text-muted-foreground">Chưa có ngân sách nào được thiết lập cho tháng này.</p> : (
          budgets.map(budget => {
            // Calculate spent
            const spent = transactions
              .filter(tx => tx.category_id === budget.category_id)
              .reduce((sum, tx) => sum + tx.amount, 0)
            
            const percentage = Math.min((spent / budget.amount) * 100, 100)
            let color = "bg-green-500"
            if (percentage > 80) color = "bg-red-500"
            else if (percentage > 50) color = "bg-yellow-500"

            return (
              <Card key={budget.id} className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-md">
                <CardContent className="p-4 pl-6 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{budget.categories?.icon}</span>
                      <h3 className="font-bold text-lg">{budget.categories?.name}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)} className="text-red-500 hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-muted-foreground">Đã chi: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(spent)}</span>
                    <span className="text-gray-900">Tối đa: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(budget.amount)}</span>
                  </div>
                  
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                  </div>
                  
                  {percentage >= 100 && (
                    <p className="text-xs text-red-500 font-bold mt-2">Vượt quá ngân sách!</p>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
