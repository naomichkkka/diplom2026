<?php
$host = 'localhost';
$db = 'sharlandia';
$user = 'root';
$pass = '';

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "<pre>=== Проверка движка таблиц ===\n\n";

$tables = ['users', 'products', 'orders', 'order_items', 'categories'];
foreach ($tables as $table) {
    $stmt = $pdo->query("SHOW TABLE STATUS WHERE Name = '$table'");
    $info = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "$table: Engine = " . ($info['Engine'] ?? 'unknown') . "\n";
}

echo "\n=== Конвертация в InnoDB ===\n\n";

foreach ($tables as $table) {
    try {
        $pdo->exec("ALTER TABLE $table ENGINE = InnoDB");
        echo "OK: $table -> InnoDB\n";
    } catch (Exception $e) {
        echo "FAIL: $table - " . $e->getMessage() . "\n";
    }
}

echo "\n=== Добавление FOREIGN KEY ===\n\n";

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
            echo "SKIP: $tbl.$col -> $refTbl.$refCol (already exists)\n";
        } else {
            echo "FAIL: $tbl.$col -> $refTbl.$refCol - " . $e->getMessage() . "\n";
        }
    }
}

echo "\n=== Проверка связей ===\n\n";
$stmt = $pdo->query("SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = '$db' AND REFERENCED_TABLE_NAME IS NOT NULL");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "{$row['TABLE_NAME']}.{$row['COLUMN_NAME']} -> {$row['REFERENCED_TABLE_NAME']}.{$row['REFERENCED_COLUMN_NAME']}\n";
}

echo "\n=== Готово ===\n";
