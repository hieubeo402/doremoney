import { TransactionForm } from "@/components/transaction-form"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Giao dịch</h2>
        <p className="text-muted-foreground">Quản lý thu chi của bạn</p>
      </div>
      <div className="mt-6">
        <TransactionForm />
      </div>
    </div>
  )
}
