import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FloatingCart = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const total = items ? items.reduce((s, it) => s + (it.qty || 0), 0) : 0;

  return (
    <button
      type="button"
      className="floating-cart"
      onClick={() => navigate('/cart')}
      aria-label="Открыть корзину"
    >
      <span className="floating-cart__icon">🛒</span>
      {total > 0 && <span className="floating-cart__count">{total}</span>}
    </button>
  );
};

export default FloatingCart;
