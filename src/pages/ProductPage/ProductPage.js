import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { API_ROOT } from '../../services/api';

const ProductPage = () => {
  const { id } = useParams();
  const { getProductById, products: allProducts, loading: productsLoading } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { showToast } = useToast();
  
  // Состояния для модального окна с зумом
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const panning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Загрузка товара
  useEffect(() => {
    let mounted = true;
    
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Сначала проверяем кэш
        const cached = allProducts.find(p => p.id === Number(id));
        if (cached) {
          setProduct(cached);
          setLoading(false);
          return;
        }
        
        // Загружаем через хук
        const data = await getProductById(id);
        if (mounted) {
          if (data) {
            setProduct(data);
          } else {
            setError('Товар не найден');
          }
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Ошибка при загрузке товара');
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }
    
    return () => { mounted = false; };
  }, [id, getProductById, allProducts]);

  // Управление body при открытии модального окна
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  // Обработка клавиши Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && modalOpen) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  // Функции управления зумом
  const closeModal = () => {
    setModalOpen(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(z => Math.min(4, Math.max(1, +(z + delta).toFixed(3))));
  };

  const onPointerDown = (e) => {
    panning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    try { containerRef.current?.setPointerCapture(e.pointerId); } catch (err) {}
  };

  const onPointerMove = (e) => {
    if (!panning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
  };

  const onPointerUp = (e) => {
    panning.current = false;
    try { containerRef.current?.releasePointerCapture(e.pointerId); } catch (err) {}
  };

  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price,
      image: product.image_path || product.image,
      qty: 1 
    });
    showToast('Товар добавлен в корзину');
  };

  // Состояние загрузки
  if (loading || productsLoading) {
    return (
      <div className="page product-page">
        <div className="product-page__loading">
          <div className="loading-spinner"></div>
          <p>Загрузка товара...</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="page product-page">
        <div className="product-page__error">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button 
            className="btn btn--primary" 
            onClick={() => window.history.back()}
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  // Товар не найден
  if (!product) {
    return (
      <div className="page product-page">
        <h2>Товар не найден</h2>
      </div>
    );
  }

  const imageUrl = product.image_path || product.image
    ? `${API_ROOT}/uploads/products/${product.image_path || product.image}`
    : null;

  return (
    <div className="page product-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">{product.name}</h2>
          <p className="page__subtitle">{product.subtitle || ''}</p>
        </div>
      </header>

      <div className="product-page__layout">
        <div className="product-page__gallery">
          {imageUrl ? (
            <img
              className="product-page__photo product-page__photo--main"
              src={imageUrl}
              alt={product.name}
              onClick={() => setModalOpen(true)}
              style={{ cursor: 'zoom-in' }}
            />
          ) : (
            <div className="product-page__photo product-page__photo--main product-page__photo--placeholder">
              <span>Нет изображения</span>
            </div>
          )}
        </div>

        <div className="product-page__info">
          <div className="product-page__card">
            <div className="product-page__price-block">
              <span className="product-page__price">{Number(product.price).toLocaleString('ru-RU')} ₽</span>
              <span className="product-page__note">за композицию на фото</span>
            </div>
            <button
              type="button"
              className="btn btn--primary product-page__btn-main"
              onClick={handleAddToCart}
            >
              В корзину
            </button>
            <button type="button" className="btn btn--ghost product-page__btn-secondary">
              Быстрый заказ
            </button>
            <p className="product-page__hint">Оплата онлайн или при получении, доставка ко времени.</p>
          </div>

          <section className="product-page__section">
            <h3 className="product-page__section-title">Описание</h3>
            <p className="product-page__description">{product.description}</p>
          </section>

          {product.category && (
            <section className="product-page__section">
              <h3 className="product-page__section-title">Категория</h3>
              <span className="product-category-badge">{product.category}</span>
            </section>
          )}
        </div>
      </div>

      {/* Модальное окно с зумом */}
      {modalOpen && imageUrl && (
        <div className="product-zoom-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <button className="product-zoom-close" type="button" onClick={closeModal} aria-label="Закрыть">✕</button>
          <div
            className="product-zoom-container"
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            ref={containerRef}
          >
            <img
              className="product-zoom-image"
              src={imageUrl}
              alt={product.name}
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
              draggable={false}
              onDoubleClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            />
          </div>
          <div className="product-zoom-hint">
            Колесо мыши — зум, перетаскивание — панорамирование, двойной клик — сброс
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

