import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  // Redirect если не авторизован
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/profile' } } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Загружаем заказы при монтировании
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Состояние загрузки
  if (authLoading) {
    return (
      <div className="page profile-page">
        <div className="profile-page__loading">
          <div className="loading-spinner"></div>
          <p>Загружаем профиль...</p>
        </div>
      </div>
    );
  }

  // Не авторизован — не показываем (редирект выше)
  if (!isAuthenticated) {
    return null;
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Ожидает',
      processing: 'В обработке',
      completed: 'Доставлен',
      cancelled: 'Отменён'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'profile-order__status--pending',
      processing: 'profile-order__status--processing',
      completed: 'profile-order__status--completed',
      cancelled: 'profile-order__status--cancelled'
    };
    return classes[status] || '';
  };

  return (
    <div className="page profile-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">Личный кабинет</h2>
          <p className="page__subtitle">
            Управляйте своими данными, смотрите историю заказов и повторяйте понравившиеся композиции.
          </p>
        </div>
      </header>

      <div className="profile-page__layout">
        <aside className="profile-sidebar">
          <div className="profile-user">
            <div className="profile-user__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="profile-user__info">
              <h3 className="profile-user__name">{user?.name || 'Пользователь'}</h3>
              <p className="profile-user__email">{user?.email || ''}</p>
              {user?.role === 'admin' && (
                <span className="profile-user__role">Администратор</span>
              )}
            </div>
          </div>

          <nav className="profile-nav">
            <button
              className={`profile-nav__item ${activeTab === 'orders' ? 'profile-nav__item--active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Мои заказы
            </button>
            <button
              className={`profile-nav__item ${activeTab === 'settings' ? 'profile-nav__item--active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Настройки
            </button>
            <button
              className="profile-nav__item profile-nav__item--logout"
              onClick={handleLogout}
            >
              🚪 Выйти
            </button>
          </nav>
        </aside>

        <main className="profile-main">
          {activeTab === 'orders' && (
            <section className="profile-orders">
              <h3 className="profile-orders__title">История заказов</h3>
              
              {ordersLoading ? (
                <div className="profile-orders__loading">
                  <div className="loading-spinner"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="profile-orders__empty">
                  <p>У вас пока нет заказов</p>
                  <button 
                    className="btn btn--primary"
                    onClick={() => navigate('/catalog')}
                  >
                    Перейти в каталог
                  </button>
                </div>
              ) : (
                <div className="profile-orders__list">
                  {orders.map(order => (
                    <div key={order.id} className="profile-order">
                      <div className="profile-order__left">
                        <p className="profile-order__id">Заказ #{order.id}</p>
                        <p className="profile-order__date">
                          {new Date(order.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="profile-order__items">
                          {order.items?.length || order.items || '—'} товар{(order.items?.length || order.items || 0) !== 1 ? 'ов' : ''}
                        </p>
                      </div>
                      <div className="profile-order__right">
                        <span className="profile-order__price">
                          {Number(order.total || 0).toLocaleString('ru-RU')} ₽
                        </span>
                        <span className={`profile-order__status ${getStatusClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="profile-settings">
              <h3 className="profile-settings__title">Настройки профиля</h3>
              
              <div className="form-card">
                <div className="form-card__fields">
                  <div className="form-field">
                    <label>Имя</label>
                    <input 
                      type="text" 
                      className="input" 
                      defaultValue={user?.name || ''}
                      disabled
                    />
                  </div>
                  <div className="form-field">
                    <label>E-mail</label>
                    <input 
                      type="email" 
                      className="input" 
                      defaultValue={user?.email || ''}
                      disabled
                    />
                  </div>
                  <div className="form-field">
                    <label>Роль</label>
                    <input 
                      type="text" 
                      className="input" 
                      defaultValue={user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      disabled
                    />
                  </div>
                </div>
                <p className="profile-settings__note">
                  Для изменения данных обратитесь к администратору.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

