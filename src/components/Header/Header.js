import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  
  const currentSection = (() => {
    const path = location.pathname;
    if (path.startsWith('/catalog')) return 'catalog';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/favorites')) return 'favorites';
    if (path.startsWith('/auth')) return 'auth';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/contacts')) return 'contacts';
    if (path.startsWith('/delivery')) return 'delivery';
    return 'home';
  })();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            className={`app-header__nav-link ${currentSection === 'home' ? 'app-header__nav-link--active' : ''}`}
            onClick={() => navigate('/')}
          >
            Главная
          </button>
          <button
            type="button"
            className={`app-header__nav-link ${currentSection === 'catalog' ? 'app-header__nav-link--active' : ''}`}
            onClick={() => navigate('/catalog')}
          >
            Каталог
          </button>
          <button
            type="button"
            className={`app-header__nav-link ${currentSection === 'about' ? 'app-header__nav-link--active' : ''}`}
            onClick={() => navigate('/about')}
          >
            О нас
          </button>
          <button
            type="button"
            className={`app-header__nav-link ${currentSection === 'contacts' ? 'app-header__nav-link--active' : ''}`}
            onClick={() => navigate('/contacts')}
          >
            Контакты
          </button>
          <button
            type="button"
            className={`app-header__nav-link ${currentSection === 'delivery' ? 'app-header__nav-link--active' : ''}`}
            onClick={() => navigate('/delivery')}
          >
            Доставка
          </button>
        </nav>

        <div className="app-header__actions">
          <button
            type="button"
            className="app-header__action-btn app-header__favorites"
            onClick={() => navigate('/favorites')}
            title="Избранное"
          >
            🤍 {favoritesCount > 0 && <span className="app-header__badge">{favoritesCount}</span>}
          </button>
          
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="app-header__action-btn"
                onClick={() => navigate('/profile')}
                title="Личный кабинет"
              >
                👤 {user?.name || 'Профиль'}
              </button>
              {isAdmin && (
                <button
                  type="button"
                  className="app-header__action-btn"
                  onClick={() => navigate('/admin')}
                  title="Админ-панель"
                >
                  ⚙️
                </button>
              )}
              <button
                type="button"
                className="app-header__action-btn"
                onClick={handleLogout}
                title="Выйти"
              >
                🚪
              </button>
            </>
          ) : (
            <button
              type="button"
              className="app-header__action-btn app-header__action-btn--login"
              onClick={() => navigate('/auth')}
            >
              Войти
            </button>
          )}
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

