<?php

class AuthController {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Вход пользователя
    public function login()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['email']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Требуется email и пароль'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $email = trim($input['email']);
        $password = $input['password'];

        try {
            $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
            $stmt->bindValue(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Неверный email или пароль'], JSON_UNESCAPED_UNICODE);
                return;
            }

            // Успешный вход
            echo json_encode([
                'ok' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'phone' => $user['phone'],
                    'address' => $user['address']
                ],
                'token' => bin2hex(random_bytes(32))
            ], JSON_UNESCAPED_UNICODE);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка сервера'], JSON_UNESCAPED_UNICODE);
        }
    }

    // Регистрация пользователя
    public function register()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['email']) || empty($input['password']) || empty($input['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Требуется имя, email и пароль'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $name = trim($input['name']);
        $email = trim($input['email']);
        $password = password_hash($input['password'], PASSWORD_DEFAULT);
        $phone = $input['phone'] ?? '';

        try {
            // Проверка, что email не занят
            $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->bindValue(':email', $email);
            $stmt->execute();
            
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Email уже занят'], JSON_UNESCAPED_UNICODE);
                return;
            }

            // Создание пользователя
            $stmt = $this->conn->prepare(
                "INSERT INTO users (name, email, phone, password, role) VALUES (:name, :email, :phone, :password, 'user')"
            );
            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':phone', $phone);
            $stmt->bindValue(':password', $password);
            $stmt->execute();

            $userId = $this->conn->lastInsertId();

            echo json_encode([
                'ok' => true,
                'user' => [
                    'id' => $userId,
                    'name' => $name,
                    'email' => $email,
                    'role' => 'user'
                ],
                'token' => bin2hex(random_bytes(32))
            ], JSON_UNESCAPED_UNICODE);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка при регистрации'], JSON_UNESCAPED_UNICODE);
        }
    }
}
