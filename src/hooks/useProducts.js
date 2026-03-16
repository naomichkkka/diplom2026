// src/hooks/useProducts.js
// Хук для работы с данными товаров с изоляцией слоя данных

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts as apiFetchProducts } from '../services/api';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';

const USE_MOCK_ON_ERROR = true; // Использовать mock при ошибке API

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetchProducts();
      
      if (data && data.length > 0) {
        setProducts(data);
        // Извлекаем уникальные категории
        const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else if (USE_MOCK_ON_ERROR) {
        // Используем mock-данные если API вернул пустой результат
        console.log('Используем mock-данные товаров');
        setProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
      }
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить каталог. Попробуйте позже.');
      
      if (USE_MOCK_ON_ERROR) {
        console.log('Используем mock-данные после ошибки');
        setProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
        setError(null); // Сбрасываем ошибку, так как используем fallback
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback(async (id) => {
    // Сначала ищем в уже загруженных данных
    const cached = products.find(p => p.id === Number(id));
    if (cached) return cached;

    // Если не найден, пробуем загрузить
    const { fetchProductById } = await import('../services/api');
    try {
      const data = await fetchProductById(id);
      return data;
    } catch (err) {
      // Fallback: ищем в mock
      return MOCK_PRODUCTS.find(p => p.id === Number(id)) || null;
    }
  }, [products]);

  const filterByCategory = useCallback((category) => {
    if (!category) return products;
    return products.filter(p => p.category === category);
  }, [products]);

  const getPopularProducts = useCallback(() => {
    return products.filter(p => p.is_popular || p.popular || p.isPopular);
  }, [products]);

  return {
    products,
    categories,
    loading,
    error,
    reload: loadProducts,
    getProductById,
    filterByCategory,
    getPopularProducts
  };
};

export default useProducts;
