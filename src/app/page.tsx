import { DashboardCharts } from "@/components/dashboard-charts"
import { WalletCard } from "@/components/wallet-card"
import { RecentTransactions } from "@/components/recent-transactions"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 0 // Disable cache to always fetch latest data

export default async function Home() {
  const supabase = await createClient()

  const [walletsResponse, txResponse] = await Promise.all([
    supabase.from('wallets').select('*').order('created_at', { ascending: true }),
    supabase.from('transactions').select('*, categories(*)').order('created_at', { ascending: false }).limit(50)
  ])

  const wallets = walletsResponse.data || []
  const transactions = txResponse.data || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">Theo dõi tình hình tài chính của bạn</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {wallets.length === 0 && <p className="text-muted-foreground p-4">Chưa có ví nào.</p>}
        {wallets.map((w: any) => (
          <WalletCard key={w.id} title={w.name} balance={w.balance} type={w.type} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <DashboardCharts transactions={transactions} />
        </div>
        <div className="md:col-span-3">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
