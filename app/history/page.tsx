"use client";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import FilterModal from "@/components/FilterModal";
import SessionDetailModal from "@/components/SessionDetailModal";
import { getSessions, ApiError } from "@/lib/api";
import {
  formatDate,
  formatMinutes,
  translatePeriod,
  translateCategory,
  getCategoryColor,
} from "@/lib/utils";
import { Session, SessionFilters } from "@/types/session";
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Inbox,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Monitor,
  Calculator,
  BookOpen,
  Globe,
  Shapes,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

const categoryIconMap: Record<string, React.ReactNode> = {
  TECHNOLOGY: <Monitor className="h-3.5 w-3.5" />,
  MATH: <Calculator className="h-3.5 w-3.5" />,
  PORTUGUESE: <BookOpen className="h-3.5 w-3.5" />,
  ENGLISH: <Globe className="h-3.5 w-3.5" />,
  OTHER: <Shapes className="h-3.5 w-3.5" />,
};

type SortField = "date" | "totalFocusMinutes" | "completedCycles" | "category";
type SortDir = "asc" | "desc";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SessionFilters>({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions(page, pageSize, {
        ...filters,
        sortBy,
        sortDir,
      });
      setSessions(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar sessões.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, sortBy, sortDir]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleApplyFilters = (newFilters: SessionFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field)
      return (
        <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
      );
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  const filteredSessions = sessions.filter((session) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      translateCategory(session.category).toLowerCase().includes(query) ||
      translatePeriod(session.period).toLowerCase().includes(query) ||
      session.date.includes(query) ||
      (session.success ? "concluído" : "não concluído").includes(query)
    );
  });

  const handleOpenDetail = (id: string) => {
    setSelectedSessionId(id);
    setDetailModalOpen(true);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalElements);

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Histórico de Sessões
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Revise suas sessões de foco e métricas de produtividade.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por categoria, período ou status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="relative inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Carregando sessões...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                Erro ao carregar
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {error}
              </p>
              <button
                onClick={fetchSessions}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800">
                <Inbox className="h-7 w-7 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                Nenhuma sessão encontrada
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Tente alterar os termos da busca."
                  : "As sessões aparecerão aqui quando forem registradas."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/50">
                      {/* Sortable: Data */}
                      <th
                        className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => handleSort("date")}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          Data
                          <SortIcon field="date" />
                        </span>
                      </th>
                      {/* Not sortable: Período */}
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Período
                      </th>
                      {/* Sortable: Foco Total */}
                      <th
                        className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => handleSort("totalFocusMinutes")}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          Foco Total
                          <SortIcon field="totalFocusMinutes" />
                        </span>
                      </th>
                      {/* Sortable: Ciclos */}
                      <th
                        className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => handleSort("completedCycles")}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          Ciclos
                          <SortIcon field="completedCycles" />
                        </span>
                      </th>
                      {/* Not sortable: Status */}
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      {/* Sortable: Categoria */}
                      <th
                        className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => handleSort("category")}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          Categoria
                          <SortIcon field="category" />
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {filteredSessions.map((session) => (
                      <tr
                        key={session.id}
                        onClick={() => handleOpenDetail(session.id)}
                        className="cursor-pointer transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                      >
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(session.date)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {translatePeriod(session.period)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatMinutes(session.totalFocusMinutes)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {session.completedCycles} / {session.targetCycles}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          {session.success ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                              <CheckCircle2 className="h-3 w-3" />
                              Concluído
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
                              <XCircle className="h-3 w-3" />
                              Incompleto
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryColor(session.category)}`}
                          >
                            {categoryIconMap[session.category] || (
                              <Shapes className="h-3.5 w-3.5" />
                            )}
                            {translateCategory(session.category)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrando{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {startItem}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {endItem}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {totalElements}
                  </span>{" "}
                  resultados
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />

      <SessionDetailModal
        sessionId={selectedSessionId}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedSessionId(null);
        }}
      />
    </ProtectedRoute>
  );
}
