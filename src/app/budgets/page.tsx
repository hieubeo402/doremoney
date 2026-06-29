import { BudgetManager } from "@/components/budget-manager"

export default function BudgetsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">Ngân sách</h2>
        <p className="text-muted-foreground">Thiết lập giới hạn chi tiêu để không bị "cháy túi"</p>
      </div>
      
      <BudgetManager />
    </div>
  )
}
