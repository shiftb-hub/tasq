"use client";

import React from "react";
import { Calendar, Clock, TrendingUp, Target, Flame } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

type Props = {
  onDateRangeChange?: (range: string) => void;
  totalTime: number;
  weeklyTime: number;
  monthlyGoalPercentage: number;
  currentStreak: number;
};

const LogBoardHeaderWithStats: React.FC<Props> = ({
  onDateRangeChange,
  totalTime,
  weeklyTime,
  monthlyGoalPercentage,
  currentStreak,
}) => {
  const handleDateRangeChange = (value: string) => {
    if (onDateRangeChange) {
      onDateRangeChange(value);
    }
  };

  const stats = [
    {
      title: "Total",
      value: `${totalTime}h`,
      icon: Clock,
      color: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "This Week",
      value: `${weeklyTime}h`,
      icon: TrendingUp,
      color: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Goal",
      value: `${monthlyGoalPercentage}%`,
      icon: Target,
      color: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Streak",
      value: `${currentStreak}d`,
      icon: Flame,
      color: "text-orange-600",
      bgLight: "bg-orange-50",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* 右側: 統計情報 */}
        <div className="flex flex-wrap gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-4 py-2"
              >
                <div className={`rounded-md p-2 ${stat.bgLight}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 左側: 日付選択 */}
        <div className="flex items-center gap-3 bg-white">
          <Select defaultValue="30d" onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LogBoardHeaderWithStats;
