<?php
// backend/scripts/seed_images.php
// Заполнит поле image_path для тестовых товаров (ids 1..3) и проверит наличие файлов

require_once __DIR__ . '/../Services/Database.php';

$db = new Database();
$conn = $db->connect();

$map = [
    1 => 'ball-bouquet.svg',
    2 => 'birthday-set.svg',
    3 => 'purple-evening.svg'
];

$uploadsDir = __DIR__ . '/../../uploads/products/';

foreach ($map as $id => $file) {
    $path = realpath($uploadsDir . $file);
    if (!$path) {
        echo "File not found for product $id: $file\n";
        continue;
    }

    $stmt = $conn->prepare("UPDATE products SET image_path = :img WHERE id = :id");
    $stmt->bindValue(':img', $file);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    try {
        $stmt->execute();
        echo "Updated product $id -> $file\n";
    } catch (PDOException $e) {
        echo "DB error for product $id: " . $e->getMessage() . "\n";
    }
}

echo "Done.\n";
