"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { HeatmapEntry } from "@/types/dashboard";
import { formatMinutes } from "@/lib/utils";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";

interface HeatmapChartProps {
  data: HeatmapEntry[] | null;
  loading: boolean;
  year: number;
  onYearChange: (year: number) => void;
}

const DAY_LABELS = ["", "Seg", "", "Qua", "", "Sex", ""];

const LABEL_WIDTH = 32;
const TOP_PADDING = 18;
const MIN_CELL = 10;
const MAX_CELL = 18;

const LEVELS = [
  { min: 0, light: "#ebedf0", dark: "#161b22" },
  { min: 1, light: "#9be9a8", dark: "#0e4429" },
  { min: 21, light: "#40c463", dark: "#006d32" },
  { min: 51, light: "#30a14e", dark: "#26a641" },
  { min: 101, light: "#216e39", dark: "#39d353" },
];

function getLevel(minutes: number): number {
  if (minutes === 0) return 0;
  if (minutes <= 20) return 1;
  if (minutes <= 50) return 2;
  if (minutes <= 100) return 3;
  return 4;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function HeatmapChart({
  data,
  loading,
  year,
  onYearChange,
}: HeatmapChartProps) {
  const [tooltip, setTooltip] = useState<{
    entry: HeatmapEntry;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { grid, monthLabels, stats } = useMemo(() => {
    if (!data || data.length === 0)
      return { grid: [], monthLabels: [], stats: null };

    const dataMap = new Map<string, HeatmapEntry>();
    data.forEach((entry) => dataMap.set(entry.date, entry));

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const startDow = (startDate.getDay() + 6) % 7;

    const weeks: (HeatmapEntry | null)[][] = [];
    const monthLabels: { label: string; week: number }[] = [];
    let lastMonth = -1;

    let totalMinutes = 0;
    let totalSessions = 0;
    let activeDays = 0;
    let maxMinutes = 0;
    let longestStreak = 0;
    let currentStreak = 0;

    const current = new Date(startDate);
    while (current <= endDate) {
      const dayOfYear = Math.floor(
        (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const offset = dayOfYear + startDow;
      const week = Math.floor(offset / 7);
      const day = offset % 7;

      if (!weeks[week]) weeks[week] = new Array(7).fill(null);

      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, "0");
      const d = String(current.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      const entry = dataMap.get(dateStr) || {
        date: dateStr,
        totalMinutes: 0,
        sessions: 0,
      };
      weeks[week][day] = entry;

      totalMinutes += entry.totalMinutes;
      totalSessions += entry.sessions;
      if (entry.totalMinutes > 0) {
        activeDays++;
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
      maxMinutes = Math.max(maxMinutes, entry.totalMinutes);

      const month = current.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: current.toLocaleDateString("pt-BR", { month: "short" }),
          week,
        });
        lastMonth = month;
      }

      current.setDate(current.getDate() + 1);
    }

    return {
      grid: weeks,
      monthLabels,
      stats: {
        totalMinutes,
        totalSessions,
        activeDays,
        maxMinutes,
        longestStreak,
      },
    };
  }, [data, year]);

  const currentYear = new Date().getFullYear();

  const handleMouseEnter = useCallback(
    (entry: HeatmapEntry, cellX: number, cellY: number) => {
      setTooltip({ entry, x: cellX, y: cellY });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  const numWeeks = grid.length || 53;
  const cellStep =
    containerWidth > 0
      ? Math.max((containerWidth - LABEL_WIDTH) / numWeeks, MIN_CELL)
      : MIN_CELL + 3;
  const cellSize = Math.min(Math.floor(cellStep * 0.82), MAX_CELL);
  const cellGap = Math.max(cellStep - cellSize, 1.5);
  const cellRadius = Math.max(Math.round(cellSize * 0.2), 2);
  const svgWidth = LABEL_WIDTH + numWeeks * (cellSize + cellGap);
  const svgHeight = TOP_PADDING + 7 * (cellSize + cellGap);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Atividade
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Mapa de contribuições do ano
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onYearChange(year - 1)}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-14 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
            {year}
          </span>
          <button
            onClick={() => onYearChange(year + 1)}
            disabled={year >= currentYear}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : grid.length > 0 ? (
          <>
            <div ref={containerRef} className="heatmap-container relative pb-1">
              {containerWidth > 0 && (
                <svg
                  width="100%"
                  height={svgHeight}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="xMinYMid meet"
                  className="block"
                >
                  {/* Month labels */}
                  {monthLabels.map((m, i) => (
                    <text
                      key={i}
                      x={LABEL_WIDTH + m.week * (cellSize + cellGap)}
                      y={12}
                      className="fill-gray-400 dark:fill-gray-500"
                      fontSize={11}
                      fontFamily="inherit"
                    >
                      {m.label}
                    </text>
                  ))}

                  {/* Day labels */}
                  {DAY_LABELS.map((label, i) =>
                    label ? (
                      <text
                        key={i}
                        x={0}
                        y={
                          TOP_PADDING + i * (cellSize + cellGap) + cellSize - 2
                        }
                        className="fill-gray-400 dark:fill-gray-500"
                        fontSize={11}
                        fontFamily="inherit"
                      >
                        {label}
                      </text>
                    ) : null,
                  )}

                  {/* Cells */}
                  {grid.map((week, weekIdx) =>
                    week.map((entry, dayIdx) => {
                      if (!entry) return null;
                      const level = getLevel(entry.totalMinutes);
                      const color = isDark
                        ? LEVELS[level].dark
                        : LEVELS[level].light;
                      const x = LABEL_WIDTH + weekIdx * (cellSize + cellGap);
                      const y = TOP_PADDING + dayIdx * (cellSize + cellGap);

                      return (
                        <rect
                          key={`${weekIdx}-${dayIdx}`}
                          x={x}
                          y={y}
                          width={cellSize}
                          height={cellSize}
                          rx={cellRadius}
                          ry={cellRadius}
                          fill={color}
                          stroke={isDark ? "#30363d" : "#d0d7de"}
                          strokeWidth={0.5}
                          style={{
                            cursor:
                              entry.totalMinutes > 0 ? "pointer" : "default",
                            outline: "none",
                          }}
                          onMouseEnter={() =>
                            handleMouseEnter(entry, x + cellSize / 2, y)
                          }
                          onMouseLeave={handleMouseLeave}
                        />
                      );
                    }),
                  )}
                </svg>
              )}

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="pointer-events-none absolute z-20"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y - 8,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-xl dark:border-gray-600 dark:bg-gray-800">
                    <p className="whitespace-nowrap text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {tooltip.entry.totalMinutes > 0
                        ? `${formatMinutes(tooltip.entry.totalMinutes)} de foco`
                        : "Sem atividade"}
                    </p>
                    <p className="mt-0.5 whitespace-nowrap text-[11px] text-gray-500 dark:text-gray-400">
                      {formatDate(tooltip.entry.date)}
                      {tooltip.entry.sessions > 0 &&
                        ` · ${tooltip.entry.sessions} sessão(ões)`}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="h-2 w-2 -translate-y-px rotate-45 border-b border-r border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800" />
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
              <span>Menos</span>
              {LEVELS.map((level, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-xs"
                  style={{
                    backgroundColor: isDark ? level.dark : level.light,
                    border: `0.5px solid ${isDark ? "#30363d" : "#d0d7de"}`,
                  }}
                />
              ))}
              <span>Mais</span>
            </div>

            {/* Stats summary */}
            {stats && (
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:grid-cols-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Dias ativos
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {stats.activeDays}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Foco total
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatMinutes(stats.totalMinutes)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                    <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Maior streak
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {stats.longestStreak} dias
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
                    <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Recorde
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatMinutes(stats.maxMinutes)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-gray-400">
            Sem dados para este ano
          </div>
        )}
      </div>
    </div>
  );
}
