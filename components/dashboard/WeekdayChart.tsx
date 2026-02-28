"use client";

import { WeekdayStats } from "@/types/dashboard";
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

interface WeekdayChartProps {
  data: WeekdayStats[] | null;
  loading: boolean;
}

const SHORT_DAY_NAMES: Record<string, string> = {
  MONDAY: "Seg",
  TUESDAY: "Ter",
  WEDNESDAY: "Qua",
  THURSDAY: "Qui",
  FRIDAY: "Sex",
  SATURDAY: "Sáb",
  SUNDAY: "Dom",
};

const FULL_DAY_NAMES: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

interface ChartDataEntry extends WeekdayStats {
  shortName: string;
  fullName: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataEntry }>;
}

function CustomTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {data.fullName}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Foco:{" "}
        <span className="font-medium text-purple-600 dark:text-purple-400">
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

export default function WeekdayChart({ data, loading }: WeekdayChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#1f2937" : "#f3f4f6";
  const tickColor = isDark ? "#9ca3af" : "#6b7280";
  const axisColor = isDark ? "#374151" : "#e5e7eb";

  const chartData = data?.map((entry) => ({
    ...entry,
    shortName: SHORT_DAY_NAMES[entry.dayOfWeek] || entry.dayOfWeek,
    fullName: FULL_DAY_NAMES[entry.dayOfWeek] || entry.dayOfWeek,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Por Dia da Semana
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Minutos de foco por dia da semana
        </p>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex h-62.5 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="shortName"
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
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-62.5 items-center justify-center text-sm text-gray-400">
            Sem dados disponíveis
          </div>
        )}
      </div>
    </div>
  );
}
