<?php
require_once __DIR__ . '/../../config/database.php';

class Database {
    private $conn;

    public function connect() {
        global $host, $db_name, $username, $password;

        try {
            $this->conn = new PDO(
                "mysql:host=$host;dbname=$db_name;charset=utf8",
                $username,
                $password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            // Возвращаем ошибку в JSON
            echo json_encode([
                "error" => "Ошибка подключения: " . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        return $this->conn;
    }
}
