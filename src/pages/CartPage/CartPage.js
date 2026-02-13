import React, { useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { API_ROOT } from '../../services/api';

const CartPage = () => {
  const { items, updateQty, removeItem, clear, createOrder } = useCart();
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0), [items]);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await createOrder({});
    setLoading(false);
    if (res && res.ok) {
      clear();
      alert('Заказ создан: ' + (res.order?.id || '—'));
    } else {
      alert('Ошибка при создании заказа');
    }
  };

  return (
    <div className="page cart-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">Корзина</h2>
          <p className="page__subtitle">
            Проверьте состав заказа перед оформлением. Вы всегда сможете вернуться и что-то изменить.
          </p>
        </div>
      </header>

      <div className="cart-page__layout">
        <div className="cart-page__items">
          {items.length === 0 && <p>Корзина пуста</p>}
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__left">
                {item.image ? (
                  <img className="cart-item__image" src={`${API_ROOT}/uploads/products/${item.image}`} alt={item.name} />
                ) : null}
                <div className="cart-item__info">
                  <h3 className="cart-item__name">{item.name}</h3>
                  <p className="cart-item__meta">Композиция для праздника</p>
                </div>
              </div>
              <div className="cart-item__controls">
                <input type="number" min="1" value={item.qty} onChange={e => updateQty(item.id, Math.max(1, Number(e.target.value) || 1))} />
                <div className="cart-item__price">{Number(item.price).toLocaleString('ru-RU')} ₽</div>
                <button type="button" className="btn btn--ghost" onClick={() => removeItem(item.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-page__summary">
          <h3 className="cart-page__summary-title">Итого</h3>
          <p className="cart-page__summary-amount">{total.toLocaleString('ru-RU')} ₽</p>
          <p className="cart-page__summary-note">Доставка рассчитывается при подтверждении заказа менеджером.</p>
          <button type="button" className="btn btn--primary cart-page__btn-main" onClick={handleCheckout} disabled={loading || items.length===0}>
            {loading ? 'Создаём заказ...' : 'Оформить заказ'}
          </button>
          <button type="button" className="btn btn--ghost cart-page__btn-secondary" onClick={clear}>
            Очистить корзину
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;

