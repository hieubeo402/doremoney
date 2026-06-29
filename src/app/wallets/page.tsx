import { WalletManager } from "@/components/wallet-manager"

export default function WalletsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sổ ví</h2>
        <p className="text-muted-foreground">Quản lý các nguồn tiền và tài khoản của bạn</p>
      </div>
      
      <WalletManager />
    </div>
  )
}
