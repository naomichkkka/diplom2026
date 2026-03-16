<?php
/**
 * Скрипт для добавления связей между таблицами
 * Запустить: http://localhost/sharlandia1/backend/routes/setup_foreign_keys.php
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h1>Настройка связей между таблицами</h1>";

$host = 'localhost';
$db   = 'sharlandia';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $queries = [
        "ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL" 
            => "orders.user_id → users.id",
        "ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE" 
            => "order_items.order_id → orders.id",
        "ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL" 
            => "order_items.product_id → products.id",
        "ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL" 
            => "products.category_id → categories.id"
    ];
    
    foreach ($queries as $sql => $desc) {
        try {
            $pdo->exec($sql);
            echo "<p style='color:green'>✓ Добавлена связь: $desc</p>";
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'Duplicate')) {
                echo "<p style='color:orange'>⏩ Связь уже существует: $desc</p>";
            } else {
                echo "<p style='color:red'>✗ Ошибка ($desc): " . $e->getMessage() . "</p>";
            }
        }
    }
    
    echo "<h2 style='color:green'>Готово!</h2>";
    echo "<p><a href='../index.html'>Вернуться на главную</a></p>";
    
} catch (PDOException $e) {
    echo "<p style='color:red'>Ошибка подключения: " . $e->getMessage() . "</p>";
}
