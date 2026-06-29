'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, Plus, Trash2 } from 'lucide-react'

export function WalletManager() {
  const [wallets, setWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) setUser(session.user)

    let query = supabase.from('wallets').select('*').order('created_at', { ascending: true })
    if (session) {
      // Fetch both global wallets (null user_id) and user's wallets
      query = query.or(`user_id.eq.${session.user.id},user_id.is.null`)
    } else {
      query = query.is('user_id', null)
    }

    const { data } = await query
    if (data) setWallets(data)
    setLoading(false)
  }

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Vui lòng đăng nhập để thêm ví mới!")
      return
    }

    const { error } = await supabase.from('wallets').insert([{
      name,
      balance: parseInt(balance.replace(/,/g, '') || '0', 10),
      user_id: user.id,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
    }])

    if (!error) {
      setName('')
      setBalance('')
      fetchWallets()
    }
  }

  const handleDelete = async (id: string, walletUserId: string) => {
    if (!user || walletUserId !== user.id) {
      alert("Bạn không thể xóa ví mặc định hoặc ví của người khác.")
      return
    }
    if (confirm('Bạn có chắc muốn xóa ví này? Tất cả giao dịch liên quan sẽ bị xóa!')) {
      await supabase.from('wallets').delete().eq('id', id)
      fetchWallets()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Thêm Ví Mới</CardTitle>
          <CardDescription>Tạo ví để bắt đầu quản lý dòng tiền</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddWallet} className="space-y-4">
            <div className="space-y-2">
              <Label>Tên ví</Label>
              <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: Tiền mặt, Thẻ tín dụng..." className="bg-white/50" />
            </div>
            <div className="space-y-2">
              <Label>Số dư ban đầu</Label>
              <Input required type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="Ví dụ: 5000000" className="bg-white/50" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
              <Plus className="w-4 h-4 mr-2" /> Thêm Ví
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? <p>Đang tải...</p> : wallets.length === 0 ? <p>Chưa có ví nào.</p> : (
          wallets.map(w => (
            <Card key={w.id} className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: w.color || '#3b82f6' }} />
              <CardContent className="p-4 pl-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/50 rounded-full">
                    <Wallet className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{w.name}</h3>
                    <p className="text-muted-foreground font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(w.balance)}
                    </p>
                  </div>
                </div>
                {user && w.user_id === user.id && (
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(w.id, w.user_id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
