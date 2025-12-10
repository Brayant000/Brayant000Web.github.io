import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Gamepad2, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ItemCard } from '../components/ItemCard';
import { CommentSection } from '../components/CommentSection';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const GamingSection = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    image_url: '',
    official_link: ''
  });
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchItems();
    document.body.classList.add('dark');
    return () => document.body.classList.remove('dark');
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API}/items`, {
        params: { category: 'games' }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error al cargar items:', error);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/items`, {
        ...newItem,
        category: 'games'
      });
      toast.success('Juego agregado');
      setDialogOpen(false);
      setNewItem({ title: '', description: '', image_url: '', official_link: '' });
      fetchItems();
    } catch (error) {
      toast.error('Error al agregar juego');
    }
  };

  return (
    <div className="min-h-screen bg-gaming-bg text-gaming-text" data-testid="gaming-section">
      <div
        className="h-64 relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/4389796/pexels-photo-4389796.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gaming-bg" />
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/select')}
              data-testid="back-button"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.5)]"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-gaming"
              className="p-3 rounded-full bg-gaming-surface border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.5)]"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <Gamepad2 className="text-cyan-400" size={48} />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-syne font-extrabold tracking-tight text-gaming-text">
              Videojuegos
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {isAdmin && (
          <div className="flex justify-end mb-8">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button
                data-testid="add-game-button"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.5)]"
              >
                <Plus className="w-5 h-5" />
                Agregar Juego
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gaming-surface border border-white/10 text-gaming-text">
              <DialogHeader>
                <DialogTitle className="text-2xl font-syne text-cyan-400">Nuevo Juego</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateItem} className="space-y-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  required
                  data-testid="item-title-input"
                  className="w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary"
                />
                <textarea
                  placeholder="Descripción"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  required
                  data-testid="item-description-input"
                  rows={3}
                  className="w-full bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 py-3 transition-all text-gaming-text placeholder:text-gaming-textSecondary"
                />
                <input
                  type="url"
                  placeholder="URL de Imagen"
                  value={newItem.image_url}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                  required
                  data-testid="item-image-input"
                  className="w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary"
                />
                <input
                  type="url"
                  placeholder="Enlace Oficial"
                  value={newItem.official_link}
                  onChange={(e) => setNewItem({ ...newItem, official_link: e.target.value })}
                  required
                  data-testid="item-link-input"
                  className="w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary"
                />
                <button
                  type="submit"
                  data-testid="submit-item-button"
                  className="w-full px-8 py-3 rounded-full font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                >
                  Crear
                </button>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        )}

        {selectedItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setSelectedItem(null)}
              data-testid="back-to-list"
              className="mb-6 text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la lista
            </button>
            <ItemCard 
              item={selectedItem} 
              variant="gaming"
              onUpdate={fetchItems}
              onDelete={() => {
                fetchItems();
                setSelectedItem(null);
              }}
            />
            <CommentSection itemId={selectedItem.id} category="games" variant="gaming" />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
                <ItemCard 
                  item={item} 
                  variant="gaming"
                  onUpdate={fetchItems}
                  onDelete={fetchItems}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};