'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TransactionList() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) setUser(session.user)

    let query = supabase
      .from('transactions')
      .select('*, categories(*), wallets(*)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (session) {
      query = query.or(`user_id.eq.${session.user.id},user_id.is.null`)
    } else {
      query = query.is('user_id', null)
    }

    const { data } = await query
    if (data) setTransactions(data)
    setLoading(false)
  }

  const handleDelete = async (id: string, userId: string | null) => {
    if (!user || (userId && userId !== user.id)) {
      alert("Bạn không có quyền xóa giao dịch này.")
      return
    }

    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      await supabase.from('transactions').delete().eq('id', id)
      fetchTransactions()
    }
  }

  return (
    <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl mt-6">
      <CardHeader>
        <CardTitle>Lịch sử giao dịch</CardTitle>
        <CardDescription>Danh sách 100 giao dịch gần nhất</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4 text-muted-foreground">Đang tải...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Chưa có giao dịch nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Ví</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      {new Date(t.created_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{t.categories?.icon || '🏷️'}</span>
                        <span>{t.categories?.name || 'Không rõ'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{t.wallets?.name || 'Ví đã xóa'}</TableCell>
                    <TableCell>{t.note || '-'}</TableCell>
                    <TableCell className={`text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(!t.user_id || (user && t.user_id === user.id)) && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id, t.user_id)} className="text-red-500 hover:bg-red-100">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
