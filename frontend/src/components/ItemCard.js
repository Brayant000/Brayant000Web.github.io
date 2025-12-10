import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ItemCard = ({ item, variant = 'gaming', onUpdate, onDelete }) => {
  const isGaming = variant === 'gaming';
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    official_link: item.official_link
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/items/${item.id}`, editData);
      toast.success('Item actualizado');
      setEditOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al actualizar');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/items/${item.id}`);
      toast.success('Item eliminado');
      setDeleteOpen(false);
      if (onDelete) onDelete();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al eliminar');
    }
  };

  return (
    <motion.div
      data-testid={`item-card-${item.id}`}
      whileHover={{ y: -5 }}
      className={
        isGaming
          ? 'bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-colors rounded-xl overflow-hidden'
          : 'bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-lg overflow-hidden'
      }
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3
          className={
            isGaming
              ? 'text-xl font-bold font-syne tracking-tight text-cyan-400 mb-2'
              : 'text-xl font-bold font-syne tracking-tight text-hero-primary mb-2'
          }
        >
          {item.title}
        </h3>
        <p
          className={
            isGaming
              ? 'text-gaming-textSecondary text-sm mb-4 line-clamp-2'
              : 'text-hero-textSecondary text-sm mb-4 line-clamp-2'
          }
        >
          {item.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={item.official_link}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`item-link-${item.id}`}
            className={
              isGaming
                ? 'inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                : 'inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all'
            }
          >
            Ver Oficial
            <ExternalLink className="w-4 h-4" />
          </a>
          
          {isAdmin && (
            <>
              <button
                onClick={() => setEditOpen(true)}
                data-testid={`edit-item-${item.id}`}
                className={
                  isGaming
                    ? 'inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold bg-transparent border-2 border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black transition-all duration-300'
                    : 'inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold bg-transparent border-2 border-hero-secondary text-hero-secondary hover:bg-hero-secondary hover:text-white transition-all'
                }
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                data-testid={`delete-item-${item.id}`}
                className={
                  isGaming
                    ? 'inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300'
                    : 'inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all'
                }
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className={isGaming ? 'bg-gaming-surface border border-white/10 text-gaming-text' : 'bg-white border-2 border-black text-hero-text'}>
          <DialogHeader>
            <DialogTitle className={isGaming ? 'text-2xl font-syne text-cyan-400' : 'text-2xl font-syne text-hero-primary'}>Editar Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <input
              type="text"
              placeholder="Título"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              required
              data-testid="edit-title-input"
              className={
                isGaming
                  ? 'w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                  : 'w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary'
              }
            />
            <textarea
              placeholder="Descripción"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              required
              data-testid="edit-description-input"
              rows={3}
              className={
                isGaming
                  ? 'w-full bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 py-3 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                  : 'w-full bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 py-3 transition-all text-hero-text placeholder:text-hero-textSecondary'
              }
            />
            <input
              type="url"
              placeholder="URL de Imagen"
              value={editData.image_url}
              onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
              required
              data-testid="edit-image-input"
              className={
                isGaming
                  ? 'w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                  : 'w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary'
              }
            />
            <input
              type="url"
              placeholder="Enlace Oficial"
              value={editData.official_link}
              onChange={(e) => setEditData({ ...editData, official_link: e.target.value })}
              required
              data-testid="edit-link-input"
              className={
                isGaming
                  ? 'w-full h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                  : 'w-full h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary'
              }
            />
            <button
              type="submit"
              data-testid="submit-edit-button"
              className={
                isGaming
                  ? 'w-full px-8 py-3 rounded-full font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                  : 'w-full px-8 py-3 rounded-full font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all'
              }
            >
              Guardar Cambios
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className={isGaming ? 'bg-gaming-surface border border-white/10 text-gaming-text' : 'bg-white border-2 border-black text-hero-text'}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isGaming ? 'text-cyan-400' : 'text-hero-primary'}>¿Eliminar este item?</AlertDialogTitle>
            <AlertDialogDescription className={isGaming ? 'text-gaming-textSecondary' : 'text-hero-textSecondary'}>
              Esta acción no se puede deshacer. Se eliminará el item y todos sus comentarios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isGaming ? 'bg-gaming-surface border-white/10' : 'bg-hero-surface border-black'}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="confirm-delete-button"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};