// services/api.js
// Слой доступа к данным (Data Access Layer)
// Изолирует логику работы с API от компонентов

const BASE_URL = "http://localhost/sharlandia1/backend/routes/api.php";
export const API_ROOT = BASE_URL.replace('/routes/api.php', '');

// Утилита для обработки ответа
const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
};

// Утилита для обработки сетевых ошибок
const handleError = (err, context) => {
  console.error(`Ошибка в ${context}:`, err);
  return { error: err.message || 'network' };
};

// ============ ТОВАРЫ ============

export const fetchProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}?resource=products`);
    const data = await handleResponse(res);

    if (data.error) {
      console.error("Ошибка от сервера:", data.error);
      return [];
    }

    return data;
  } catch (err) {
    return handleError(err, 'fetchProducts');
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=products&id=${encodeURIComponent(id)}`);
    const data = await handleResponse(res);
    
    if (data.error) {
      console.error('Ошибка от сервера:', data.error);
      return null;
    }
    return data;
  } catch (err) {
    return handleError(err, 'fetchProductById');
  }
};

// ============ АВТОРИЗАЦИЯ ============

export const login = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'login');
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=auth&action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'register');
  }
};

export const logout = async () => {
  // Для API с сессиями
  try {
    const res = await fetch(`${BASE_URL}?resource=auth&action=logout`, {
      method: 'POST',
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'logout');
  }
};

// ============ ЗАКАЗЫ ============

export const createOrder = async (order) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'createOrder');
  }
};

export const fetchOrders = async (userId = null) => {
  try {
    const url = userId 
      ? `${BASE_URL}?resource=orders&user_id=${userId}`
      : `${BASE_URL}?resource=orders`;
    const res = await fetch(url);
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'fetchOrders');
  }
};

export const fetchOrderById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=orders&id=${encodeURIComponent(id)}`);
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'fetchOrderById');
  }
};

// ============ АДМИН: ТОВАРЫ ============

export const createProduct = async (productData) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'createProduct');
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=products&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'updateProduct');
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=products&id=${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'deleteProduct');
  }
};

// ============ АДМИН: ЗАКАЗЫ ============

export const fetchAllOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}?resource=orders`);
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'fetchAllOrders');
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=orders&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'updateOrderStatus');
  }
};

export const deleteOrder = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=orders&id=${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'deleteOrder');
  }
};

// ============ АДМИН: ПОЛЬЗОВАТЕЛИ ============

export const fetchAllUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}?resource=users`);
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'fetchAllUsers');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=users&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'updateUser');
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=users&id=${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (err) {
    return handleError(err, 'deleteUser');
  }
};
