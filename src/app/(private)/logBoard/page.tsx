"use client";

import React from "react";
import LogBoardHeaderWithStats from "./_components/LogBoardHeaderWithStats";
import LearningTimeBreakdown from "./_components/LearningTimeBreakdown";
import WeeklyProgress from "./_components/WeeklyProgress";
import LearningTrend from "./_components/LearningTrend";
import {
  learningTimeData,
  weeklyData,
  monthlyTrendData,
} from "./_data/sampleData";

export default function LogBoardPage() {
  const handleDateRangeChange = (range: string) => {
    console.log("Date range changed to:", range);
  };

  return (
    <div className="h-full overflow-auto bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <LogBoardHeaderWithStats
          onDateRangeChange={handleDateRangeChange}
          totalTime={127.5}
          weeklyTime={32}
          monthlyGoalPercentage={85}
          currentStreak={14}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <LearningTimeBreakdown data={learningTimeData} />
          <WeeklyProgress data={weeklyData} />
          <div className="lg:col-span-2">
            <LearningTrend data={monthlyTrendData} />
          </div>
        </div>
      </div>
    </div>
  );
}
