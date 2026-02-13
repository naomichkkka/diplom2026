import React from 'react';

const AdminPage = () => {
  const products = [
    { id: 1, name: 'Нежный букет из шаров', price: '3 500 ₽', status: 'Активен' },
    { id: 2, name: 'Сет «День рождения»', price: '4 200 ₽', status: 'Скрыт' },
  ];

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
            <li className="admin-sidebar__item admin-sidebar__item--active">Товары</li>
            <li className="admin-sidebar__item">Заказы</li>
            <li className="admin-sidebar__item">Пользователи</li>
          </ul>
        </aside>

        <section className="admin-main">
          <div className="admin-main__toolbar">
            <button type="button" className="btn btn--primary">
              Добавить товар
            </button>
            <button type="button" className="btn btn--ghost">
              Импорт из файла
            </button>
          </div>

          <div className="admin-table">
            <div className="admin-table__header">
              <span>Название</span>
              <span>Цена</span>
              <span>Статус</span>
            </div>
            {products.map(product => (
              <div key={product.id} className="admin-table__row">
                <span>{product.name}</span>
                <span>{product.price}</span>
                <span>{product.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

