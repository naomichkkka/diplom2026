import React from 'react';

const CategoryFilter = ({ categories = [], activeCategory, onChange }) => {
  if (!categories.length) return null;

  return (
    <div className="category-filter">
      <button
        type="button"
        className={
          !activeCategory
            ? 'category-filter__chip category-filter__chip--active'
            : 'category-filter__chip'
        }
        onClick={() => onChange(null)}
      >
        Все композиции
      </button>
      {categories.map(category => (
        <button
          key={category}
          type="button"
          className={
            activeCategory === category
              ? 'category-filter__chip category-filter__chip--active'
              : 'category-filter__chip'
          }
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

