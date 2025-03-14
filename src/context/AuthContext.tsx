import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth, User, AuthState } from "@/lib/auth";

interface AuthContextType extends AuthState {
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const user = await auth.getCurrentUser();
        setAuthState({
          user,
          session: user ? { user } : null,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          error: "Failed to get current user",
        });
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });

    const { user, error } = await auth.signIn(email, password);

    setAuthState({
      user,
      session: user ? { user } : null,
      isLoading: false,
      error,
    });

    return { error };
  };

  const signUp = async (email: string, password: string, username: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });

    const { user, error } = await auth.signUp(email, password, username);

    setAuthState({
      user,
      session: user ? { user } : null,
      isLoading: false,
      error,
    });

    return { error };
  };

  const signOut = async () => {
    setAuthState({ ...authState, isLoading: true, error: null });

    const { error } = await auth.signOut();

    setAuthState({
      user: null,
      session: null,
      isLoading: false,
      error,
    });

    return { error };
  };

  const resetPassword = async (email: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });

    const { error } = await auth.resetPassword(email);

    setAuthState({
      ...authState,
      isLoading: false,
      error,
    });

    return { error };
  };

  const value = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
