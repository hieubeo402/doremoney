"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function TransactionForm() {
  const supabase = createClient()
  const [amountStr, setAmountStr] = useState("")
  const [note, setNote] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [walletId, setWalletId] = useState("")
  
  const [categories, setCategories] = useState<any[]>([])
  const [wallets, setWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [cats, walls] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('wallets').select('*')
      ])
      if (cats.data) setCategories(cats.data)
      if (walls.data) {
        setWallets(walls.data)
        if (walls.data.length > 0) setWalletId(walls.data[0].id)
      }
      setFetching(false)
    }
    fetchData()
  }, [])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (!val) {
      setAmountStr("")
      return
    }
    const formatted = new Intl.NumberFormat("en-US").format(parseInt(val, 10))
    setAmountStr(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amountStr || !categoryId || !walletId) return
    
    setLoading(true)
    const amount = parseInt(amountStr.replace(/,/g, ""), 10)
    const selectedCat = categories.find(c => c.id === categoryId)
    
    // Insert Giao dịch
    const { error: txError } = await supabase.from('transactions').insert([{
      wallet_id: walletId,
      category_id: categoryId,
      amount: amount,
      type: selectedCat?.type || 'expense',
      note: note
    }])
    
    if (!txError) {
      // Cập nhật số dư Ví
      const selectedWallet = wallets.find(w => w.id === walletId)
      if (selectedWallet) {
        const newBalance = selectedCat?.type === 'income' 
          ? Number(selectedWallet.balance) + amount 
          : Number(selectedWallet.balance) - amount
          
        await supabase.from('wallets').update({ balance: newBalance }).eq('id', walletId)
      }
      // Reset form
      setAmountStr("")
      setNote("")
      alert("Đã lưu giao dịch thành công!")
    } else {
      alert("Lỗi khi lưu giao dịch: " + txError.message)
    }
    setLoading(false)
  }

  if (fetching) return <div className="p-6 text-center text-muted-foreground animate-pulse">Đang tải dữ liệu...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Số tiền (VNĐ)</Label>
        <Input 
          id="amount" 
          placeholder="Ví dụ: 1,000,000" 
          value={amountStr}
          onChange={handleAmountChange}
          className="text-2xl font-bold h-14"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ví nguồn</Label>
          <Select value={walletId} onValueChange={setWalletId} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn ví" />
            </SelectTrigger>
            <SelectContent>
              {wallets.map(w => (
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Danh mục</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} {c.type === 'income' ? '(Thu)' : '(Chi)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Input 
          id="note" 
          placeholder="Ví dụ: Ăn trưa bún chả" 
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading || !amountStr || !categoryId}>
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Lưu Giao Dịch"}
      </Button>
    </form>
  )
}
