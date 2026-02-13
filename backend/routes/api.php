<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../app/Services/Database.php';
require_once __DIR__ . '/../app/Controllers/ProductController.php';
require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/OrderController.php';

$db = new Database();
$conn = $db->connect();

$method = $_SERVER['REQUEST_METHOD'];
$resource = isset($_GET['resource']) ? $_GET['resource'] : null;
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

try {
    if ($resource === 'products') {
        $ctrl = new ProductController($conn);
        if ($method === 'GET') {
            if ($id) {
                $ctrl->show($id);
                exit;
            }
            $ctrl->index();
            exit;
        }
    }

    if ($resource === 'auth') {
        $ctrl = new AuthController($conn);
        if ($method === 'POST') {
            $ctrl->login();
            exit;
        }
    }

    if ($resource === 'orders') {
        $ctrl = new OrderController($conn);
        if ($method === 'POST') {
            $ctrl->create();
            exit;
        }
    }

    // Backwards compatible default: return products list
    $ctrl = new ProductController($conn);
    $ctrl->index();

} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
