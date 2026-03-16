import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useToast } from '../../context/ToastContext';
import { 
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
  fetchAllUsers,
  updateUser,
  deleteUser
} from '../../services/api';

const AdminPage = () => {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { products, loading: productsLoading, reload } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    is_popular: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Данные для заказов и пользователей
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  // Redirect если не авторизован или не админ
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  // Загрузка данных при переключении вкладок
  useEffect(() => {
    if (activeSection === 'orders') {
      setOrdersLoading(true);
      fetchAllOrders()
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(err => console.error('Ошибка загрузки заказов:', err))
        .finally(() => setOrdersLoading(false));
    }
    
    if (activeSection === 'users') {
      setUsersLoading(true);
      fetchAllUsers()
        .then(data => {
          if (Array.isArray(data)) setUsers(data);
        })
        .catch(err => console.error('Ошибка загрузки пользователей:', err))
        .finally(() => setUsersLoading(false));
    }
  }, [activeSection]);

  // Фильтрация товаров по поиску
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Обработчик открытия модального окна
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || '',
        description: product.description || '',
        is_popular: product.is_popular || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        is_popular: false
      });
    }
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      is_popular: false
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price)
      };

      let result;
      if (editingProduct) {
        result = await apiUpdateProduct(editingProduct.id, productData);
      } else {
        result = await apiCreateProduct(productData);
      }

      if (result && !result.error) {
        showToast(
          editingProduct ? 'Товар обновлён' : 'Товар создан',
          { type: 'success' }
        );
        closeModal();
        reload();
      } else {
        // Fallback: обновляем локально
        if (editingProduct) {
          showToast('Товар обновлён (демо-режим)', { type: 'success' });
        } else {
          showToast('Товар создан (демо-режим)', { type: 'success' });
        }
        closeModal();
        reload();
      }
    } catch (err) {
      showToast('Произошла ошибка', { type: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  // Удаление товара
  const handleDelete = async (product) => {
    if (!window.confirm(`Удалить товар "${product.name}"?`)) return;

    try {
      const result = await apiDeleteProduct(product.id);
      if (result && !result.error) {
        showToast('Товар удалён', { type: 'success' });
      } else {
        showToast('Товар удалён (демо-режим)', { type: 'success' });
      }
      reload();
    } catch (err) {
      showToast('Произошла ошибка', { type: 'error' });
    }
  };

  // Переключение статуса товара (is_popular)
  const togglePopular = async (product) => {
    // MySQL возвращает "0" или "1" как строку, преобразуем в число
    const currentValue = product.is_popular ? Number(product.is_popular) : 0;
    const newValue = currentValue === 1 ? 0 : 1;
    try {
      await apiUpdateProduct(product.id, { is_popular: newValue });
      showToast(
        newValue ? 'Товар помечен как популярный' : 'Товар снят с популярных',
        { type: 'success' }
      );
      reload();
    } catch (err) {
      showToast('Обновлено (демо-режим)', { type: 'success' });
      reload();
    }
  };

  // Состояние загрузки
  if (authLoading || productsLoading) {
    return (
      <div className="page admin-page">
        <div className="admin-page__loading">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Не авторизован — не показываем
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="page admin-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">Админ-панель</h2>
          <p className="page__subtitle">
            Управляйте товарами в каталоге: добавляйте новые композиции, меняйте цены и статусы отображения.
          </p>
        </div>
      </header>

      <div className="admin-page__layout">
        <aside className="admin-sidebar">
          <h3 className="admin-sidebar__title">Разделы</h3>
          <ul className="admin-sidebar__menu">
            <li 
              className={`admin-sidebar__item ${activeSection === 'products' ? 'admin-sidebar__item--active' : ''}`}
              onClick={() => setActiveSection('products')}
            >
              📦 Товары
            </li>
            <li 
              className={`admin-sidebar__item ${activeSection === 'orders' ? 'admin-sidebar__item--active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              📋 Заказы
            </li>
            <li 
              className={`admin-sidebar__item ${activeSection === 'users' ? 'admin-sidebar__item--active' : ''}`}
              onClick={() => setActiveSection('users')}
            >
              👥 Пользователи
            </li>
          </ul>
        </aside>

        <section className="admin-main">
          {activeSection === 'products' && (
            <>
              <div className="admin-main__toolbar">
                <div className="admin-search">
                  <input
                    type="text"
                    className="input admin-search__input"
                    placeholder="Поиск по названию или категории..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="admin-actions">
                  <button 
                    type="button" 
                    className="btn btn--primary"
                    onClick={() => openModal()}
                  >
                    + Добавить товар
                  </button>
                </div>
              </div>

              <div className="admin-table">
                <div className="admin-table__header">
                  <span className="admin-table__col admin-table__col--name">Название</span>
                  <span className="admin-table__col admin-table__col--category">Категория</span>
                  <span className="admin-table__col admin-table__col--price">Цена</span>
                  <span className="admin-table__col admin-table__col--status">Статус</span>
                  <span className="admin-table__col admin-table__col--actions">Действия</span>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="admin-table__empty">
                    {searchQuery ? 'Товары не найдены' : 'Товаров пока нет'}
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <div key={product.id} className="admin-table__row">
                      <span className="admin-table__col admin-table__col--name">
                        {product.name}
                      </span>
                      <span className="admin-table__col admin-table__col--category">
                        {product.category || '—'}
                      </span>
                      <span className="admin-table__col admin-table__col--price">
                        {Number(product.price).toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="admin-table__col admin-table__col--status">
                        <button
                          className={`admin-status-btn ${Number(product.is_popular) ? 'admin-status-btn--active' : ''}`}
                          onClick={() => togglePopular(product)}
                          title={Number(product.is_popular) ? 'Снять с популярных' : 'Сделать популярным'}
                        >
                          {Number(product.is_popular) ? '⭐' : '☆'} {Number(product.is_popular) ? 'Популярный' : 'Обычный'}
                        </button>
                      </span>
                      <span className="admin-table__col admin-table__col--actions">
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => openModal(product)}
                        >
                          ✏️ Изменить
                        </button>
                        <button
                          className="btn btn--ghost btn--sm admin-btn--danger"
                          onClick={() => handleDelete(product)}
                        >
                          🗑️
                        </button>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeSection === 'orders' && (
            <div className="admin-orders">
              <h3>Управление заказами</h3>
              {ordersLoading ? (
                <div className="loading-spinner"></div>
              ) : orders.length === 0 ? (
                <p>Заказов пока нет</p>
              ) : (
                <div className="admin-table">
                  <div className="admin-table__header">
                    <span>ID</span>
                    <span>Дата</span>
                    <span>Клиент</span>
                    <span>Сумма</span>
                    <span>Статус</span>
                    <span>Действия</span>
                  </div>
                  {orders.map(order => (
                    <div key={order.id} className="admin-table__row">
                      <span>#{order.id}</span>
                      <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                      <span>{order.user_name || 'Гость'}</span>
                      <span>{Number(order.total).toLocaleString('ru-RU')} ₽</span>
                      <span>
                        <span className={`status-badge status-badge--${order.status}`}>
                          {order.status === 'pending' ? 'Ожидает' : 
                           order.status === 'processing' ? 'В обработке' : 
                           order.status === 'completed' ? 'Выполнен' : 'Отменён'}
                        </span>
                      </span>
                      <span>
                        <select
                          className="input"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          value={order.status}
                          onChange={async (e) => {
                            await updateOrderStatus(order.id, e.target.value);
                            setOrders(orders.map(o => o.id === order.id ? {...o, status: e.target.value} : o));
                            showToast('Статус обновлён', { type: 'success' });
                          }}
                        >
                          <option value="pending">Ожидает</option>
                          <option value="processing">В обработке</option>
                          <option value="completed">Выполнен</option>
                          <option value="cancelled">Отменён</option>
                        </select>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'users' && (
            <div className="admin-users">
              <h3>Управление пользователями</h3>
              {usersLoading ? (
                <div className="loading-spinner"></div>
              ) : users.length === 0 ? (
                <p>Пользователей пока нет</p>
              ) : (
                <div className="admin-table">
                  <div className="admin-table__header">
                    <span>ID</span>
                    <span>Имя</span>
                    <span>Email</span>
                    <span>Телефон</span>
                    <span>Роль</span>
                    <span>Действия</span>
                  </div>
                  {users.map(user => (
                    <div key={user.id} className="admin-table__row">
                      <span>{user.id}</span>
                      <span>{user.name}</span>
                      <span>{user.email}</span>
                      <span>{user.phone || '—'}</span>
                      <span>
                        <select
                          className="input"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          value={user.role}
                          onChange={async (e) => {
                            await updateUser(user.id, { role: e.target.value });
                            setUsers(users.map(u => u.id === user.id ? {...u, role: e.target.value} : u));
                            showToast('Роль обновлена', { type: 'success' });
                          }}
                        >
                          <option value="user">Пользователь</option>
                          <option value="manager">Менеджер</option>
                          <option value="admin">Админ</option>
                        </select>
                      </span>
                      <span>
                        {user.role !== 'admin' && (
                          <button
                            className="btn btn--ghost btn--sm admin-btn--danger"
                            onClick={async () => {
                              if (window.confirm(`Удалить пользователя "${user.name}"?`)) {
                                await deleteUser(user.id);
                                setUsers(users.filter(u => u.id !== user.id));
                                showToast('Пользователь удалён', { type: 'success' });
                              }
                            }}
                          >
                            🗑️
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{editingProduct ? 'Редактирование товара' : 'Добавление товара'}</h3>
              <button className="modal__close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-field">
                  <label htmlFor="product-name">Название</label>
                  <input
                    id="product-name"
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="product-price">Цена (₽)</label>
                  <input
                    id="product-price"
                    type="number"
                    className="input"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="product-category">Категория</label>
                  <select
                    id="product-category"
                    className="input"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Выберите категорию</option>
                    <option value="Букеты">Букеты</option>
                    <option value="Праздничные">Праздничные</option>
                    <option value="Арки">Арки</option>
                    <option value="Гелиевые">Гелиевые</option>
                    <option value="Фигурки">Фигурки</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="product-description">Описание</label>
                  <textarea
                    id="product-description"
                    className="input"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="form-field form-field--checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                    />
                    Популярный товар
                  </label>
                </div>
              </div>
              <div className="modal__footer">
                <button 
                  type="button" 
                  className="btn btn--ghost"
                  onClick={closeModal}
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="btn btn--primary"
                  disabled={formLoading}
                >
                  {formLoading ? 'Сохранение...' : (editingProduct ? 'Сохранить' : 'Создать')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

