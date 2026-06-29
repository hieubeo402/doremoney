import { LoanManager } from "@/components/loan-manager"

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Khoản nợ</h2>
        <p className="text-muted-foreground">Theo dõi và quản lý tiền cho vay hoặc đi mượn</p>
      </div>
      
      <LoanManager />
    </div>
  )
}
