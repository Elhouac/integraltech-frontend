const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
const SANCTUM_URL = API_BASE_URL.replace(/\/api\/v1$/, "") + "/sanctum/csrf-cookie";

function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )XSRF-TOKEN=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  const xsrfToken = getCsrfTokenFromCookie();
  if (xsrfToken) {
    headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  let data: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `HTTP error! Status: ${response.status}`;
    throw new ApiError(message, response.status, data?.errors);
  }

  return data;
}

export const apiClient = {
  getCsrfCookie: async (): Promise<void> => {
    try {
      await fetch(SANCTUM_URL, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch {
      // Ignore network errors on csrf fetch attempt if server is unreachable
    }
  },

  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    return request<T>(url, { method: "GET" });
  },

  post: async <T>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes("POST")) {
      await apiClient.getCsrfCookie();
    }
    return request<T>(endpoint, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch: async <T>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    await apiClient.getCsrfCookie();
    return request<T>(endpoint, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    await apiClient.getCsrfCookie();
    return request<T>(endpoint, { method: "DELETE" });
  },
};
