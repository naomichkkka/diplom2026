import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const benefits = [
    {
      icon: '🎈',
      title: 'Свежесть',
      description: 'Все шары надуваются непосредственно перед доставкой'
    },
    {
      icon: '🚚',
      title: 'Быстрая доставка',
      description: 'Доставим заказ в удобное для вас время'
    },
    {
      icon: '✨',
      title: 'Индивидуальный подход',
      description: 'Создаём уникальные композиции под любой праздник'
    },
    {
      icon: '💯',
      title: 'Гарантия качества',
      description: 'Используем только сертифицированные материалы'
    }
  ];

  return (
    <div className="page about-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">О компании Шарландия</h2>
          <p className="page__subtitle">
            Мы создаём радость и волшебство для ваших праздников уже более 12 лет
          </p>
        </div>
      </header>

      <div className="about-page__content">
        <section className="about-page__hero">
          <div className="about-page__hero-text">
            <h3>Магия в каждом шаре</h3>
            <p>
              Шарландия — это команда профессионалов, которые превращают обычные праздники 
              в незабываемые события. Мы верим, что каждый день может быть особенным, 
              и помогаем вам создавать волшебные моменты для себя и близких.
            </p>
            <p>
              Наш магазин предлагает широкий выбор воздушных шаров, праздничных композиций 
              и декора для любых мероприятий: дней рождения, свадеб, корпоративов и просто 
              для хорошего настроения.
            </p>
            <Link to="/catalog" className="btn btn--primary">
              Перейти в каталог
            </Link>
          </div>
          <div className="about-page__hero-visual">
            <div className="about-page__bubble about-page__bubble--1"></div>
            <div className="about-page__bubble about-page__bubble--2"></div>
            <div className="about-page__bubble about-page__bubble--3"></div>
          </div>
        </section>

        <section className="about-page__benefits">
          <h3 className="about-page__section-title">Почему выбирают нас?</h3>
          <div className="about-page__benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="about-page__benefit">
                <div className="about-page__benefit-icon">{benefit.icon}</div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-page__stats">
          <h3 className="about-page__stats-title">На счету компании более:</h3>
          <div className="about-page__stats-grid">
            <div className="about-page__stat">
              <span className="about-page__stat-number">6.000</span>
              <span className="about-page__stat-label">довольных клиентов</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-number">1.200</span>
              <span className="about-page__stat-label">мероприятий</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-number">30.000</span>
              <span className="about-page__stat-label">видов шаров</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-number">12</span>
              <span className="about-page__stat-label">лет опыта</span>
            </div>
          </div>
        </section>

        <section className="about-page__cta">
          <h3>Готовы впустить в свой дом праздник?</h3>
          <p>Загляните в наш каталог или свяжитесь с нами для индивидуального заказа</p>
          <div className="about-page__cta-buttons">
            <Link to="/catalog" className="btn btn--primary">Каталог</Link>
            <Link to="/contacts" className="btn btn--ghost">Контакты</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
