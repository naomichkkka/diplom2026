import React from 'react';

const ProfilePage = () => {
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
        <section className="profile-card">
          <h3 className="profile-card__title">Профиль</h3>
          <p className="profile-card__line">
            <span>Имя:</span> Мария
          </p>
          <p className="profile-card__line">
            <span>E-mail:</span> example@sharlandia.ru
          </p>
          <p className="profile-card__line">
            <span>Телефон:</span> +7 (999) 123‑45‑67
          </p>
        </section>

        <section className="profile-orders">
          <h3 className="profile-orders__title">Последние заказы</h3>
          <div className="profile-orders__list">
            <div className="profile-order">
              <div>
                <p className="profile-order__name">«Нежный букет из шаров»</p>
                <p className="profile-order__meta">Доставка: 12 февраля, 19:00</p>
              </div>
              <div className="profile-order__right">
                <span className="profile-order__price">3 500 ₽</span>
                <span className="profile-order__status">Доставлен</span>
              </div>
            </div>
            <div className="profile-order">
              <div>
                <p className="profile-order__name">Сет «День рождения»</p>
                <p className="profile-order__meta">Доставка: 5 февраля, 15:00</p>
              </div>
              <div className="profile-order__right">
                <span className="profile-order__price">4 200 ₽</span>
                <span className="profile-order__status">Доставлен</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;

