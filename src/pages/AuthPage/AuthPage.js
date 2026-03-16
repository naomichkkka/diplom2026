import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { login, register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Очистка ошибок при смене режима
  useEffect(() => {
    clearError();
    setFormData({ name: '', email: '', password: '' });
  }, [mode, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    let result;
    if (mode === 'login') {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password);
    }

    setLoading(false);

    if (result.success) {
      showToast(
        mode === 'login' ? 'Добро пожаловать!' : 'Аккаунт создан!',
        { type: 'success' }
      );
      navigate('/profile', { replace: true });
    } else {
      showToast(result.error || 'Произошла ошибка', { type: 'error' });
    }
  };

  return (
    <div className="page auth-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">
            {mode === 'login' ? 'Вход в личный кабинет' : 'Регистрация в Sharlandia'}
          </h2>
          <p className="page__subtitle">
            {mode === 'login'
              ? 'Сохраняйте заказы, отслеживайте доставку и получайте персональные подборки композиций.'
              : 'Создайте аккаунт, чтобы сохранять любимые композиции и быстрее оформлять заказы.'}
          </p>
        </div>
      </header>

      <div className="auth-page__layout">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tabs__tab ${mode === 'login' ? 'auth-tabs__tab--active' : ''}`}
            onClick={() => setMode('login')}
            disabled={loading}
          >
            Вход
          </button>
          <button
            type="button"
            className={`auth-tabs__tab ${mode === 'register' ? 'auth-tabs__tab--active' : ''}`}
            onClick={() => setMode('register')}
            disabled={loading}
          >
            Регистрация
          </button>
        </div>

        {isLoading || loading ? (
          <div className="auth-page__loading">
            <div className="loading-spinner"></div>
            <p>{mode === 'login' ? 'Выполняем вход...' : 'Создаём аккаунт...'}</p>
          </div>
        ) : (
          <form className="form-card" onSubmit={handleSubmit}>
            <h3 className="form-card__title">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </h3>
            
            <div className="form-card__fields">
              {mode === 'register' && (
                <div className="form-field">
                  <label htmlFor="name">Имя</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ваше имя"
                    required={mode === 'register'}
                    minLength={2}
                  />
                </div>
              )}
              
              <div className="form-field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@mail.ru"
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="password">Пароль</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  minLength={4}
                />
              </div>
            </div>

            {error && (
              <div className="form-card__error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn--primary auth-page__btn-main"
              disabled={loading}
            >
              {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>

            {mode === 'login' && (
              <p className="auth-page__hint">
                Для демо-входа используйте:<br />
                <code>admin@sharlandia.ru</code> / <code>admin</code>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

