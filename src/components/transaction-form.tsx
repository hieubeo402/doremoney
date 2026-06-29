"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"

export function TransactionForm() {
  const [amountStr, setAmountStr] = useState("")

  // Hàm format số có dấu phẩy: 1,000,000
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Xoá mọi ký tự không phải số
    const val = e.target.value.replace(/\D/g, "")
    if (!val) {
      setAmountStr("")
      return
    }
    // Định dạng lại có dấu phẩy
    const formatted = new Intl.NumberFormat("en-US").format(parseInt(val, 10))
    setAmountStr(formatted)
  }

  const evaluateExpression = () => {
    try {
      // Cho phép nhập phép tính như 50000+20000
      // Đây chỉ là demo đơn giản. Không dùng eval trong thực tế để tránh XSS,
      // nhưng ở đây giả định string chỉ chứa số và toán tử cơ bản.
      const sanitized = amountStr.replace(/,/g, "").replace(/[^\d+\-*/.]/g, "")
      if (!sanitized) return
      
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${sanitized}`)()
      
      if (!isNaN(result)) {
        setAmountStr(new Intl.NumberFormat("en-US").format(result))
      }
    } catch (error) {
      // Biểu thức không hợp lệ, bỏ qua
      console.log(error)
    }
  }

  return (
    <div className="max-w-md space-y-6 bg-card p-6 rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="amount">Số tiền (VNĐ)</Label>
        <div className="relative">
          <Input 
            id="amount" 
            placeholder="Ví dụ: 1,000,000 hoặc 500k+20k" 
            value={amountStr}
            onChange={handleAmountChange}
            className="pr-10 text-lg font-semibold"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
            onClick={evaluateExpression}
            title="Tính toán phép tính"
          >
            <Calculator className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Danh mục</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">Ăn uống</SelectItem>
            <SelectItem value="transport">Đi lại</SelectItem>
            <SelectItem value="salary">Tiền lương</SelectItem>
            <SelectItem value="shopping">Mua sắm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Input id="note" placeholder="Ví dụ: Ăn trưa bún chả" />
      </div>

      <Button className="w-full">Lưu giao dịch</Button>
    </div>
  )
}
