import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Zap, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('¡Bienvenido de vuelta!');
      } else {
        await register(email, password, name);
        toast.success('¡Cuenta creada exitosamente!');
      }
      navigate('/select');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      data-testid="auth-page"
      className={
        isDark
          ? 'min-h-screen bg-gaming-bg text-gaming-text'
          : 'min-h-screen bg-hero-bg text-hero-text'
      }
    >
      <button
        onClick={toggleTheme}
        data-testid="theme-toggle"
        className={
          isDark
            ? 'fixed top-6 right-6 p-3 rounded-full bg-gaming-surface border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all z-50 shadow-[0_0_15px_rgba(0,243,255,0.5)]'
            : 'fixed top-6 right-6 p-3 rounded-full bg-hero-surface border-2 border-black text-hero-primary hover:bg-hero-primary hover:text-white transition-all z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        }
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={
                isDark
                  ? 'text-5xl sm:text-6xl font-syne font-extrabold tracking-tight mb-4 text-gaming-text'
                  : 'text-5xl sm:text-6xl font-syne font-extrabold tracking-tight mb-4 text-hero-text'
              }
            >
              Super <span className={isDark ? 'text-cyan-400' : 'text-hero-primary'}>Gamer</span>
            </motion.h1>
            <div className="flex items-center justify-center gap-4">
              <Gamepad2 className={isDark ? 'text-cyan-400' : 'text-hero-primary'} size={32} />
              <Zap className={isDark ? 'text-gaming-accent' : 'text-hero-accent'} size={32} />
            </div>
          </div>

          <motion.div
            className={
              isDark
                ? 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8'
                : 'bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg p-8'
            }
          >
            <div className="flex mb-6 gap-2">
              <button
                onClick={() => setIsLogin(true)}
                data-testid="login-tab"
                className={
                  isLogin
                    ? isDark
                      ? 'flex-1 py-3 rounded-lg font-bold bg-cyan-400 text-black transition-all'
                      : 'flex-1 py-3 rounded-lg font-bold bg-hero-primary text-white transition-all'
                    : isDark
                    ? 'flex-1 py-3 rounded-lg font-bold bg-transparent border-2 border-gaming-textSecondary text-gaming-textSecondary hover:border-cyan-400 hover:text-cyan-400 transition-all'
                    : 'flex-1 py-3 rounded-lg font-bold bg-transparent border-2 border-hero-textSecondary text-hero-textSecondary hover:border-hero-primary hover:text-hero-primary transition-all'
                }
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                data-testid="register-tab"
                className={
                  !isLogin
                    ? isDark
                      ? 'flex-1 py-3 rounded-lg font-bold bg-cyan-400 text-black transition-all'
                      : 'flex-1 py-3 rounded-lg font-bold bg-hero-primary text-white transition-all'
                    : isDark
                    ? 'flex-1 py-3 rounded-lg font-bold bg-transparent border-2 border-gaming-textSecondary text-gaming-textSecondary hover:border-cyan-400 hover:text-cyan-400 transition-all'
                    : 'flex-1 py-3 rounded-lg font-bold bg-transparent border-2 border-hero-textSecondary text-hero-textSecondary hover:border-hero-primary hover:text-hero-primary transition-all'
                }
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label
                    className={
                      isDark
                        ? 'block text-sm font-semibold mb-2 text-gaming-text'
                        : 'block text-sm font-semibold mb-2 text-hero-text'
                    }
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    data-testid="name-input"
                    className={
                      isDark
                        ? 'w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                        : 'w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary'
                    }
                    placeholder="Tu nombre"
                  />
                </div>
              )}

              <div>
                <label
                  className={
                    isDark
                      ? 'block text-sm font-semibold mb-2 text-gaming-text'
                      : 'block text-sm font-semibold mb-2 text-hero-text'
                  }
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="email-input"
                  className={
                    isDark
                      ? 'w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                      : 'w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary'
                  }
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  className={
                    isDark
                      ? 'block text-sm font-semibold mb-2 text-gaming-text'
                      : 'block text-sm font-semibold mb-2 text-hero-text'
                  }
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="password-input"
                  className={
                    isDark
                      ? 'w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                      : 'w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary'
                  }
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                data-testid="auth-submit"
                className={
                  isDark
                    ? 'w-full px-8 py-3 rounded-full font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                    : 'w-full px-8 py-3 rounded-full font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                }
              >
                {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};