"use client";

import { PeriodStats } from "@/types/dashboard";
import { translatePeriod, formatMinutes } from "@/lib/utils";
import { Loader2, Sun, Sunset, Moon } from "lucide-react";

interface PeriodChartProps {
  data: PeriodStats[] | null;
  loading: boolean;
}

const periodIcons: Record<string, React.ReactNode> = {
  MORNING: <Sun className="h-4 w-4 text-amber-500" />,
  AFTERNOON: <Sunset className="h-4 w-4 text-orange-500" />,
  NIGHT: <Moon className="h-4 w-4 text-indigo-500" />,
};

const periodColors: Record<string, string> = {
  MORNING: "bg-amber-500",
  AFTERNOON: "bg-orange-500",
  NIGHT: "bg-indigo-500",
};

export default function PeriodChart({ data, loading }: PeriodChartProps) {
  const maxMinutes = data
    ? Math.max(...data.map((d) => d.totalFocusMinutes), 1)
    : 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Por Período do Dia
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Distribuição por manhã, tarde e noite
        </p>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex h-50 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-5">
            {data.map((entry) => (
              <div key={entry.period}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {periodIcons[entry.period]}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {translatePeriod(entry.period)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatMinutes(entry.totalFocusMinutes)}</span>
                    <span>{entry.sessions} sessões</span>
                    <span className="font-medium text-green-600">
                      {entry.successRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-2.5 rounded-full transition-all ${periodColors[entry.period]}`}
                    style={{
                      width: `${(entry.totalFocusMinutes / maxMinutes) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-50 items-center justify-center text-sm text-gray-400">
            Sem dados disponíveis
          </div>
        )}
      </div>
    </div>
  );
}
