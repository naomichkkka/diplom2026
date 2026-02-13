<?php

class AuthController {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Простая заглушка логина — принимает JSON {email, password}
    public function login()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid payload'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Здесь должна быть проверка пользователя в базе и генерация токена.
        // На начальном этапе вернём заглушку.
        echo json_encode([
            'ok' => true,
            'user' => [
                'email' => $input['email'],
                'name' => 'Тестовый пользователь'
            ],
            'token' => 'mock-token-123'
        ], JSON_UNESCAPED_UNICODE);
    }
}
