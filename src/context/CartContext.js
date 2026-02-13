import React, { createContext, useContext, useEffect, useState } from 'react';
import { createOrder as apiCreateOrder } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Optionally load cart from localStorage
    try {
      const raw = localStorage.getItem('sharlandia_cart');
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sharlandia_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      const exist = prev.find(p => p.id === product.id);
      if (exist) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + (product.qty || 1) } : p);
      }
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const updateQty = (id, qty) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, qty } : p));
  };

  const clear = () => setItems([]);

  const createOrder = async (details) => {
    const payload = { items, ...details };
    const res = await apiCreateOrder(payload);
    return res;
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, createOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
