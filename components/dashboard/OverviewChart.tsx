"use client";

import { DashboardOverview, OverviewDataPoint } from "@/types/dashboard";
import { formatMinutes } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface OverviewChartProps {
  data: DashboardOverview | null;
  loading: boolean;
  period: string;
  onPeriodChange: (period: string) => void;
}

const periodLabels: Record<string, string> = {
  week: "Semana",
  month: "Mês",
  year: "Ano",
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: OverviewDataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Foco:{" "}
        <span className="font-medium text-blue-600 dark:text-blue-400">
          {formatMinutes(data.totalFocusMinutes)}
        </span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Sessões:{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {data.sessions}
        </span>
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

export default function OverviewChart({
  data,
  loading,
  period,
  onPeriodChange,
}: OverviewChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#1f2937" : "#f3f4f6";
  const tickColor = isDark ? "#9ca3af" : "#6b7280";
  const axisColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Visão Geral
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Minutos de foco por período
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
          <div className="flex h-75 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : data && data.data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.data}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: tickColor }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: tickColor }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: gridColor }}
              />
              <Bar
                dataKey="totalFocusMinutes"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-75 items-center justify-center text-sm text-gray-400">
            Sem dados para este período
          </div>
        )}
      </div>

      {data && !loading && (
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Foco
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatMinutes(data.totalFocusMinutes)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sessões</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {data.totalSessions}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sucesso</p>
            <p className="text-sm font-semibold text-green-600">
              {data.successRate.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
