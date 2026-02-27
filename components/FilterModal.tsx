"use client";

import { SessionFilters } from "@/types/session";
import { X, Filter } from "lucide-react";
import { useState } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SessionFilters) => void;
  currentFilters: SessionFilters;
}

const categories = [
  { value: "", label: "Todas" },
  { value: "TECHNOLOGY", label: "Tecnologia" },
  { value: "MATH", label: "Matemática" },
  { value: "PORTUGUESE", label: "Português" },
  { value: "ENGLISH", label: "Inglês" },
  { value: "OTHER", label: "Outro" },
];

const periods = [
  { value: "", label: "Todos" },
  { value: "MORNING", label: "Manhã" },
  { value: "AFTERNOON", label: "Tarde" },
  { value: "NIGHT", label: "Noite" },
];

const successOptions = [
  { value: "", label: "Todos" },
  { value: "true", label: "Concluído" },
  { value: "false", label: "Não concluído" },
];

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<SessionFilters>(currentFilters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const cleared: SessionFilters = {};
    setFilters(cleared);
    onApply(cleared);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value || undefined,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Período
            </label>
            <select
              value={filters.period || ""}
              onChange={(e) =>
                setFilters({ ...filters, period: e.target.value || undefined })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {periods.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.success || ""}
              onChange={(e) =>
                setFilters({ ...filters, success: e.target.value || undefined })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {successOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Data início
              </label>
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    startDate: e.target.value || undefined,
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Data fim
              </label>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    endDate: e.target.value || undefined,
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || "date"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value || undefined,
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="date">Data</option>
                <option value="totalFocusMinutes">Tempo de foco</option>
                <option value="completedCycles">Ciclos completos</option>
                <option value="category">Categoria</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Direção
              </label>
              <select
                value={filters.sortDir || "desc"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortDir: e.target.value || undefined,
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="desc">Mais recente primeiro</option>
                <option value="asc">Mais antigo primeiro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Limpar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
