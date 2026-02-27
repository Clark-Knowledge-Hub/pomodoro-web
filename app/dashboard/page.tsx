"use client";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral da sua produtividade
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <LayoutDashboard className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            Em breve
          </h3>
          <p className="mt-1 max-w-xs text-center text-sm text-gray-500">
            O dashboard com métricas e gráficos de produtividade será
            implementado em breve.
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
