"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "1월",
    total: 45000000,
  },
  {
    name: "2월",
    total: 52000000,
  },
  {
    name: "3월",
    total: 48000000,
  },
  {
    name: "4월",
    total: 61000000,
  },
  {
    name: "5월",
    total: 75000000,
  },
  {
    name: "6월",
    total: 85000000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₩${value / 1000000}M`}
        />
        <Tooltip
          formatter={(value: number) => [`₩${value.toLocaleString()}`, "매출"]}
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
