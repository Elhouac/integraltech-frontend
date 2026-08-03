import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { apiClient, ApiError } from "../api/client";

// ── Types ──

export type UserRole = "super_admin" | "admin" | "editor" | "support" | "viewer" | "reader";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (minimumRole: UserRole) => boolean;
}

// ── Role hierarchy (higher number = more permissions) ──
const ROLE_LEVELS: Record<UserRole, number> = {
  viewer: 1,
  reader: 1,
  support: 2,
  editor: 2,
  admin: 3,
  super_admin: 4,
};

function getLoginError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return "Identifiants invalides";
      case 403:
        return "Accès refusé";
      case 419:
        return "Session expirée, veuillez réessayer";
      case 422:
        return "Données de formulaire invalides";
      case 500:
        return "Erreur serveur";
      default:
        return error.message || "Erreur de communication avec le serveur";
    }
  }

  if (error instanceof TypeError && /fetch/i.test(error.message)) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return "Backend inaccessible (hors-ligne)";
    }
    return "Backend inaccessible";
  }

  return "Erreur de connexion";
}

// ── Context ──

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on mount via SPA cookie ──
  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      try {
        const response = await apiClient.get<{ user: AdminUser }>("/auth/me");
        if (isMounted && response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error: unknown) {
        // A guest has no session yet. This expected 401 must not be surfaced
        // as a login or connectivity error.
        if (error instanceof ApiError && error.status === 401) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMe();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Login ──
  const login = useCallback(async (email: string, password: string, remember = false): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.getCsrfCookie();
      await apiClient.post("/auth/login", { email, password, remember }, { csrf: false });
      const response = await apiClient.get<{ user: AdminUser }>("/auth/me");

      if (response.data?.user) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: "Accès refusé" };
    } catch (error: unknown) {
      return { success: false, error: getLoginError(error) };
    }
  }, []);

  // ── Logout ──
  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
    }
  }, []);

  // ── Role check ──
  const hasRole = useCallback((minimumRole: UserRole): boolean => {
    if (!user) return false;
    return (ROLE_LEVELS[user.role] || 0) >= (ROLE_LEVELS[minimumRole] || 0);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
