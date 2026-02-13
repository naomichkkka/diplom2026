import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__col">
          <div className="app-footer__brand">
            <span className="app-footer__logo">🎈</span>
            <span className="app-footer__brand-name">Шарландия</span>
          </div>
          <p className="app-footer__text">
            Нежные композиции из шаров для дней рождения, свадеб и корпоративов.
          </p>
        </div>

        <div className="app-footer__col">
          <h4 className="app-footer__title">Навигация</h4>
          <ul className="app-footer__list">
            <li>Главная</li>
            <li>Каталог композиций</li>
            <li>Оформление мероприятий</li>
          </ul>
        </div>

        <div className="app-footer__col">
          <h4 className="app-footer__title">Контакты</h4>
          <p className="app-footer__text">Телефон: +7 (999) 123‑45‑67</p>
          <p className="app-footer__text">WhatsApp / Telegram: по номеру телефона</p>
          <p className="app-footer__text">Доставка по городу и области</p>
        </div>
      </div>
      <div className="app-footer__bottom">
        <p className="app-footer__copyright">
          © 2026 Шарландия. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

