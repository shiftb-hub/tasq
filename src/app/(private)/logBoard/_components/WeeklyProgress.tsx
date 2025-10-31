"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyData } from "../_types/LogBoard";

type Props = {
  data: WeeklyData[];
};

const WeeklyProgress: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-5 text-lg font-bold text-slate-800">週次学習時間</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(value) => `${value}h`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="Programming"
            stackId="a"
            fill="#3B82F6"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Design"
            stackId="a"
            fill="#10B981"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Reading"
            stackId="a"
            fill="#F59E0B"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Practice"
            stackId="a"
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyProgress;
