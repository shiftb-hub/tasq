"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { LearningTimeData } from "../_types/LogBoard";

type Props = {
  data: LearningTimeData[];
};

const LearningTimeBreakdown: React.FC<Props> = ({ data }) => {
  const totalTime = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="h-96 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold text-slate-800">学習時間の内訳</h3>
      <div className="flex h-full items-center justify-center">
        <div className="relative">
          <ResponsiveContainer width={280} height={280}>
            <PieChart>
              <Pie
                data={data}
                cx={140}
                cy={140}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-slate-800">
              {totalTime.toFixed(1)}h
            </div>
            <div className="text-sm font-medium text-slate-500">Total Time</div>
          </div>
        </div>
        <div className="ml-8 flex flex-col gap-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-slate-600">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {item.value}h ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningTimeBreakdown;
