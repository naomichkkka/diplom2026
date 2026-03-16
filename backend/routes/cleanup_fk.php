<?php
$host = 'localhost';
$db = 'sharlandia';
$user = 'root';
$pass = '';

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "<pre>=== Удаление дублирующихся связей ===\n\n";

// Получаем все связи
$stmt = $pdo->query("SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = '$db' AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME");

$seen = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $key = $row['TABLE_NAME'] . '.' . $row['COLUMN_NAME'];
    if (isset($seen[$key])) {
        echo "Удаляем дубликат: {$row['CONSTRAINT_NAME']} ($key)\n";
        try {
            $pdo->exec("ALTER TABLE {$row['TABLE_NAME']} DROP FOREIGN KEY {$row['CONSTRAINT_NAME']}");
            echo "  OK\n";
        } catch (Exception $e) {
            echo "  FAIL: " . $e->getMessage() . "\n";
        }
    } else {
        $seen[$key] = true;
    }
}

echo "\n=== Итог ===\n";
$stmt = $pdo->query("SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = '$db' AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "{$row['TABLE_NAME']}.{$row['COLUMN_NAME']} -> {$row['REFERENCED_TABLE_NAME']}.id\n";
}
echo "\nГотово!\n";
