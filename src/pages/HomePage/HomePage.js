import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../hooks';
import ProductCard from '../../components/ProductCard/ProductCard';
import { API_ROOT } from '../../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const { products, categories } = useProducts();

  // Популярные товары
  const popularProducts = products.filter(p => Number(p.is_popular)).slice(0, 4);

  const banners = [
    {
      title: 'Бесплатная доставка',
      subtitle: 'При заказе от 5000 ₽',
      color: '#ff9ecb',
      emoji: '🚚'
    },
    {
      title: 'Скидка 10%',
      subtitle: 'На первый заказ',
      color: '#c8b0ff',
      emoji: '🎁'
    },
    {
      title: 'Экспресс',
      subtitle: 'Доставка за 2 часа',
      color: '#ffd1a8',
      emoji: '⚡'
    }
  ];

  const features = [
    { icon: '🎈', title: 'Свежесть', desc: 'Надуваем перед доставкой' },
    { icon: '🚚', title: 'Доставка', desc: 'Ко времени, по городу' },
    { icon: '✨', title: 'Дизайн', desc: 'Под ваш праздник' },
    { icon: '💯', title: 'Гарантия', desc: 'Возврат или замена' }
  ];

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

      {/* Баннеры */}
      <section className="home-banners">
        {banners.map((banner, index) => (
          <div key={index} className="home-banner" style={{ background: banner.color }}>
            <span className="home-banner__emoji">{banner.emoji}</span>
            <div className="home-banner__text">
              <span className="home-banner__title">{banner.title}</span>
              <span className="home-banner__subtitle">{banner.subtitle}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Категории */}
      {categories.length > 0 && (
        <section className="home-section">
          <h3 className="home-section__title">Категории</h3>
          <div className="home-categories">
            {categories.slice(0, 6).map((cat, index) => (
              <button
                key={index}
                className="home-category"
                onClick={() => navigate('/catalog')}
              >
                <span className="home-category__icon">
                  {['💐', '🎉', '🏰', '🎈', '👸', '🎄'][index % 6]}
                </span>
                <span className="home-category__name">{cat}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Популярные товары */}
      {popularProducts.length > 0 && (
        <section className="home-section">
          <div className="home-section__header">
            <h3 className="home-section__title">Хиты продаж</h3>
            <button className="home-section__link" onClick={() => navigate('/catalog')}>
              Смотреть все →
            </button>
          </div>
          <p className="home-section__subtitle">
            То, что чаще всего выбирают для праздников.
          </p>
          <div className="home-products">
            {popularProducts.map(item => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                category={item.category}
                description={item.description}
                image={item.image_path}
                isPopular={Number(item.is_popular)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Преимущества */}
      <section className="home-features">
        {features.map((feature, index) => (
          <div key={index} className="home-feature">
            <span className="home-feature__icon">{feature.icon}</span>
            <span className="home-feature__title">{feature.title}</span>
            <span className="home-feature__desc">{feature.desc}</span>
          </div>
        ))}
      </section>

      {/* CTA секция */}
      <section className="home-cta">
        <div className="home-cta__content">
          <h3>Нужна консультация?</h3>
          <p>Не знаете, что выбрать? Наши специалисты помогут подобрать идеальную композицию!</p>
          <div className="home-cta__buttons">
            <Link to="/contacts" className="btn btn--primary">Связаться с нами</Link>
            <Link to="/catalog" className="btn btn--ghost">Выбрать в каталоге</Link>
          </div>
        </div>
      </section>

      {/* Поводы */}
      <section className="home-section">
        <h3 className="home-section__title">Поводы для праздника</h3>
        <div className="home-section__chips">
          <span className="home-section__chip">День рождения</span>
          <span className="home-section__chip">Свадьба</span>
          <span className="home-section__chip">Выписка из роддома</span>
          <span className="home-section__chip">Детский праздник</span>
          <span className="home-section__chip">Корпоратив</span>
          <span className="home-section__chip">Годовщина</span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
