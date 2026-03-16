// src/hooks/useOrders.js
// Хук для работы с заказами

import { useState, useCallback } from 'react';
import { createOrder as apiCreateOrder, fetchOrders as apiFetchOrders } from '../services/api';
import { MOCK_ORDERS } from '../data/mockData';

const USE_MOCK_ON_ERROR = true;

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // Создание нового заказа
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCreateOrder(orderData);
      
      if (response && response.ok) {
        const newOrder = response.order;
        setLastOrder(newOrder);
        // Добавляем новый заказ в историю
        setOrders(prev => [newOrder, ...prev]);
        return { success: true, order: newOrder };
      } else {
        const errorMsg = response?.error || 'Не удалось создать заказ';
        setError(errorMsg);
        
        // Fallback: создаём mock-заказ
        if (USE_MOCK_ON_ERROR) {
          const mockOrder = {
            id: Math.floor(1000 + Math.random() * 9000),
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            items: orderData.items || [],
            total: orderData.items?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0
          };
          setLastOrder(mockOrder);
          setOrders(prev => [mockOrder, ...prev]);
          return { success: true, order: mockOrder, isMock: true };
        }
        
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Ошибка создания заказа:', err);
      setError('Ошибка соединения. Заказ сохранён локально.');
      
      // Fallback
      if (USE_MOCK_ON_ERROR) {
        const mockOrder = {
          id: Math.floor(1000 + Math.random() * 9000),
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          items: orderData.items || [],
          total: orderData.items?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0
        };
        setLastOrder(mockOrder);
        setOrders(prev => [mockOrder, ...prev]);
        return { success: true, order: mockOrder, isMock: true };
      }
      
      return { success: false, error: 'network' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка истории заказов
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetchOrders?.();
      
      if (response && Array.isArray(response)) {
        setOrders(response);
      } else if (USE_MOCK_ON_ERROR) {
        setOrders(MOCK_ORDERS);
      }
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Не удалось загрузить историю заказов');
      
      if (USE_MOCK_ON_ERROR) {
        setOrders(MOCK_ORDERS);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Получить заказ по ID
  const getOrderById = useCallback((id) => {
    return orders.find(o => o.id === Number(id)) || null;
  }, [orders]);

  // Очистка последнего заказа
  const clearLastOrder = useCallback(() => {
    setLastOrder(null);
  }, []);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    orders,
    lastOrder,
    loading,
    error,
    createOrder,
    fetchOrders,
    getOrderById,
    clearLastOrder,
    clearError
  };
};

export default useOrders;
