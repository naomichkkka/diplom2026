import React from 'react';
import { Link } from 'react-router-dom';

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
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/catalog">Каталог</Link></li>
            <li><Link to="/about">О нас</Link></li>
            <li><Link to="/delivery">Доставка</Link></li>
          </ul>
        </div>

        <div className="app-footer__col">
          <h4 className="app-footer__title">Контакты</h4>
          <p className="app-footer__text">Телефон: +7 (962) 814-24-28</p>
          <p className="app-footer__text">Email: sharik22@mail.ru</p>
          <p className="app-footer__text">WhatsApp / Telegram / Max: по номеру телефона</p>
          <p className="app-footer__text"><Link to="/contacts">Напишите нам</Link></p>
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

