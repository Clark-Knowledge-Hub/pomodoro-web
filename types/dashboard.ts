export interface DashboardSummary {
  totalSessions: number;
  successfulSessions: number;
  successRate: number;
  totalFocusMinutes: number;
  averageCompletedCycles: number;
  averageFocusMinutes: number;
  currentStreak: number;
}

export interface OverviewDataPoint {
  label: string;
  totalFocusMinutes: number;
  sessions: number;
  successRate: number;
}

export interface DashboardOverview {
  period: string;
  totalFocusMinutes: number;
  totalSessions: number;
  successRate: number;
  data: OverviewDataPoint[];
}

export interface CategoryStats {
  category: string;
  totalFocusMinutes: number;
  sessions: number;
  successRate: number;
  percentage: number;
}

export interface HeatmapEntry {
  date: string;
  totalMinutes: number;
  sessions: number;
}

export interface PeriodStats {
  period: string;
  totalFocusMinutes: number;
  sessions: number;
  successRate: number;
  averageFocusMinutes: number;
}

export interface WeekdayStats {
  dayOfWeek: string;
  totalFocusMinutes: number;
  sessions: number;
  successRate: number;
  averageFocusMinutes: number;
}

export interface GoalsData {
  period: string;
  totalFocusMinutes: number;
  totalSessions: number;
  successfulSessions: number;
  successRate: number;
  averageFocusMinutesPerDay: number;
  activeDays: number;
  totalDaysInPeriod: number;
}
