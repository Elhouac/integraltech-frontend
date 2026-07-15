import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

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
  logout: () => void;
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

// ── Mock credentials (replaced by API in Phase 2) ──
const MOCK_USERS: { email: string; password: string; user: AdminUser }[] = [
  {
    email: "admin@integraltech.ma",
    password: "admin123",
    user: { id: 1, name: "Super Admin", email: "admin@integraltech.ma", role: "super_admin" },
  },
  {
    email: "editor@integraltech.ma",
    password: "editor123",
    user: { id: 2, name: "Éditeur", email: "editor@integraltech.ma", role: "editor" },
  },
  {
    email: "support@integraltech.ma",
    password: "support123",
    user: { id: 3, name: "Support Agent", email: "support@integraltech.ma", role: "support" },
  },
  {
    email: "viewer@integraltech.ma",
    password: "viewer123",
    user: { id: 4, name: "Simple Observateur", email: "viewer@integraltech.ma", role: "viewer" },
  },
];

const AUTH_STORAGE_KEY = "integraltech_admin_auth";

// ── Context ──

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminUser;
        if (parsed && parsed.id && parsed.email && parsed.role) {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Login ──
  const login = useCallback(async (email: string, password: string, remember = false): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const match = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!match) {
      return { success: false, error: "Email ou mot de passe incorrect." };
    }

    setUser(match.user);

    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(match.user));
    } else {
      // Session-only: store in sessionStorage instead
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(match.user));
    }

    return { success: true };
  }, []);

  // ── Logout ──
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  // ── Role check ──
  const hasRole = useCallback((minimumRole: UserRole): boolean => {
    if (!user) return false;
    return ROLE_LEVELS[user.role] >= ROLE_LEVELS[minimumRole];
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
