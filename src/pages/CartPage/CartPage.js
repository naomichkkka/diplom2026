import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { API_ROOT } from '../../services/api';

const CartPage = () => {
  const { items, updateQty, removeItem, clear, createOrder } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(false);
  const [customerData, setCustomerData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    delivery_method: 'Самовывоз',
    payment_method: 'Наличные',
    notes: ''
  });

  const total = useMemo(() => 
    items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0), 
  [items]);

  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.qty, 0), 
  [items]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      showToast('Для оформления заказа необходимо войти в аккаунт');
      navigate('/auth');
      return;
    }

    if (items.length === 0) return;

    // Валидация
    if (!customerData.customer_name.trim()) {
      showToast('Введите имя', { type: 'error' });
      return;
    }
    if (!customerData.customer_phone.trim()) {
      showToast('Введите телефон', { type: 'error' });
      return;
    }
    if (!customerData.customer_email.trim()) {
      showToast('Введите email', { type: 'error' });
      return;
    }

    setLoading(true);
    setOrderResult(null);

    try {
      const orderData = {
        user_id: user?.id || 1,
        ...customerData,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })),
        total
      };
      
      const res = await createOrder(orderData);
      
      if (res && (res.ok || res.success)) {
        clear();
        setCustomerData({
          customer_name: '',
          customer_phone: '',
          customer_email: '',
          delivery_address: '',
          delivery_method: 'Самовывоз',
          payment_method: 'Наличные',
          notes: ''
        });
        setOrderResult(res.order);
        showToast(
          res.isMock 
            ? 'Заказ создан (демо-режим)' 
            : `Заказ #${res.order?.id} успешно создан!`
        );
      } else {
        showToast(res?.error || 'Ошибка при создании заказа', { type: 'error' });
      }
    } catch (err) {
      showToast('Произошла ошибка. Попробуйте ещё раз.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = (item) => {
    removeItem(item.id);
    showToast('Товар удалён из корзины');
  };

  const handleQuantityChange = (item, value) => {
    const qty = Math.max(1, Number(value) || 1);
    updateQty(item.id, qty);
  };

  // Пустая корзина
  if (items.length === 0 && !orderResult) {
    return (
      <div className="page cart-page">
        <header className="page__header">
          <div>
            <h2 className="page__title">Корзина</h2>
            <p className="page__subtitle">
              Проверьте состав заказа перед оформлением.
            </p>
          </div>
        </header>

        <div className="cart-page__empty">
          <div className="cart-page__empty-icon">🛒</div>
          <h3>Корзина пуста</h3>
          <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
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

  // Успешное оформление заказа
  if (orderResult) {
    return (
      <div className="page cart-page">
        <header className="page__header">
          <div>
            <h2 className="page__title">Заказ оформлен!</h2>
            <p className="page__subtitle">
              Спасибо за ваш заказ.
            </p>
          </div>
        </header>

        <div className="cart-page__success">
          <div className="cart-page__success-icon">✓</div>
          <h3>Заказ #{orderResult.id}</h3>
          <p>Менеджер свяжется с вами в ближайшее время для подтверждения деталей.</p>
          <div className="cart-page__success-actions">
            <button 
              className="btn btn--primary" 
              onClick={() => navigate('/catalog')}
            >
              Продолжить покупки
            </button>
            <button 
              className="btn btn--ghost" 
              onClick={() => navigate('/profile')}
            >
              Мои заказы
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">Корзина</h2>
          <p className="page__subtitle">
            Проверьте состав заказа перед оформлением. Вы всегда сможете вернуться и что-то изменить.
            {totalItems > 0 && <span className="cart-page__count"> ({totalItems} товар{totalItems > 1 && 'ов'})</span>}
          </p>
        </div>
      </header>

      <div className="cart-page__layout">
        <div className="cart-page__items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__left">
                {item.image ? (
                  <img 
                    className="cart-item__image" 
                    src={`${API_ROOT}/uploads/products/${item.image}`} 
                    alt={item.name} 
                  />
                ) : (
                  <div className="cart-item__image cart-item__image--placeholder" />
                )}
                <div className="cart-item__info">
                  <h3 className="cart-item__name">{item.name}</h3>
                  <p className="cart-item__meta">
                    {Number(item.price).toLocaleString('ru-RU')} ₽ за шт.
                  </p>
                </div>
              </div>
              <div className="cart-item__controls">
                <div className="cart-item__qty">
                  <button 
                    className="cart-item__qty-btn"
                    onClick={() => handleQuantityChange(item, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={item.qty} 
                    onChange={e => handleQuantityChange(item, e.target.value)}
                    className="cart-item__qty-input"
                  />
                  <button 
                    className="cart-item__qty-btn"
                    onClick={() => handleQuantityChange(item, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item__price">
                  {(Number(item.price) * item.qty).toLocaleString('ru-RU')} ₽
                </div>
                <button 
                  type="button" 
                  className="btn btn--ghost cart-item__remove"
                  onClick={() => handleRemoveItem(item)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-page__summary">
          <h3 className="cart-page__summary-title">Оформление заказа</h3>
          
          <div className="form-field">
            <label htmlFor="customer_name">Имя *</label>
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              className="input"
              value={customerData.customer_name}
              onChange={handleInputChange}
              placeholder="Ваше имя"
              required
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="customer_phone">Телефон *</label>
            <input
              id="customer_phone"
              name="customer_phone"
              type="tel"
              className="input"
              value={customerData.customer_phone}
              onChange={handleInputChange}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="customer_email">Email *</label>
            <input
              id="customer_email"
              name="customer_email"
              type="email"
              className="input"
              value={customerData.customer_email}
              onChange={handleInputChange}
              placeholder="example@mail.ru"
              required
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="delivery_method">Способ получения</label>
            <select
              id="delivery_method"
              name="delivery_method"
              className="input"
              value={customerData.delivery_method}
              onChange={handleInputChange}
            >
              <option value="Самовывоз">Самовывоз</option>
              <option value="Доставка">Доставка</option>
            </select>
          </div>
          
          {customerData.delivery_method === 'Доставка' && (
            <div className="form-field">
              <label htmlFor="delivery_address">Адрес доставки</label>
              <textarea
                id="delivery_address"
                name="delivery_address"
                className="input"
                value={customerData.delivery_address}
                onChange={handleInputChange}
                placeholder="Улица, дом, квартира"
                rows={2}
              />
            </div>
          )}
          
          <div className="form-field">
            <label htmlFor="payment_method">Оплата</label>
            <select
              id="payment_method"
              name="payment_method"
              className="input"
              value={customerData.payment_method}
              onChange={handleInputChange}
            >
              <option value="Наличные">Наличные при получении</option>
              <option value="Карта">Оплата картой</option>
              <option value="Онлайн">Онлайн перевод</option>
            </select>
          </div>
          
          <div className="form-field">
            <label htmlFor="notes">Комментарий</label>
            <textarea
              id="notes"
              name="notes"
              className="input"
              value={customerData.notes}
              onChange={handleInputChange}
              placeholder="Пожелания к заказу"
              rows={2}
            />
          </div>
          
          <div className="cart-page__summary-row">
            <span>Товаров:</span>
            <span>{totalItems}</span>
          </div>
          <div className="cart-page__summary-row cart-page__summary-row--total">
            <span>К оплате:</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <button 
            type="button" 
            className="btn btn--primary cart-page__btn-main" 
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
          >
            {loading ? 'Оформляем...' : 'Оформить заказ'}
          </button>
          <button 
            type="button" 
            className="btn btn--ghost cart-page__btn-secondary" 
            onClick={clear}
          >
            Очистить корзину
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;

