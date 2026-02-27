import {
  PaginatedResponse,
  Session,
  SessionDetail,
  SessionFilters,
} from "@/types/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  if (!API_URL || !API_KEY) {
    throw new ApiError("Configuração da API ausente.", 500);
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new ApiError("Não autorizado. Verifique sua API Key.", 401);
        case 403:
          throw new ApiError("Acesso negado.", 403);
        case 404:
          throw new ApiError("Recurso não encontrado.", 404);
        case 500:
          throw new ApiError("Erro interno do servidor.", 500);
        default:
          throw new ApiError(
            `Erro na requisição: ${response.statusText}`,
            response.status,
          );
      }
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Falha na conexão com o servidor. Tente novamente mais tarde.",
      0,
    );
  }
}

export async function getSessions(
  page: number = 0,
  size: number = 10,
  filters?: SessionFilters,
): Promise<PaginatedResponse<Session>> {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("size", size.toString());

  if (filters) {
    if (filters.category) params.set("category", filters.category);
    if (filters.success) params.set("success", filters.success);
    if (filters.period) params.set("period", filters.period);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortDir) params.set("sortDir", filters.sortDir);
  }

  return apiFetch<PaginatedResponse<Session>>(`/sessions?${params.toString()}`);
}

export async function getSessionById(id: string): Promise<SessionDetail> {
  return apiFetch<SessionDetail>(`/sessions/${id}`);
}

export { ApiError };
