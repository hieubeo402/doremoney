"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "T2", thu: 4000, chi: 2400 },
  { name: "T3", thu: 3000, chi: 1398 },
  { name: "T4", thu: 2000, chi: 9800 },
  { name: "T5", thu: 2780, chi: 3908 },
  { name: "T6", thu: 1890, chi: 4800 },
  { name: "T7", thu: 2390, chi: 3800 },
  { name: "CN", thu: 3490, chi: 4300 },
]

export function DashboardCharts() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Dòng tiền tuần này</CardTitle>
        <CardDescription>So sánh thu nhập và chi tiêu trong tuần</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}k`} />
            <Tooltip />
            <Bar dataKey="thu" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="chi" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
