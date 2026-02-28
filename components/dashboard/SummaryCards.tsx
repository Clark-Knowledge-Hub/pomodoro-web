"use client";

import { DashboardSummary } from "@/types/dashboard";
import { formatMinutes } from "@/lib/utils";
import { Activity, TrendingUp, Clock, Flame } from "lucide-react";

interface SummaryCardsProps {
  data: DashboardSummary | null;
  loading: boolean;
}

export default function SummaryCards({ data, loading }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total de Sessões",
      value: data?.totalSessions ?? 0,
      icon: Activity,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      label: "Taxa de Sucesso",
      value: data ? `${data.successRate.toFixed(1)}%` : "0%",
      icon: TrendingUp,
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      label: "Tempo Total de Foco",
      value: data ? formatMinutes(data.totalFocusMinutes) : "0min",
      icon: Clock,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
    {
      label: "Streak Atual",
      value: data ? `${data.currentStreak} dias` : "0 dias",
      icon: Flame,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="mt-3 h-7 w-20 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="mt-1.5 h-4 w-28 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
