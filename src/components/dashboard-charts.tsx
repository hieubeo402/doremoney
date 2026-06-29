"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function DashboardCharts({ transactions = [] }: { transactions?: any[] }) {
  // Group transactions by Date to show a chart
  // This is a simple aggregation logic for demo
  const chartDataMap: Record<string, { name: string, thu: number, chi: number }> = {}
  
  transactions.forEach(tx => {
    const dateStr = new Date(tx.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    if (!chartDataMap[dateStr]) {
      chartDataMap[dateStr] = { name: dateStr, thu: 0, chi: 0 }
    }
    if (tx.type === 'income' || tx.categories?.type === 'income') {
      chartDataMap[dateStr].thu += Number(tx.amount)
    } else {
      chartDataMap[dateStr].chi += Number(tx.amount)
    }
  })
  
  const chartData = Object.values(chartDataMap).reverse().slice(0, 7) // Last 7 days

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Dòng tiền gần đây</CardTitle>
        <CardDescription>So sánh thu nhập và chi tiêu</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
              <Bar dataKey="thu" fill="#22c55e" radius={[4, 4, 0, 0]} name="Thu" />
              <Bar dataKey="chi" fill="#ef4444" radius={[4, 4, 0, 0]} name="Chi" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
            Chưa có dữ liệu giao dịch
          </div>
        )}
      </CardContent>
    </Card>
  )
}
