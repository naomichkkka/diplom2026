import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'sharlandia_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((product) => {
    setFavorites(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productId) => {
    setFavorites(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isFavorite = useCallback((productId) => {
    return favorites.some(p => p.id === productId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};

export default useFavorites;
