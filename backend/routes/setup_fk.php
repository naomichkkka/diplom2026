<?php
$host = 'localhost';
$db = 'sharlandia';
$user = 'root';
$pass = '';

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Проверка структуры таблиц
echo "<pre>=== Проверка структуры таблиц ===\n\n";

$tables = ['users', 'products', 'orders', 'order_items', 'categories'];
foreach ($tables as $table) {
    $stmt = $pdo->query("DESCRIBE $table");
    $cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "TABLE: $table\n";
    foreach ($cols as $col) {
        echo "  {$col['Field']} - {$col['Type']}\n";
    }
    echo "\n";
}

echo "=== Попытка добавить связи ===\n\n";

$links = [
    ["orders", "user_id", "users", "id"],
    ["order_items", "order_id", "orders", "id"],
    ["order_items", "product_id", "products", "id"],
    ["products", "category_id", "categories", "id"]
];

foreach ($links as $link) {
    list($tbl, $col, $refTbl, $refCol) = $link;
    $sql = "ALTER TABLE $tbl ADD FOREIGN KEY ($col) REFERENCES $refTbl($refCol) ON DELETE SET NULL";
    try {
        $pdo->exec($sql);
        echo "OK: $tbl.$col -> $refTbl.$refCol\n";
    } catch (Exception $e) {
        echo "FAIL: $tbl.$col -> $refTbl.$refCol - " . $e->getMessage() . "\n";
    }
}
