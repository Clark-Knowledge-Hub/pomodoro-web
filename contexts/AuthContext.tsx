"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  ReactNode,
} from "react";
import {
  isAuthenticated,
  login as authLogin,
  logout as authLogout,
} from "@/lib/auth";

interface AuthContextType {
  authenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return isAuthenticated();
}

function getServerSnapshot() {
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authenticated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const login = useCallback((password: string) => {
    const success = authLogin(password);
    if (success) emitChange();
    return success;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    emitChange();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
