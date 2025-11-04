'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { LoginPayload, SignupPayload, User } from '@/types/api';
import { fetchCurrentUser, login as loginService, logout as logoutService, signup } from '@/services/api/auth';
import { ApiError } from '@/services/api/httpClient';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
  initialUser: User | null;
}

export const AuthProvider = ({ children, initialUser }: Props) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [status, setStatus] = useState<AuthStatus>(initialUser ? 'authenticated' : 'idle');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (payload: LoginPayload) => {
    setStatus('loading');
    setError(null);

    try {
      const authenticatedUser = await loginService(payload);
      setUser(authenticatedUser);
      setStatus('authenticated');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Erro ao realizar login';
      setError(message);
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const handleSignup = useCallback(async (payload: SignupPayload) => {
    setStatus('loading');
    setError(null);

    try {
      const registeredUser = await signup(payload);
      setUser(registeredUser);
      setStatus('authenticated');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Erro ao realizar cadastro';
      setError(message);
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      setStatus('authenticated');
    } catch (err) {
      setUser(null);
      setStatus('unauthenticated');
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  }, []);

  useEffect(() => {
    if (initialUser) {
      return;
    }

    let mounted = true;

    const bootstrap = async () => {
      setStatus('loading');
      try {
        const currentUser = await fetchCurrentUser();
        if (mounted) {
          setUser(currentUser);
          setStatus('authenticated');
        }
      } catch {
        if (mounted) {
          setStatus('unauthenticated');
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [initialUser]);

  const value = useMemo(
    () => ({ user, status, error, login: handleLogin, logout: handleLogout, refreshUser, signup: handleSignup }),
    [error, handleLogin, handleLogout, handleSignup, refreshUser, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
