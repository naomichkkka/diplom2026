import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const cartTotal = items ? items.reduce((s, it) => s + (it.qty || 0), 0) : 0;

  const currentSection = (() => {
    const path = location.pathname;
    if (path.startsWith('/catalog')) return 'catalog';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/auth')) return 'auth';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  })();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand" onClick={() => navigate('/')}>
          <div className="app-header__logo">
            <span className="app-header__logo-icon">🎈</span>
          </div>
          <div className="app-header__brand-text">
            <h1 className="app-header__title">Шарландия</h1>
            <span className="app-header__tagline">воздушный декор праздников</span>
          </div>
        </div>

        <nav className="app-header__nav">
          <button
            type="button"
            className={
              currentSection === 'home'
                ? 'app-header__nav-link app-header__nav-link--active'
                : 'app-header__nav-link'
            }
            onClick={() => navigate('/')}
          >
            Главная
          </button>
          <button
            type="button"
            className={
              currentSection === 'catalog'
                ? 'app-header__nav-link app-header__nav-link--active'
                : 'app-header__nav-link'
            }
            onClick={() => navigate('/catalog')}
          >
            Каталог
          </button>
        </nav>

        <div className="app-header__actions">
          <button
            type="button"
            className="app-header__action-btn app-header__action-btn--login"
            onClick={() => navigate('/auth')}
          >
            Войти
          </button>
        </div>

        <div className="app-header__contacts">
          <a href="tel:+79991234567" className="app-header__phone">
            +7 (999) 123‑45‑67
          </a>
          <span className="app-header__schedule">ежедневно 9:00–22:00</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

