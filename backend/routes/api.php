<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../app/Services/Database.php';

$db = new Database();
$conn = $db->connect();

try {
    $stmt = $conn->query("
        SELECT p.id, p.name, p.price, p.description, c.name AS category 
        FROM products p 
        JOIN categories c ON p.category_id = c.id
    ");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products, JSON_UNESCAPED_UNICODE);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
