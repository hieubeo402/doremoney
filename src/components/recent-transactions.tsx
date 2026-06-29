import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentTransactions({ transactions = [] }: { transactions?: any[] }) {
  // Lấy 10 giao dịch gần nhất
  const displayTx = transactions.slice(0, 10)

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Giao dịch gần đây</CardTitle>
        <CardDescription>Các khoản thu chi mới nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {displayTx.length === 0 && <p className="text-muted-foreground text-sm">Chưa có giao dịch nào.</p>}
          {displayTx.map((transaction) => {
            const isIncome = transaction.type === 'income' || transaction.categories?.type === 'income'
            const catName = transaction.categories?.name || 'Không rõ'
            const amountStr = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(transaction.amount)
            
            return (
              <div key={transaction.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback style={{ backgroundColor: transaction.categories?.color + '20', color: transaction.categories?.color }}>
                    {catName.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.note || catName}</p>
                  <p className="text-sm text-muted-foreground">
                    {catName} - {new Date(transaction.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className={`ml-auto font-medium ${isIncome ? "text-green-500" : ""}`}>
                  {isIncome ? "+" : "-"}{amountStr}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
