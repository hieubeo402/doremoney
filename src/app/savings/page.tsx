import { SavingsManager } from "@/components/savings-manager"

export default function SavingsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Tiết kiệm</h2>
        <p className="text-muted-foreground">Tích lũy cho các mục tiêu tương lai</p>
      </div>
      
      <SavingsManager />
    </div>
  )
}
