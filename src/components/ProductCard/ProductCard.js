import React from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useFavorites } from '../../hooks/useFavorites';
import { API_ROOT } from '../../services/api';

const ProductCard = ({ id, name, price, category, description, isPopular, image }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite({ id, name, price, category, description, image, is_popular: isPopular });
  };

  return (
    <article className="product-card" role="link" tabIndex={0}>
      {isPopular && <div className="product-card__badge">Хит праздников</div>}
      <button
        type="button"
        className={`product-card__favorite ${favorite ? 'product-card__favorite--active' : ''}`}
        onClick={handleFavorite}
        title={favorite ? 'Удалить из избранного' : 'В избранное'}
      >
        {favorite ? '❤️' : '🤍'}
      </button>
      {image ? (
        <div className="product-card__image-wrap">
          <img className="product-card__image" src={`${API_ROOT}/uploads/products/${image}`} alt={name} />
        </div>
      ) : null}
      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__category">{category}</p>
      <p className="product-card__description">{description}</p>
      <div className="product-card__bottom">
        <div className="product-card__price">
          <span className="product-card__price-value">{price} ₽</span>
          <span className="product-card__price-note">за готовую композицию</span>
        </div>
        <ProductCardActions id={id} name={name} price={price} image={image} />
      </div>
    </article>
  );
};

const ProductCardActions = ({ id, name, price, image }) => {
  const { addItem, updateQty, removeItem, items } = useCart();
  const { showToast } = useToast();

  const inCart = items.find(p => p.id === id);

  const inc = () => {
    if (inCart) {
      updateQty(id, inCart.qty + 1);
    } else {
      addItem({ id, name, price, qty: 1, image });
    }
    showToast('Товар добавлен в корзину');
  };

  const dec = () => {
    if (!inCart) return;
    if (inCart.qty <= 1) {
      removeItem(id);
    } else {
      updateQty(id, inCart.qty - 1);
    }
  };

  return (
    <div className="product-card__actions">
      <div className="product-card__action-left" />

      <div className="product-card__action-right">
        {inCart && (
          <div className="product-card__qty-controls" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="btn btn--icon" onClick={(e) => { e.stopPropagation(); dec(); }}>−</button>
            <div className="product-card__qty-display">{inCart.qty}</div>
            <button type="button" className="btn btn--icon" onClick={(e) => { e.stopPropagation(); inc(); }}>+</button>
          </div>
        )}

        <button
          type="button"
          className="btn btn--primary product-card__btn"
          onClick={(e) => { e.stopPropagation(); inc(); }}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
