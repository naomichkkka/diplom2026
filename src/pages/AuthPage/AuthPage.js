import React, { useState } from 'react';

const AuthPage = () => {
  const [mode, setMode] = useState('login');

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
            className={
              mode === 'login'
                ? 'auth-tabs__tab auth-tabs__tab--active'
                : 'auth-tabs__tab'
            }
            onClick={() => setMode('login')}
          >
            Вход
          </button>
          <button
            type="button"
            className={
              mode === 'register'
                ? 'auth-tabs__tab auth-tabs__tab--active'
                : 'auth-tabs__tab'
            }
            onClick={() => setMode('register')}
          >
            Регистрация
          </button>
        </div>

        {mode === 'login' ? (
          <div className="form-card">
            <h3 className="form-card__title">Вход</h3>
            <div className="form-card__fields">
              <div className="form-field">
                <label htmlFor="login-email">E-mail</label>
                <input id="login-email" type="email" className="input" />
              </div>
              <div className="form-field">
                <label htmlFor="login-password">Пароль</label>
                <input id="login-password" type="password" className="input" />
              </div>
            </div>
            <button type="button" className="btn btn--primary auth-page__btn-main">
              Войти
            </button>
          </div>
        ) : (
          <div className="form-card">
            <h3 className="form-card__title">Регистрация</h3>
            <div className="form-card__fields">
              <div className="form-field">
                <label htmlFor="register-name">Имя</label>
                <input id="register-name" type="text" className="input" />
              </div>
              <div className="form-field">
                <label htmlFor="register-email">E-mail</label>
                <input id="register-email" type="email" className="input" />
              </div>
              <div className="form-field">
                <label htmlFor="register-password">Пароль</label>
                <input id="register-password" type="password" className="input" />
              </div>
            </div>
            <button type="button" className="btn btn--primary auth-page__btn-main">
              Создать аккаунт
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

