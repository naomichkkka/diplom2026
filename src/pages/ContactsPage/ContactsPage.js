import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

const ContactsPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      showToast('Заполните обязательные поля', { type: 'error' });
      return;
    }

    setSending(true);
    
    // Имитация отправки (заменю на запрос на сервер)
    setTimeout(() => {
      showToast('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', { type: 'success' });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSending(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page contacts-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">Контакты</h2>
          <p className="page__subtitle">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>
      </header>

      <div className="contacts-page__content">
        <div className="contacts-page__info">
          <div className="contacts-page__card">
            <div className="contacts-page__card-icon">📍</div>
            <h4>Адрес</h4>
            <p>г. Барнаул, ул. Шумакова, д. 14</p>
            <p>Ежедневно с 9:00 до 21:00</p>
          </div>

          <div className="contacts-page__card">
            <div className="contacts-page__card-icon">📞</div>
            <h4>Телефон</h4>
            <p><a href="tel:+79001234567">+7 (962) 814-24-28</a></p>
            <p><a href="tel:+74951234567">+7 (963) 533-28-58</a></p>
          </div>

          <div className="contacts-page__card">
            <div className="contacts-page__card-icon">✉️</div>
            <h4>Email</h4>
            <p><a href="mailto:sharik22@mail.ru">sharik22@mail.ru</a></p>
            <p>ordersharik22@mail.ru</p>
          </div>

          <div className="contacts-page__card">
            <div className="contacts-page__card-icon">📱</div>
            <h4>Соцсети</h4>
            <div className="contacts-page__social">
              <a href="#" className="contacts-page__social-link">VK</a>
              <a href="#" className="contacts-page__social-link">Telegram</a>
              <a href="#" className="contacts-page__social-link">Instagram</a>
              <a href="#" className="contacts-page__social-link">Max</a>
            </div>
          </div>
        </div>

        <div className="contacts-page__form-section">
          <h3>Напишите нам</h3>
          <p>Есть вопросы или нужна консультация? Заполните форму и мы ответим!</p>
          
          <form className="contacts-page__form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Имя *</label>
              <input
                id="name"
                name="name"
                type="text"
                className="input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                required
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.ru"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="phone">Телефон</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="message">Сообщение *</label>
              <textarea
                id="message"
                name="message"
                className="input"
                value={formData.message}
                onChange={handleChange}
                placeholder="Ваше сообщение..."
                rows={5}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={sending}
            >
              {sending ? 'Отправка...' : 'Отправить сообщение'}
            </button>
          </form>
        </div>

        <div className="contacts-page__map">
          <iframe 
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Aab1717f4dc4b0dcf7d601743715454edde812daefad57322acecf1f13050954e&amp;source=constructor" 
            width="100%" 
            height="500" 
            frameBorder="0"
            title="Карта проезда"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
