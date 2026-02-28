export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  return `${hours}:${minutes}`;
}

export function formatMinutes(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutes}min`;
}

export function translatePeriod(period: string): string {
  const map: Record<string, string> = {
    MORNING: "Manhã",
    AFTERNOON: "Tarde",
    NIGHT: "Noite",
  };
  return map[period] || period;
}

export function translateCategory(category: string): string {
  const map: Record<string, string> = {
    TECHNOLOGY: "Tecnologia",
    MATH: "Matemática",
    PORTUGUESE: "Português",
    ENGLISH: "Inglês",
    OTHER: "Outro",
  };
  return map[category] || category;
}

export function translateDayOfWeek(day: string): string {
  const map: Record<string, string> = {
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };
  return map[day] || day;
}

export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    TECHNOLOGY: "Monitor",
    MATH: "Calculator",
    PORTUGUESE: "BookOpen",
    ENGLISH: "Globe",
    OTHER: "Shapes",
  };
  return map[category] || "Shapes";
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    TECHNOLOGY: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    MATH: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
    PORTUGUESE:
      "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
    ENGLISH: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    OTHER: "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  };
  return (
    map[category] ||
    "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
  );
}
