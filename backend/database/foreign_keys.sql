-- Добавление связей между таблицами (Foreign Keys)
-- Выполните этот скрипт в phpMyAdmin для установки связей

-- Связь: orders.user_id -> users.id
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_user 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE SET NULL;

-- Связь: order_items.order_id -> orders.id
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_order 
FOREIGN KEY (order_id) REFERENCES orders(id) 
ON DELETE CASCADE;

-- Связь: order_items.product_id -> products.id
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_product 
FOREIGN KEY (product_id) REFERENCES products(id) 
ON DELETE SET NULL;

-- Связь: products.category_id -> categories.id
ALTER TABLE products 
ADD CONSTRAINT fk_products_category 
FOREIGN KEY (category_id) REFERENCES categories(id) 
ON DELETE SET NULL;
