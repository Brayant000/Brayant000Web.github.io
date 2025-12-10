import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Zap, LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const SelectionPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      data-testid="selection-page"
      className="min-h-screen bg-gradient-to-br from-gaming-bg via-gaming-surface to-hero-bg relative overflow-hidden"
    >
      <div className="fixed top-6 right-6 flex items-center gap-4 z-50">
        {user?.role === 'admin' && (
          <div className="px-4 py-2 rounded-full bg-yellow-500 text-black font-bold text-sm">
            ADMIN
          </div>
        )}
        <button
          onClick={toggleTheme}
          data-testid="theme-toggle-selection"
          className={
            isDark
              ? 'p-3 rounded-full bg-gaming-surface border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.5)]'
              : 'p-3 rounded-full bg-hero-surface border-2 border-black text-hero-primary hover:bg-hero-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
          }
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={logout}
          data-testid="logout-button"
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-syne font-extrabold tracking-tight mb-4 text-white">
            ¡Hola, {user?.name}!
          </h1>
          <p className="text-lg text-gray-300">
            Elige tu mundo favorito
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/games')}
            data-testid="gaming-section-button"
            className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/7773751/pexels-photo-7773751.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-cyan-900/90 transition-all duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Gamepad2 className="w-20 h-20 mb-4 text-cyan-400" />
              <h2 className="text-4xl font-syne font-bold tracking-tight">Videojuegos</h2>
              <p className="text-gaming-textSecondary mt-2">Explora el mundo gaming</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/heroes')}
            data-testid="hero-section-button"
            className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/15344060/pexels-photo-15344060.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-red-900/90 transition-all duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Zap className="w-20 h-20 mb-4 text-hero-accent" />
              <h2 className="text-4xl font-syne font-bold tracking-tight">Superhéroes</h2>
              <p className="text-hero-textSecondary mt-2">Descubre héroes legendarios</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};