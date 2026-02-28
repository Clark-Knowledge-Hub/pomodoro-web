"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import SummaryCards from "@/components/dashboard/SummaryCards";
import OverviewChart from "@/components/dashboard/OverviewChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import HeatmapChart from "@/components/dashboard/HeatmapChart";
import PeriodChart from "@/components/dashboard/PeriodChart";
import WeekdayChart from "@/components/dashboard/WeekdayChart";
import GoalsCard from "@/components/dashboard/GoalsCard";
import {
  getDashboardSummary,
  getDashboardOverview,
  getDashboardByCategory,
  getDashboardHeatmap,
  getDashboardByPeriod,
  getDashboardByWeekday,
  getDashboardGoals,
} from "@/lib/api";
import type {
  DashboardSummary,
  DashboardOverview,
  CategoryStats,
  HeatmapEntry,
  PeriodStats,
  WeekdayStats,
  GoalsData,
} from "@/types/dashboard";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [categories, setCategories] = useState<CategoryStats[] | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[] | null>(null);
  const [periods, setPeriods] = useState<PeriodStats[] | null>(null);
  const [weekdays, setWeekdays] = useState<WeekdayStats[] | null>(null);
  const [goals, setGoals] = useState<GoalsData | null>(null);

  const [summaryLoading, setSummaryLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [periodsLoading, setPeriodsLoading] = useState(true);
  const [weekdaysLoading, setWeekdaysLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(true);

  const [overviewPeriod, setOverviewPeriod] = useState("week");
  const [categoryPeriod, setCategoryPeriod] = useState("month");
  const [goalsPeriod, setGoalsPeriod] = useState("week");
  const [heatmapYear, setHeatmapYear] = useState(new Date().getFullYear());

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const fetchPeriods = useCallback(async () => {
    setPeriodsLoading(true);
    try {
      const data = await getDashboardByPeriod();
      setPeriods(data);
    } catch {
      setPeriods(null);
    } finally {
      setPeriodsLoading(false);
    }
  }, []);

  const fetchWeekdays = useCallback(async () => {
    setWeekdaysLoading(true);
    try {
      const data = await getDashboardByWeekday();
      setWeekdays(data);
    } catch {
      setWeekdays(null);
    } finally {
      setWeekdaysLoading(false);
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const data = await getDashboardOverview(overviewPeriod);
      setOverview(data);
    } catch {
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [overviewPeriod]);

  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true);
    try {
      const data = await getDashboardByCategory(categoryPeriod);
      setCategories(data);
    } catch {
      setCategories(null);
    } finally {
      setCategoryLoading(false);
    }
  }, [categoryPeriod]);

  const fetchHeatmap = useCallback(async () => {
    setHeatmapLoading(true);
    try {
      const data = await getDashboardHeatmap(heatmapYear);
      setHeatmap(data);
    } catch {
      setHeatmap(null);
    } finally {
      setHeatmapLoading(false);
    }
  }, [heatmapYear]);

  const fetchGoals = useCallback(async () => {
    setGoalsLoading(true);
    try {
      const data = await getDashboardGoals(goalsPeriod);
      setGoals(data);
    } catch {
      setGoals(null);
    } finally {
      setGoalsLoading(false);
    }
  }, [goalsPeriod]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  useEffect(() => {
    fetchWeekdays();
  }, [fetchWeekdays]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchHeatmap();
  }, [fetchHeatmap]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Visão geral da sua produtividade
          </p>
        </div>

        <div className="space-y-6">
          <SummaryCards data={summary} loading={summaryLoading} />

          <OverviewChart
            data={overview}
            loading={overviewLoading}
            period={overviewPeriod}
            onPeriodChange={setOverviewPeriod}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryChart
              data={categories}
              loading={categoryLoading}
              period={categoryPeriod}
              onPeriodChange={setCategoryPeriod}
            />
            <GoalsCard
              data={goals}
              loading={goalsLoading}
              period={goalsPeriod}
              onPeriodChange={setGoalsPeriod}
            />
          </div>

          <HeatmapChart
            data={heatmap}
            loading={heatmapLoading}
            year={heatmapYear}
            onYearChange={setHeatmapYear}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PeriodChart data={periods} loading={periodsLoading} />
            <WeekdayChart data={weekdays} loading={weekdaysLoading} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
