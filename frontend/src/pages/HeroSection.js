import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Zap, Moon, Sun } from 'lucide-react';
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

export const HeroSection = () => {
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
    document.body.classList.remove('dark');
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API}/items`, {
        params: { category: 'heroes' }
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
        category: 'heroes'
      });
      toast.success('Héroe agregado');
      setDialogOpen(false);
      setNewItem({ title: '', description: '', image_url: '', official_link: '' });
      fetchItems();
    } catch (error) {
      toast.error('Error al agregar héroe');
    }
  };

  return (
    <div className="min-h-screen bg-hero-bg text-hero-text" data-testid="hero-section">
      <div
        className="h-64 relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/7768663/pexels-photo-7768663.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-hero-bg" />
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/select')}
              data-testid="back-button"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-hero"
              className="p-3 rounded-full bg-hero-surface border-2 border-black text-hero-primary hover:bg-hero-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <Zap className="text-hero-accent" size={48} />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-syne font-extrabold tracking-tight text-hero-text">
              Superhéroes
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
                data-testid="add-hero-button"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <Plus className="w-5 h-5" />
                Agregar Héroe
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-black text-hero-text">
              <DialogHeader>
                <DialogTitle className="text-2xl font-syne text-hero-primary">Nuevo Héroe</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateItem} className="space-y-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  required
                  data-testid="item-title-input"
                  className="w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary"
                />
                <textarea
                  placeholder="Descripción"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  required
                  data-testid="item-description-input"
                  rows={3}
                  className="w-full bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 py-3 transition-all text-hero-text placeholder:text-hero-textSecondary"
                />
                <input
                  type="url"
                  placeholder="URL de Imagen"
                  value={newItem.image_url}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                  required
                  data-testid="item-image-input"
                  className="w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary"
                />
                <input
                  type="url"
                  placeholder="Enlace Oficial"
                  value={newItem.official_link}
                  onChange={(e) => setNewItem({ ...newItem, official_link: e.target.value })}
                  required
                  data-testid="item-link-input"
                  className="w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary"
                />
                <button
                  type="submit"
                  data-testid="submit-item-button"
                  className="w-full px-8 py-3 rounded-full font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
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
              className="mb-6 text-hero-primary hover:text-hero-secondary font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la lista
            </button>
            <ItemCard 
              item={selectedItem} 
              variant="hero"
              onUpdate={fetchItems}
              onDelete={() => {
                fetchItems();
                setSelectedItem(null);
              }}
            />
            <CommentSection itemId={selectedItem.id} category="heroes" variant="hero" />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
                <ItemCard 
                  item={item} 
                  variant="hero"
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