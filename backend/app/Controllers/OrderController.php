<?php

class OrderController {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Простая заглушка создания заказа — принимает JSON и возвращает подтверждение
    public function create()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid order payload'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // На этапе скелета — просто вернём mock-ответ
        $order = [
            'id' => rand(1000, 9999),
            'status' => 'created',
            'items' => $input['items']
        ];

        http_response_code(201);
        echo json_encode(['ok' => true, 'order' => $order], JSON_UNESCAPED_UNICODE);
    }
}
