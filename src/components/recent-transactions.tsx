import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const transactions = [
  { id: "1", title: "Ăn trưa", amount: -50000, category: "Ăn uống", date: "Hôm nay" },
  { id: "2", title: "Lương tháng", amount: 15000000, category: "Lương", date: "Hôm qua" },
  { id: "3", title: "Cà phê", amount: -35000, category: "Ăn uống", date: "Hôm qua" },
  { id: "4", title: "Đổ xăng", amount: -100000, category: "Đi lại", date: "2 ngày trước" },
]

export function RecentTransactions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Giao dịch gần đây</CardTitle>
        <CardDescription>Các khoản thu chi mới nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{transaction.category[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.title}</p>
                <p className="text-sm text-muted-foreground">{transaction.category} - {transaction.date}</p>
              </div>
              <div className={`ml-auto font-medium ${transaction.amount > 0 ? "text-green-500" : ""}`}>
                {transaction.amount > 0 ? "+" : ""}
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
