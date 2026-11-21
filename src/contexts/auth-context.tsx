"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
  signup as signupRequest,
  type AuthSession,
  type AuthUser,
} from "@/lib/auth";

type AuthStatus = "loading" | "authenticated" | "anonymous";
type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
let pendingSessionRestore: Promise<AuthSession> | null = null;

function restoreSessionOnce() {
  if (!pendingSessionRestore) {
    pendingSessionRestore = refreshSession().finally(() => {
      pendingSessionRestore = null;
    });
  }
  return pendingSessionRestore;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<AuthSession | null>(null);

  const applySession = useCallback((next: AuthSession) => {
    setSession(next);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    let active = true;
    restoreSessionOnce()
      .then((next) => {
        if (active) applySession(next);
      })
      .catch(() => {
        if (active) setStatus("anonymous");
      });
    return () => {
      active = false;
    };
  }, [applySession]);

  useEffect(() => {
    if (!session) return;
    const refreshIn = Math.max((session.expires_in - 30) * 1000, 10_000);
    const timer = setTimeout(async () => {
      try {
        applySession(await refreshSession());
      } catch {
        setSession(null);
        setStatus("anonymous");
      }
    }, refreshIn);
    return () => clearTimeout(timer);
  }, [session, applySession]);

  const login = useCallback(async (email: string, password: string) => {
    const next = await loginRequest(email, password);
    applySession(next);
    return next.user;
  }, [applySession]);

  const signup = useCallback(async (email: string, password: string) => {
    const next = await signupRequest(email, password);
    applySession(next);
    return next.user;
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setSession(null);
      setStatus("anonymous");
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user: session?.user ?? null,
    accessToken: session?.access_token ?? null,
    login,
    signup,
    logout,
  }), [status, session, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
