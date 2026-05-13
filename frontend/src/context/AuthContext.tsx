import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { api } from "../lib/api";
import type { AuthPayload, User } from "../types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): User | null {
  const raw = localStorage.getItem("sqa-user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("sqa-token")
  );
  const [user, setUser] = useState<User | null>(() => loadStoredUser());

  async function login(email: string, password: string) {
    const data = await api<AuthPayload>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password })
      },
      null
    );

    localStorage.setItem("sqa-token", data.token);
    localStorage.setItem("sqa-user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const data = await api<AuthPayload>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      },
      null
    );

    localStorage.setItem("sqa-token", data.token);
    localStorage.setItem("sqa-user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("sqa-token");
    localStorage.removeItem("sqa-user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
