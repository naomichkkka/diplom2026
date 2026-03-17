import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { API_ROOT } from '../../services/api';

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addItem(product);
    showToast(`${product.name} добавлен в корзину`, { type: 'success' });
  };

  if (favorites.length === 0) {
    return (
      <div className="page favorites-page">
        <header className="page__header">
          <div>
            <h2 className="page__title">Избранное</h2>
            <p className="page__subtitle">
              Понравившиеся товары сохраняются здесь
            </p>
          </div>
        </header>

        <div className="favorites-page__empty">
          <div className="favorites-page__empty-icon">🤍</div>
          <h3>Избранное пусто</h3>
          <p>Добавляйте товары в избранное, чтобы не потерять их</p>
          <button 
            className="btn btn--primary"
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page favorites-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">Избранное</h2>
          <p className="page__subtitle">
            {favorites.length} товар{favorites.length !== 1 ? 'ов' : ''} в избранном
          </p>
        </div>
      </header>

      <div className="favorites-page__grid">
        {favorites.map(product => (
          <div key={product.id} className="favorites-page__card">
            <Link to={`/product/${product.id}`} className="favorites-page__card-image">
              {product.image_path ? (
                <img 
                  src={`${API_ROOT}/uploads/products/${product.image_path}`} 
                  alt={product.name}
                />
              ) : (
                <div className="favorites-page__card-placeholder">
                  🎈
                </div>
              )}
            </Link>
            <div className="favorites-page__card-content">
              <Link to={`/product/${product.id}`} className="favorites-page__card-title">
                {product.name}
              </Link>
              <p className="favorites-page__card-category">
                {product.category || 'Шары'}
              </p>
              <p className="favorites-page__card-price">
                {Number(product.price).toLocaleString('ru-RU')} ₽
              </p>
              <div className="favorites-page__card-actions">
                <button 
                  className="btn btn--primary btn--sm"
                  onClick={() => handleAddToCart(product)}
                >
                  В корзину
                </button>
                <button 
                  className="btn btn--ghost btn--sm"
                  onClick={() => removeFavorite(product.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
