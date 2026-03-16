<?php

require_once __DIR__ . '/../Models/Order.php';

class OrderController {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function index()
    {
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        $order = new Order($this->conn);
        $data = $order->all($userId);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function show($id)
    {
        $order = new Order($this->conn);
        $data = $order->find($id);
        if (!$data) {
            http_response_code(404);
            echo json_encode(["error" => "Order not found"], JSON_UNESCAPED_UNICODE);
            return;
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function create()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Требуются товары'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Если user_id передан, используем его, иначе создаём для гостя
        $userId = $input['user_id'] ?? 1; // для демо используем id=1

        try {
            $order = new Order($this->conn);
            $orderId = $order->create([
                'user_id' => $userId,
                'total' => $input['total'] ?? 0,
                'items' => $input['items']
            ]);

            echo json_encode([
                'ok' => true, 
                'order' => [
                    'id' => $orderId,
                    'status' => 'pending',
                    'total' => $input['total'] ?? 0,
                    'items' => $input['items']
                ]
            ], JSON_UNESCAPED_UNICODE);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка при создании заказа'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Требуется статус'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $order = new Order($this->conn);
        $order->updateStatus($id, $input['status']);
        
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }

    public function delete($id)
    {
        $order = new Order($this->conn);
        $order->delete($id);
        
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }
}
