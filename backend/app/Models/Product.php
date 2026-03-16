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
            "SELECT p.id, p.name, p.price, p.description, p.image_path, p.is_popular, c.name AS category
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id"
        );
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id)
    {
        $stmt = $this->conn->prepare(
            "SELECT p.id, p.name, p.price, p.description, p.image_path, p.is_popular, c.name AS category
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = :id"
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO products (name, category_id, price, description, image_path, is_popular) 
             VALUES (:name, :category_id, :price, :description, :image_path, :is_popular)"
        );
        $stmt->bindValue(':name', $data['name']);
        $stmt->bindValue(':category_id', $data['category'] ?? null);
        $stmt->bindValue(':price', $data['price']);
        $stmt->bindValue(':description', $data['description'] ?? '');
        $stmt->bindValue(':image_path', $data['image_path'] ?? '');
        $stmt->bindValue(':is_popular', $data['is_popular'] ?? 0, PDO::PARAM_INT);
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    public function update($id, $data)
    {
        $fields = [];
        $params = ['id' => $id];

        if (isset($data['name'])) {
            $fields[] = 'name = :name';
            $params['name'] = $data['name'];
        }
        if (isset($data['price'])) {
            $fields[] = 'price = :price';
            $params['price'] = $data['price'];
        }
        if (isset($data['description'])) {
            $fields[] = 'description = :description';
            $params['description'] = $data['description'];
        }
        if (isset($data['image_path'])) {
            $fields[] = 'image_path = :image_path';
            $params['image_path'] = $data['image_path'];
        }
        if (isset($data['is_popular'])) {
            $fields[] = 'is_popular = :is_popular';
            $params['is_popular'] = $data['is_popular'] ? 1 : 0;
        }
        if (isset($data['category'])) {
            $fields[] = 'category_id = :category_id';
            $params['category_id'] = $data['category'];
        }

        if (empty($fields)) return;

        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
    }

    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM products WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }
}
