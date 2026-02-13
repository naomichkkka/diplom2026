import React, { useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const unique = new Set();
    products.forEach(item => {
      if (item.category) {
        unique.add(item.category);
      }
    });
    return Array.from(unique);
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter(item => item.category === activeCategory);
  }, [products, activeCategory]);

  if (loading) {
    return (
      <section className="catalog">
        <h2 className="catalog__title">Каталог композиций</h2>
        <p className="catalog__subtitle">Загружаем каталог...</p>
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
            isPopular={item.is_popular || item.popular || item.isPopular || item.badge}
          />
        ))}
      </div>
    </section>
  );
};

export default CatalogPage;
