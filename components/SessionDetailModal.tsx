"use client";

import { SessionDetail } from "@/types/session";
import { getSessionById, ApiError } from "@/lib/api";
import {
  formatDate,
  formatTime,
  formatMinutes,
  translatePeriod,
  translateCategory,
  translateDayOfWeek,
} from "@/lib/utils";
import {
  X,
  Calendar,
  Clock,
  Sun,
  Target,
  CheckCircle2,
  XCircle,
  Timer,
  Coffee,
  Tag,
  CalendarDays,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SessionDetailModalProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionDetailModal({
  sessionId,
  isOpen,
  onClose,
}: SessionDetailModalProps) {
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !isOpen) return;

    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSessionById(sessionId);
        setSession(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Erro ao carregar detalhes da sessão.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Detalhes da Sessão
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-3 text-sm text-gray-500">Carregando...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <p className="mt-3 text-sm text-red-600">{error}</p>
          </div>
        )}

        {session && !loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                {session.success ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {session.success ? "Concluída" : "Não concluída"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.completedCycles}/{session.targetCycles} ciclos
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  session.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {session.success ? "Sucesso" : "Incompleta"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DetailItem
                icon={<Calendar className="h-4 w-4" />}
                label="Data"
                value={formatDate(session.date)}
              />
              <DetailItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="Dia"
                value={translateDayOfWeek(session.dayOfWeek)}
              />
              <DetailItem
                icon={<Clock className="h-4 w-4" />}
                label="Início"
                value={formatTime(session.startTime)}
              />
              <DetailItem
                icon={<Sun className="h-4 w-4" />}
                label="Período"
                value={translatePeriod(session.period)}
              />
              <DetailItem
                icon={<Tag className="h-4 w-4" />}
                label="Categoria"
                value={translateCategory(session.category)}
              />
              <DetailItem
                icon={<Target className="h-4 w-4" />}
                label="Ciclos"
                value={`${session.completedCycles} / ${session.targetCycles}`}
              />
              <DetailItem
                icon={<Timer className="h-4 w-4" />}
                label="Tempo foco"
                value={formatMinutes(session.totalFocusMinutes)}
              />
              <DetailItem
                icon={<Coffee className="h-4 w-4" />}
                label="Tempo pausa"
                value={formatMinutes(session.totalBreakMinutes)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
