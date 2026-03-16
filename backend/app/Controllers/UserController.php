<?php

require_once __DIR__ . '/../Models/User.php';

class UserController {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function index()
    {
        $user = new User($this->conn);
        $data = $user->all();
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function show($id)
    {
        $user = new User($this->conn);
        $data = $user->find($id);
        if (!$data) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"], JSON_UNESCAPED_UNICODE);
            return;
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Нет данных для обновления'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $user = new User($this->conn);
        $user->update($id, $input);
        
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }

    public function delete($id)
    {
        $user = new User($this->conn);
        $user->delete($id);
        
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }
}
