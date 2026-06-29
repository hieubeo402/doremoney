import { DashboardCharts } from "@/components/dashboard-charts"
import { WalletCard } from "@/components/wallet-card"
import { RecentTransactions } from "@/components/recent-transactions"

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">Theo dõi tình hình tài chính của bạn</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <WalletCard title="Tiền mặt" balance={5000000} type="cash" />
        <WalletCard title="Thẻ tín dụng" balance={-2000000} type="credit" />
        <WalletCard title="Ví điện tử" balance={1500000} type="ewallet" />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <DashboardCharts />
        </div>
        <div className="md:col-span-3">
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
