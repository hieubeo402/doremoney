'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HandCoins, Plus, CheckCircle, Trash2, Clock } from 'lucide-react'

export function LoanManager() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [personName, setPersonName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('lend')
  const [dueDate, setDueDate] = useState('')
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }
    setUser(session.user)

    const { data } = await supabase.from('loans').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (data) setLoans(data)
    setLoading(false)
  }

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Vui lòng đăng nhập để thêm khoản nợ!")
      return
    }

    const { error } = await supabase.from('loans').insert([{
      person_name: personName,
      amount: parseInt(amount.replace(/,/g, '') || '0', 10),
      type,
      due_date: dueDate || null,
      user_id: user.id
    }])

    if (!error) {
      setPersonName('')
      setAmount('')
      setDueDate('')
      fetchLoans()
    }
  }

  const handleMarkPaid = async (id: string) => {
    await supabase.from('loans').update({ status: 'paid' }).eq('id', id)
    fetchLoans()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa khoản nợ này?')) {
      await supabase.from('loans').delete().eq('id', id)
      fetchLoans()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Thêm Khoản Nợ Mới</CardTitle>
          <CardDescription>Ghi lại tiền cho mượn hoặc đi vay</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLoan} className="space-y-4">
            <div className="space-y-2">
              <Label>Loại</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lend">Cho vay (Người ta nợ mình)</SelectItem>
                  <SelectItem value="borrow">Đi vay (Mình nợ người ta)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tên người vay/chủ nợ</Label>
              <Input required value={personName} onChange={e => setPersonName(e.target.value)} placeholder="Ví dụ: Anh Nam, Chị Lan..." className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label>Số tiền</Label>
              <Input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ví dụ: 1000000" className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label>Hạn trả (Không bắt buộc)</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-white/50" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
              <Plus className="w-4 h-4 mr-2" /> Lưu Khoản Nợ
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? <p>Đang tải...</p> : loans.length === 0 ? <p>Chưa có khoản nợ nào.</p> : (
          loans.map(loan => (
            <Card key={loan.id} className={`bg-white/40 backdrop-blur-3xl border-white/20 shadow-md relative overflow-hidden group ${loan.status === 'paid' ? 'opacity-60' : ''}`}>
              <div className={`absolute top-0 left-0 w-2 h-full ${loan.type === 'lend' ? 'bg-green-500' : 'bg-red-500'}`} />
              <CardContent className="p-4 pl-6 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{loan.person_name}</h3>
                      {loan.status === 'paid' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Đã trả</span>}
                    </div>
                    <p className={`font-semibold ${loan.type === 'lend' ? 'text-green-600' : 'text-red-600'}`}>
                      {loan.type === 'lend' ? 'Cho vay: ' : 'Đi vay: '}
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(loan.amount)}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {loan.status === 'pending' && (
                      <Button variant="ghost" size="icon" onClick={() => handleMarkPaid(loan.id)} className="text-green-600 hover:bg-green-100">
                        <CheckCircle className="w-5 h-5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(loan.id)} className="text-red-500 hover:bg-red-100">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                {loan.due_date && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 mr-1" /> Hạn trả: {new Date(loan.due_date).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
