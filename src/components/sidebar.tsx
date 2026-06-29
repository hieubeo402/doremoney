"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ReceiptText, Wallet, PieChart, PiggyBank, HandCoins } from "lucide-react"

import { cn } from "@/lib/utils"

export const navigationLinks = [
  { name: "Tổng quan", href: "/", icon: LayoutDashboard },
  { name: "Giao dịch", href: "/transactions", icon: ReceiptText },
  { name: "Sổ ví", href: "/wallets", icon: Wallet },
  { name: "Ngân sách", href: "/budgets", icon: PieChart },
  { name: "Tiết kiệm", href: "/savings", icon: PiggyBank },
  { name: "Khoản nợ", href: "/loans", icon: HandCoins },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r border-white/20 dark:border-white/10 bg-background/40 backdrop-blur-3xl shadow-xl">
      <div className="p-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-sm">
          Doremoney
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {navigationLinks.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
