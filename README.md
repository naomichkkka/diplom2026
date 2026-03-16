#  Sharlandia — каталог интернет-магазина воздушных шаров

## Макет:
https://www.figma.com/design/EwT2mRX99An8cuN4A6u9lU/Untitled?node-id=0-1&t=jqZTLhVHJdyKkgc0-1

##  Описание проекта
Sharlandia — это веб-приложение каталога интернет-магазина воздушных шаров.
Проект предназначен для демонстрации работы с клиент–серверной архитектурой,
базой данных, REST API и современным frontend-фреймворком.

Приложение позволяет:
- просматривать каталог товаров с фильтрацией по категориям;
- просматривать детальную информацию о товаре с зумом изображений;
- добавлять товары в корзину и управлять количеством;
- оформлять заказы (создание, сохранение в localStorage);
- регистрироваться и входить в личный кабинет;
- просматривать историю заказов в профиле;
- управлять товарами в админ-панели (добавление, редактирование, удаление).

---

##  Используемый стек технологий

### Frontend:
- React (Hooks, Context API)
- JavaScript (ES6+)
- HTML5, CSS3
- Fetch API

### Backend:
- PHP
- MySQL

### Архитектура:
- **Слой данных (Data Layer)**: `src/services/api.js`, `src/data/mockData.js`
- **Слой бизнес-логики (Business Logic)**: `src/hooks/` (useProducts, useAuth, useOrders)
- **Слой представления (UI)**: `src/pages/`, `src/components/`

---

## 🏗 Архитектура проекта

Проект реализован по принципам чистой архитектуры:

```
src/
├── data/              # Mock-данные для fallback
│   └── mockData.js
├── hooks/             # Бизнес-логика (Custom Hooks)
│   ├── useProducts.js # Работа с товарами
│   ├── useAuth.js     # Аутентификация
│   ├── useOrders.js   # Заказы
│   └── index.js
├── services/          # Слой доступа к данным
│   └── api.js
├── context/           # React Context (глобальное состояние)
│   ├── CartContext.js
│   └── ToastContext.js
├── components/        # Переиспользуемые UI-компоненты
├── pages/             # Страницы приложения
└── styles/            # Стили
```

### Взаимодействие слоёв:
1. **UI (Компоненты)** → вызывает **Hooks** (бизнес-логика)
2. **Hooks** → использует **API сервисы** для запросов к бэкенду
3. **API сервисы** → при ошибке используют **mock-данные** как fallback

---

## 📋 Реализованный функционал

### Каталог товаров
- Загрузка товаров с API
- Автоматическое извлечение категорий
- Фильтрация по категориям
- Отображение популярных товаров
- Состояния: загрузка, ошибка, пустой каталог

### Карточка товара
- Детальная информация о товаре
- Зум изображения с управлением колесом мыши и перетаскиванием
- Добавление в корзину с уведомлением
- Категория товара

### Корзина
- Добавление/удаление товаров
- Изменение количества
- Сохранение в localStorage
- Оформление заказа (только для авторизованных)
- Подтверждение успешного заказа
- Пустая корзина — приглашение в каталог

### Аутентификация
- Вход по email/password
- Регистрация нового пользователя
- Сохранение сессии в localStorage
- Защищённые маршруты (profile, admin)
- Демо-режим: admin@sharlandia.ru / admin

### Личный кабинет
- Просмотр профиля пользователя
- История заказов со статусами
- Вкладки: заказы, настройки
- Выход из аккаунта

### Админ-панель
- Управление товарами (CRUD)
- Поиск по названию/категории
- Модальное окно добавления/редактирования
- Удаление товаров
- Переключение статуса "популярный"
- Просмотр заказов и пользователей

### Уведомления (Toast)
- Успешные операции (зелёный)
- Ошибки (красный)
- Автоматическое скрытие

---

## ✅ Лабораторная работа №4

### Выполненные задачи

1. **Развитие программной реализации**
   - Реализованы все ключевые пользовательские сценарии
   - Обеспечено корректное взаимодействие всех слоёв приложения

2. **Реализация логики работы с данными**
   - Слой данных: `services/api.js` с изоляцией сетевых запросов
   - Подключение к MySQL базе данных
   - Fallback на mock-данные при недоступности API
   - Обработка состояний: загрузка, успех, ошибка

3. **Соблюдение архитектурных принципов**
   - Трёхуровневая архитектура: UI → Business Logic → Data
   - Изоляция слоёв через Custom Hooks
   - Context API для глобального состояния
   - Читаемый и расширяемый код
   - CORS заголовки для PUT/DELETE запросов

4. **Связывание слоёв**
   - UI компоненты используют хуки бизнес-логики
   - Хуки используют API-сервисы для работы с данными
   - При ошибках API автоматически используются mock-данные

5. **Админ-панель**
   - Управление товарами (CRUD с сохранением в БД)
   - Управление заказами (просмотр, изменение статуса)
   - Управление пользователями (просмотр, изменение роли)

### Пользовательские сценарии
1. Просмотр каталога → фильтрация по категориям → выбор товара
2. Добавление в корзину → оформление заказа
3. Регистрация/вход → личный кабинет → история заказов
4. Вход как админ → админ-панель → управление контентом

---

## 🚀 Установка и запуск

### Backend

1. Установить XAMPP
2. Скопировать папку `backend` в `C:\xampp\htdocs\sharlandia1\`
3. Запустить Apache и MySQL
4. Создать базу данных `sharlandia` в phpMyAdmin
5. Создать таблицы: `users`, `products`, `categories`, `orders`, `order_items`

#### Структура таблиц

```sql
-- users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'manager', 'admin') DEFAULT 'user',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    image_path VARCHAR(255),
    is_popular TINYINT(1) DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(150),
    delivery_address TEXT,
    delivery_method VARCHAR(50),
    payment_method VARCHAR(50),
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- order_items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend будет доступен по адресу: http://localhost:3000

### Сборка проекта (frontend)

```bash
npm run build
```

---

## 🔑 API Endpoints

| Метод | Ресурс | Описание |
|-------|--------|----------|
| GET | `/api.php?resource=products` | Получить все товары |
| GET | `/api.php?resource=products&id={id}` | Получить товар по ID |
| POST | `/api.php?resource=auth` | Вход/регистрация |
| POST | `/api.php?resource=orders` | Создать заказ |
| GET | `/api.php?resource=orders` | Получить заказы |

---

## 📝 История коммитов

- `feat: добавить слой данных (api.js, mockData.js)` — Изоляция работы с данными
- `feat: добавить хуки бизнес-логики (useProducts, useAuth, useOrders)` — Слой бизнес-логики
- `refactor: обновить страницы с использованием хуков` — Интеграция слоёв
- `feat: добавить управление товарами в админ-панели` — CRUD операции
- `feat: добавить стили для состояний загрузки и ошибок` — UX улучшения
- `docs: обновить README с документацией архитектуры` — Документация
- `feat: подключить MySQL базу данных` — Реальные данные вместо mock
- `feat: добавить CORS заголовки для PUT/DELETE` — Исправление跨域 запросов
- `feat: реализовать управление заказами и пользователями в админ-панели` — Полный CRUD
- `feat: реализовать основную функциональность приложения (ЛР-4)` — Полная интеграция UI с бизнес-логикой