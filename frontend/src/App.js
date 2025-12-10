import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthPage } from './pages/AuthPage';
import { SelectionPage } from './pages/SelectionPage';
import { GamingSection } from './pages/GamingSection';
import { HeroSection } from './pages/HeroSection';
import { Toaster } from 'sonner';
import '@/App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-bg">
        <div className="text-2xl font-syne text-cyan-400">Cargando...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/select"
        element={
          <ProtectedRoute>
            <SelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/games"
        element={
          <ProtectedRoute>
            <GamingSection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/heroes"
        element={
          <ProtectedRoute>
            <HeroSection />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;