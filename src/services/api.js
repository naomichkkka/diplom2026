// services/api.js

const BASE_URL = "http://localhost/sharlandia/backend/routes/api.php";
export const API_ROOT = BASE_URL.replace('/routes/api.php', '');

export const fetchProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}?resource=products`);
    const data = await res.json();

    if (data.error) {
      console.error("Ошибка от сервера:", data.error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Ошибка при получении продуктов:", err);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=products&id=${encodeURIComponent(id)}`);
    const data = await res.json();
    if (data.error) {
      console.error('Ошибка от сервера:', data.error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Ошибка при получении продукта:', err);
    return null;
  }
};

export const login = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    console.error('Ошибка при логине:', err);
    return { error: 'network' };
  }
};

export const createOrder = async (order) => {
  try {
    const res = await fetch(`${BASE_URL}?resource=orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return await res.json();
  } catch (err) {
    console.error('Ошибка при создании заказа:', err);
    return { error: 'network' };
  }
};
