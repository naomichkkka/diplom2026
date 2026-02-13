import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { API_ROOT } from '../../services/api';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const panning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

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
    try { containerRef.current.setPointerCapture(e.pointerId); } catch (err) {}
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
    try { containerRef.current.releasePointerCapture(e.pointerId); } catch (err) {}
  };

  useEffect(() => {
    let mounted = true;
    if (id) {
      fetchProductById(id).then(data => {
        if (mounted) {
          setProduct(data);
          setLoading(false);
        }
      });
    }
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && modalOpen) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  if (loading) {
    return (
      <div className="page product-page">
        <h2>Загрузка товара...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page product-page">
        <h2>Товар не найден</h2>
      </div>
    );
  }

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
          {product.image_path || product.image ? (
            <img
              className="product-page__photo product-page__photo--main"
              src={`${API_ROOT}/uploads/products/${product.image_path || product.image}`}
              alt={product.name}
              onClick={() => setModalOpen(true)}
              style={{ cursor: 'zoom-in' }}
            />
          ) : (
            <div className="product-page__photo product-page__photo--main" />
          )}
        </div>

        <div className="product-page__info">
          <div className="product-page__card">
            <div className="product-page__price-block">
              <span className="product-page__price">{product.price} ₽</span>
              <span className="product-page__note">за композицию на фото</span>
            </div>
            <button
              type="button"
              className="btn btn--primary product-page__btn-main"
              onClick={() => {
                addItem({ id: product.id, name: product.name, price: product.price, qty: 1 });
                showToast('Товар добавлен в корзину');
              }}
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
        </div>
      </div>
        {modalOpen && (
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
                src={`${API_ROOT}/uploads/products/${product.image_path || product.image}`}
                alt={product.name}
                style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                draggable={false}
                onDoubleClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductPage;

