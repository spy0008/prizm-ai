"use client";
import { ActivityBarChartProps } from '@/types/barGraph';
import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";



const BarGraph = ({ data }: ActivityBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={8} barCategoryGap={24}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="commits" name="Commits" fill="#2563EB" radius={[4, 4, 0, 0]} />
        <Bar dataKey="prs" name="PRs" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="reviews" name="AI Reviews" fill="#22C55E" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarGraph