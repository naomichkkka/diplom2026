<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../app/Services/Database.php';
require_once __DIR__ . '/../app/Controllers/ProductController.php';
require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/OrderController.php';
require_once __DIR__ . '/../app/Controllers/UserController.php';

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
        if ($method === 'POST') {
            $ctrl->store();
            exit;
        }
        if ($method === 'PUT' && $id) {
            $ctrl->update($id);
            exit;
        }
        if ($method === 'DELETE' && $id) {
            $ctrl->delete($id);
            exit;
        }
    }

    if ($resource === 'auth') {
        $ctrl = new AuthController($conn);
        if ($method === 'POST') {
            $action = isset($_GET['action']) ? $_GET['action'] : 'login';
            if ($action === 'register') {
                $ctrl->register();
            } else {
                $ctrl->login();
            }
            exit;
        }
    }

    if ($resource === 'orders') {
        $ctrl = new OrderController($conn);
        if ($method === 'GET') {
            if ($id) {
                $ctrl->show($id);
                exit;
            }
            $ctrl->index();
            exit;
        }
        if ($method === 'POST') {
            $ctrl->create();
            exit;
        }
        if ($method === 'PUT' && $id) {
            $ctrl->update($id);
            exit;
        }
        if ($method === 'DELETE' && $id) {
            $ctrl->delete($id);
            exit;
        }
    }

    if ($resource === 'users') {
        $ctrl = new UserController($conn);
        if ($method === 'GET') {
            if ($id) {
                $ctrl->show($id);
                exit;
            }
            $ctrl->index();
            exit;
        }
        if ($method === 'PUT' && $id) {
            $ctrl->update($id);
            exit;
        }
        if ($method === 'DELETE' && $id) {
            $ctrl->delete($id);
            exit;
        }
    }

    // Backwards compatible default: return products list
    $ctrl = new ProductController($conn);
    $ctrl->index();

} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
