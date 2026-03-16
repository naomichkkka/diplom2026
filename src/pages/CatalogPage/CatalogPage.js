import React, { useMemo } from 'react';
import { useProducts } from '../../hooks';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';

const CatalogPage = () => {
  const { products, categories, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = React.useState(null);

  const visibleProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter(item => item.category === activeCategory);
  }, [products, activeCategory]);

  // Состояние загрузки
  if (loading) {
    return (
      <section className="catalog">
        <div className="catalog__header">
          <h2 className="catalog__title">Каталог композиций</h2>
        </div>
        <div className="catalog__loading">
          <div className="loading-spinner"></div>
          <p>Загружаем каталог...</p>
        </div>
      </section>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <section className="catalog">
        <div className="catalog__header">
          <h2 className="catalog__title">Каталог композиций</h2>
        </div>
        <div className="catalog__error">
          <p>{error}</p>
          <button 
            className="btn btn--primary" 
            onClick={() => window.location.reload()}
          >
            Повторить попытку
          </button>
        </div>
      </section>
    );
  }

  // Пустой каталог
  if (!products.length) {
    return (
      <section className="catalog">
        <div className="catalog__header">
          <h2 className="catalog__title">Каталог композиций</h2>
          <p className="catalog__subtitle">
            В данный момент каталог пуст. Приходите позже!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog">
      <div className="catalog__header">
        <h2 className="catalog__title">Каталог композиций</h2>
        <p className="catalog__subtitle">
          Подберите готовую идею или вдохновитесь для собственного оформления.
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="catalog__grid">
        {visibleProducts.map(item => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            category={item.category}
            description={item.description}
            image={item.image_path || item.image}
            isPopular={Number(item.is_popular) || item.popular || item.isPopular || item.badge}
          />
        ))}
      </div>

      {visibleProducts.length === 0 && activeCategory && (
        <p className="catalog__empty">
          В категории «{activeCategory}» пока нет товаров
        </p>
      )}
    </section>
  );
};

export default CatalogPage;
