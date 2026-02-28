"use client";

import { CategoryStats } from "@/types/dashboard";
import { translateCategory } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface CategoryChartProps {
  data: CategoryStats[] | null;
  loading: boolean;
  period: string;
  onPeriodChange: (period: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  TECHNOLOGY: "#3b82f6",
  MATH: "#8b5cf6",
  PORTUGUESE: "#10b981",
  ENGLISH: "#f59e0b",
  OTHER: "#6b7280",
};

const periodLabels: Record<string, string> = {
  week: "Semana",
  month: "Mês",
  year: "Ano",
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryStats }>;
}

function CustomTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {translateCategory(data.category)}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Foco: <span className="font-medium">{data.totalFocusMinutes}min</span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Sessões: <span className="font-medium">{data.sessions}</span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Sucesso:{" "}
        <span className="font-medium text-green-600 dark:text-green-400">
          {data.successRate.toFixed(1)}%
        </span>
      </p>
    </div>
  );
}

export default function CategoryChart({
  data,
  loading,
  period,
  onPeriodChange,
}: CategoryChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Por Categoria
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Distribuição do tempo de foco
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
          <div className="flex h-70 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="totalFocusMinutes"
                    nameKey="category"
                    stroke="none"
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[entry.category] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-3 lg:w-1/2">
              {data.map((entry) => (
                <div key={entry.category} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[entry.category] || "#6b7280",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {translateCategory(entry.category)}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {entry.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${entry.percentage}%`,
                          backgroundColor:
                            CATEGORY_COLORS[entry.category] || "#6b7280",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-70 items-center justify-center text-sm text-gray-400">
            Sem dados para este período
          </div>
        )}
      </div>
    </div>
  );
}
