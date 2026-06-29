import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CreditCard, Smartphone } from "lucide-react"

interface WalletCardProps {
  title: string
  balance: number
  type: "cash" | "credit" | "ewallet"
}

export function WalletCard({ title, balance, type }: WalletCardProps) {
  const Icon = type === "cash" ? Wallet : type === "credit" ? CreditCard : Smartphone

  return (
    <Card className="relative overflow-hidden group">
      {/* Glossy Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 dark:from-white/0 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(balance)}
        </div>
      </CardContent>
    </Card>
  )
}
