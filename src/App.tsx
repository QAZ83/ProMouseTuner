import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { ThemeProvider } from "./components/theme-provider";
import { MouseSettingsProvider } from "./context/MouseSettingsContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";

// Lazy load components for better performance
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user, isLoading } = useAuth();

  // Add Tempo routes if in Tempo environment
  const tempoRoutes = import.meta.env.VITE_TEMPO ? useRoutes(routes) : null;

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <>
      {tempoRoutes}
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginForm onSuccess={() => {}} />
              )
            }
          />
          <Route
            path="register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterForm onSuccess={() => {}} />
              )
            }
          />
          <Route
            path="forgot-password"
            element={
              user ? <Navigate to="/" replace /> : <ForgotPasswordForm />
            }
          />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MouseSettingsProvider>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </MouseSettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
