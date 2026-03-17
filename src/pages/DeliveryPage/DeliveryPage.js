import React from 'react';
import { Link } from 'react-router-dom';

const DeliveryPage = () => {
  const deliveryMethods = [
    {
      title: 'Самовывоз',
      price: 'Бесплатно',
      time: 'В любое время',
      description: 'Заберите заказ самостоятельно из нашего магазина',
      icon: '🏪'
    },
    {
      title: 'Курьерская доставка',
      price: 'от 300 ₽',
      time: 'В течение дня',
      description: 'Доставим заказ прямо до двери в удобное время',
      icon: '🚚'
    },
    {
      title: 'Доставка по краю',
      price: 'от 800 ₽',
      time: 'В течение дня',
      description: 'Отправим заказ лично или компание в любое место края',
      icon: '📦'
    }
  ];

  const paymentMethods = [
    { title: 'Наличными при получении', icon: '💵' },
    { title: 'Банковской картой', icon: '💳' },
    { title: 'Онлайн перевод', icon: '📱' },
    { title: 'Безналичный расчёт (для юрлиц)', icon: '🏢' }
  ];

  const faq = [
    {
      question: 'Как быстро доставят заказ?',
      answer: 'Самовывоз — в день заказа. Курьерская доставка по Москве — 1-2 дня. Доставка по России — 3-7 дней в зависимости от региона.'
    },
    {
      question: 'Можно ли заказать доставку к определённому времени?',
      answer: 'Да, при оформлении заказа вы можете указать удобное время доставки. Мы постараемся учесть ваши пожелания.'
    },
    {
      question: 'Сколько хранятся шары?',
      answer: 'Латексные шары держатся 3-5 дней, фольгированные — до 2 недель. Мы используем специальный состав для продления срока службы.'
    },
    {
      question: 'Есть ли минимальная сумма заказа?',
      answer: 'Минимальная сумма заказа для доставки — 2000 ₽. Для самовывоза ограничений нет.'
    },
    {
      question: 'Отменяется ли заказ при форс-мажоре?',
      answer: 'Да, в случае плохой погоды (сильный ветер, дождь) мы свяжемся с вами для переноса доставки или полного возврата средств.'
    }
  ];

  return (
    <div className="page delivery-page">
      <header className="page__header">
        <div>
          <h2 className="page__title">Доставка и оплата</h2>
          <p className="page__subtitle">
            Условия доставки и способы оплаты в магазине Sharlandia
          </p>
        </div>
      </header>

      <div className="delivery-page__content">
        <section className="delivery-page__methods">
          <h3>Способы доставки</h3>
          <div className="delivery-page__methods-grid">
            {deliveryMethods.map((method, index) => (
              <div key={index} className="delivery-page__method">
                <div className="delivery-page__method-icon">{method.icon}</div>
                <h4>{method.title}</h4>
                <p className="delivery-page__method-price">{method.price}</p>
                <p className="delivery-page__method-time">{method.time}</p>
                <p className="delivery-page__method-desc">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="delivery-page__payment">
          <h3>Способы оплаты</h3>
          <div className="delivery-page__payment-grid">
            {paymentMethods.map((method, index) => (
              <div key={index} className="delivery-page__payment-item">
                <span className="delivery-page__payment-icon">{method.icon}</span>
                <span>{method.title}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="delivery-page__faq">
          <h3>Частые вопросы</h3>
          <div className="delivery-page__faq-list">
            {faq.map((item, index) => (
              <details key={index} className="delivery-page__faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="delivery-page__cta">
          <h3>Остались вопросы?</h3>
          <p>Свяжитесь с нами — мы поможем!</p>
          <div className="delivery-page__cta-buttons">
            <Link to="/contacts" className="btn btn--primary">Контакты</Link>
            <Link to="/catalog" className="btn btn--ghost">В каталог</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeliveryPage;
