'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, TrendingUp } from 'lucide-react'

export function SavingsManager() {
  const [savings, setSavings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchSavings()
  }, [])

  const fetchSavings = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }
    setUser(session.user)

    const { data } = await supabase.from('savings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      
    if (data) setSavings(data)
    setLoading(false)
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Vui lòng đăng nhập để tạo mục tiêu!")
      return
    }

    const { error } = await supabase.from('savings').insert([{
      name,
      target_amount: parseInt(targetAmount.replace(/,/g, '') || '0', 10),
      deadline: deadline || null,
      user_id: user.id,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    }])

    if (!error) {
      setName('')
      setTargetAmount('')
      setDeadline('')
      fetchSavings()
    }
  }

  const handleAddMoney = async (id: string, currentAmount: number, maxAmount: number) => {
    const amountToAddStr = prompt("Nhập số tiền muốn gửi thêm vào mục tiêu này:")
    if (!amountToAddStr) return
    const amountToAdd = parseInt(amountToAddStr.replace(/,/g, ''), 10)
    if (isNaN(amountToAdd) || amountToAdd <= 0) return

    const newAmount = Math.min(currentAmount + amountToAdd, maxAmount)

    await supabase.from('savings').update({ current_amount: newAmount }).eq('id', id)
    fetchSavings()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa mục tiêu này?")) {
      await supabase.from('savings').delete().eq('id', id)
      fetchSavings()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Mục tiêu Tiết kiệm</CardTitle>
          <CardDescription>Tích tiểu thành đại</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="space-y-2">
              <Label>Tên mục tiêu (VD: Mua xe, Du lịch)</Label>
              <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Tên mục tiêu" className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label>Số tiền mục tiêu (VNĐ)</Label>
              <Input required type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="Ví dụ: 50000000" className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label>Hạn chót (Không bắt buộc)</Label>
              <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="bg-white/50" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Tạo Mục tiêu
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-4">
        {loading ? <p>Đang tải...</p> : savings.length === 0 ? <p className="text-muted-foreground">Chưa có mục tiêu tiết kiệm nào.</p> : (
          savings.map(goal => {
            const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100)

            return (
              <Card key={goal.id} className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-md">
                <CardContent className="p-4 pl-6 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-xs text-muted-foreground">Hạn: {new Date(goal.deadline).toLocaleDateString('vi-VN')}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddMoney(goal.id, goal.current_amount, goal.target_amount)} className="text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                        <TrendingUp className="w-4 h-4 mr-1" /> Góp tiền
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)} className="text-red-500 hover:bg-red-100">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-emerald-600">Đã gom: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(goal.current_amount)}</span>
                    <span className="text-gray-900">Mục tiêu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(goal.target_amount)}</span>
                  </div>
                  
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-1000" style={{ width: `${percentage}%` }} />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  {percentage >= 100 && (
                    <p className="text-sm text-pink-600 font-bold mt-3 text-center">🎉 Chúc mừng bạn đã hoàn thành mục tiêu!</p>
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
