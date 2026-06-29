import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"

export default function TransactionsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Giao dịch</h2>
        <p className="text-muted-foreground">Quản lý thu chi của bạn</p>
      </div>

      {/* Form nhập giao dịch mới */}
      <TransactionForm />

      {/* Bảng danh sách lịch sử giao dịch */}
      <TransactionList />
    </div>
  )
}
