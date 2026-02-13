<?php

class Product {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function all()
    {
        $stmt = $this->conn->prepare(
            "SELECT p.id, p.name, p.price, p.description, p.image_path, c.name AS category
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id"
        );
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id)
    {
        $stmt = $this->conn->prepare(
            "SELECT p.id, p.name, p.price, p.description, p.image_path, c.name AS category
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = :id"
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
