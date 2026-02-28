"use client";

import { GoalsData } from "@/types/dashboard";
import { formatMinutes } from "@/lib/utils";
import { Loader2, Target, Calendar, TrendingUp, Clock } from "lucide-react";

interface GoalsCardProps {
  data: GoalsData | null;
  loading: boolean;
  period: string;
  onPeriodChange: (period: string) => void;
}

const periodLabels: Record<string, string> = {
  week: "Semana",
  month: "Mês",
  year: "Ano",
};

export default function GoalsCard({
  data,
  loading,
  period,
  onPeriodChange,
}: GoalsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Metas & Progresso
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Seu progresso no período
          </p>
        </div>
        <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                period === p
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex h-65 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : data ? (
          <div className="space-y-5">
            {/* Active Days */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Dias Ativos
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {data.activeDays} / {data.totalDaysInPeriod}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${data.totalDaysInPeriod > 0 ? (data.activeDays / data.totalDaysInPeriod) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Success Rate */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Taxa de Sucesso
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {data.successRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all"
                  style={{ width: `${data.successRate}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Foco Total
                  </span>
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatMinutes(data.totalFocusMinutes)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Média/Dia
                  </span>
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {data.averageFocusMinutesPerDay.toFixed(0)}min
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{data.totalSessions} sessões totais</span>
              <span>{data.successfulSessions} com sucesso</span>
            </div>
          </div>
        ) : (
          <div className="flex h-65 items-center justify-center text-sm text-gray-400">
            Sem dados disponíveis
          </div>
        )}
      </div>
    </div>
  );
}
