import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CommentSection = ({ itemId, category, variant = 'gaming' }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isGaming = variant === 'gaming';

  useEffect(() => {
    fetchComments();
  }, [itemId, category]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API}/comments`, {
        params: { item_id: itemId, category }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/comments`, {
        item_id: itemId,
        category,
        text: newComment
      });
      setComments([response.data, ...comments]);
      setNewComment('');
      toast.success('Comentario publicado');
    } catch (error) {
      console.error('Error al publicar comentario:', error);
      toast.error('Error al publicar comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8" data-testid="comment-section">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle
          className={isGaming ? 'text-cyan-400' : 'text-hero-primary'}
          size={24}
        />
        <h3
          className={
            isGaming
              ? 'text-2xl font-bold font-syne text-gaming-text'
              : 'text-2xl font-bold font-syne text-hero-text'
          }
        >
          Comentarios
        </h3>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6" data-testid="comment-form">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              data-testid="comment-input"
              className={
                isGaming
                  ? 'flex-1 h-12 bg-gaming-surface/20 border-2 border-transparent focus:border-cyan-400 outline-none rounded-lg px-4 transition-all text-gaming-text placeholder:text-gaming-textSecondary'
                  : 'flex-1 h-12 bg-hero-surface border-2 border-black focus:border-hero-secondary outline-none rounded-lg px-4 transition-all text-hero-text placeholder:text-hero-textSecondary'
              }
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              data-testid="comment-submit"
              className={
                isGaming
                  ? 'px-6 py-3 rounded-lg font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                  : 'px-6 py-3 rounded-lg font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              }
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p
            className={
              isGaming
                ? 'text-gaming-textSecondary text-center py-8'
                : 'text-hero-textSecondary text-center py-8'
            }
          >
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid={`comment-${comment.id}`}
              className={
                isGaming
                  ? 'bg-gaming-surface/30 backdrop-blur-sm border border-white/10 rounded-lg p-4'
                  : 'bg-hero-surface border-2 border-black rounded-lg p-4'
              }
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={
                    isGaming
                      ? 'font-bold text-gaming-text'
                      : 'font-bold text-hero-text'
                  }
                >
                  {comment.user_name}
                </span>
                <span
                  className={
                    isGaming
                      ? 'text-xs text-gaming-textSecondary'
                      : 'text-xs text-hero-textSecondary'
                  }
                >
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p
                className={
                  isGaming
                    ? 'text-gaming-textSecondary'
                    : 'text-hero-textSecondary'
                }
              >
                {comment.text}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};