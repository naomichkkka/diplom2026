<?php
$host = 'localhost';
$db = 'sharlandia';
$user = 'root';
$pass = '';

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "<pre>=== Добавление PRIMARY KEY где нужно ===\n\n";

// Проверка/добавление PRIMARY KEY для categories
try {
    $pdo->query("ALTER TABLE categories MODIFY id INT NOT NULL AUTO_INCREMENT");
    $pdo->query("ALTER TABLE categories ADD PRIMARY KEY (id)");
    echo "OK: categories - добавлен PRIMARY KEY\n";
} catch (Exception $e) {
    echo "categories: " . $e->getMessage() . "\n";
}

// Проверка/добавление PRIMARY KEY для order_items
try {
    $pdo->query("ALTER TABLE order_items MODIFY id INT NOT NULL AUTO_INCREMENT");
    $pdo->query("ALTER TABLE order_items ADD PRIMARY KEY (id)");
    echo "OK: order_items - добавлен PRIMARY KEY\n";
} catch (Exception $e) {
    echo "order_items: " . $e->getMessage() . "\n";
}

echo "\n=== Добавление FOREIGN KEY ===\n\n";

// Теперь добавляем связи
$links = [
    ["orders", "user_id", "users", "id"],
    ["order_items", "order_id", "orders", "id"],
    ["order_items", "product_id", "products", "id"],
    ["products", "category_id", "categories", "id"]
];

foreach ($links as $link) {
    list($tbl, $col, $refTbl, $refCol) = $link;
    $fkName = "fk_{$tbl}_{$col}";
    $sql = "ALTER TABLE $tbl ADD CONSTRAINT $fkName FOREIGN KEY ($col) REFERENCES $refTbl($refCol) ON DELETE SET NULL";
    try {
        $pdo->exec($sql);
        echo "OK: $tbl.$col -> $refTbl.$refCol\n";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate') !== false || strpos($e->getMessage(), 'already exists') !== false) {
            echo "SKIP: $tbl.$col -> $refTbl.$refCol (уже есть)\n";
        } else {
            echo "FAIL: $tbl.$col -> $refTbl.$refCol - " . $e->getMessage() . "\n";
        }
    }
}

echo "\n=== Готово ===\n";
