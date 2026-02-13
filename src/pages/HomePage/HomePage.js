import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__subtitle">Онлайн‑студия воздушных композиций</p>
          <h2 className="hero__title">Создаём атмосферу праздника из шариков 🎈</h2>
          <p className="hero__text">
            Подбор композиции под ваш бюджет и повод, быстрая доставка по городу и
            тёплый сервис, о котором хочется рассказывать друзьям.
          </p>
          <div className="hero__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate('/catalog')}
            >
              Подобрать композицию
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/catalog')}
            >
              Смотреть каталог
            </button>
          </div>
          <ul className="hero__benefits">
            <li>Гарантия свежих и ярких шаров</li>
            <li>Бережная доставка ко времени</li>
            <li>Индивидуальный дизайн под ваш праздник</li>
          </ul>
        </div>
        <div className="hero__visual">
          <div className="hero__bubble hero__bubble--main" />
          <div className="hero__bubble hero__bubble--secondary" />
          <div className="hero__bubble hero__bubble--accent" />
        </div>
      </section>

      <section className="home-sections">
        <div className="home-section">
          <h3 className="home-section__title">Поводы для праздника</h3>
          <div className="home-section__chips">
            <span className="home-section__chip">День рождения</span>
            <span className="home-section__chip">Свадьба</span>
            <span className="home-section__chip">Выписка из роддома</span>
            <span className="home-section__chip">Детский праздник</span>
          </div>
        </div>

        <div className="home-section">
          <h3 className="home-section__title">Популярные композиции</h3>
          <p className="home-section__subtitle">
            То, что чаще всего выбирают для тёплых семейных и атмосферных праздников.
          </p>
          <div className="home-section__grid">
            <div className="home-card">
              <p className="home-card__title">«Нежный букет»</p>
              <p className="home-card__text">Пастельные оттенки, аккуратные связки, мягкий свет.</p>
            </div>
            <div className="home-card">
              <p className="home-card__title">«Розовое облако»</p>
              <p className="home-card__text">Для фотозон и уголков с тортом и подарками.</p>
            </div>
            <div className="home-card">
              <p className="home-card__title">«Фиолетовый вечер»</p>
              <p className="home-card__text">Глубокие фиолетовые оттенки с акцентом на свече.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
