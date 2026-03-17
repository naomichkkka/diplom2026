// src/hooks/useAuth.js
// Хук для работы с аутентификацией пользователей

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { MOCK_USER } from '../data/mockData';

// Константы для ключей localStorage
const AUTH_KEY = 'sharlandia_auth';
const USER_KEY = 'sharlandia_user';

// Состояния авторизации
export const AuthState = {
  INITIAL: 'initial',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

const useAuthHook = () => {
  const [authState, setAuthState] = useState(AuthState.INITIAL);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Проверка сохранённой сессии при загрузке
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setAuthState(AuthState.AUTHENTICATED);
      } catch (e) {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(AUTH_KEY);
        setAuthState(AuthState.UNAUTHENTICATED);
      }
    } else {
      setAuthState(AuthState.UNAUTHENTICATED);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthState(AuthState.LOADING);
    setError(null);

    try {
      const response = await apiLogin(email, password);
      
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        localStorage.setItem(AUTH_KEY, 'true');
        setAuthState(AuthState.AUTHENTICATED);
        return { success: true };
      } else if (response && response.error) {
        setError(response.error);
        setAuthState(AuthState.ERROR);
        
        // Fallback для демо-режима
        if (email === 'admin@sharlandia.ru' && password === 'admin') {
          setUser(MOCK_USER);
          localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
          localStorage.setItem(AUTH_KEY, 'true');
          setAuthState(AuthState.AUTHENTICATED);
          setError(null);
          return { success: true };
        }
        
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
      
      // Fallback для демо-режима при ошибке сети
      if (email === 'admin@sharlandia.ru' && password === 'admin') {
        setUser(MOCK_USER);
        localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
        localStorage.setItem(AUTH_KEY, 'true');
        setAuthState(AuthState.AUTHENTICATED);
        return { success: true };
      }
      
      setError('Ошибка соединения. Проверьте подключение к интернету.');
      setAuthState(AuthState.ERROR);
      return { success: false, error: 'network' };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setAuthState(AuthState.LOADING);
    setError(null);

    try {
      // Пытаемся вызвать API регистрации
      const response = await apiRegister?.(name, email, password);
      
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        localStorage.setItem(AUTH_KEY, 'true');
        setAuthState(AuthState.AUTHENTICATED);
        return { success: true };
      }
      
      // Fallback: эмулируем успешную регистрацию
      const mockUser = { id: Date.now(), name, email, role: 'user' };
      setUser(mockUser);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(AUTH_KEY, 'true');
      setAuthState(AuthState.AUTHENTICATED);
      return { success: true };
    } catch (err) {
      // Fallback при ошибке
      const mockUser = { id: Date.now(), name, email, role: 'user' };
      setUser(mockUser);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(AUTH_KEY, 'true');
      setAuthState(AuthState.AUTHENTICATED);
      return { success: true };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AUTH_KEY);
    setAuthState(AuthState.UNAUTHENTICATED);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    if (authState === AuthState.ERROR) {
      setAuthState(user ? AuthState.AUTHENTICATED : AuthState.UNAUTHENTICATED);
    }
  }, [authState, user]);

  const isAuthenticated = authState === AuthState.AUTHENTICATED;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isLoading = authState === AuthState.LOADING;

  return {
    user,
    authState,
    error,
    isAuthenticated,
    isAdmin,
    isManager,
    isLoading,
    login,
    register,
    logout,
    clearError
  };
};

// Контекст для использования хука авторизации во всех компонентах
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default useAuthHook;
