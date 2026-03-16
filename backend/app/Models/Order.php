<?php

class Order {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function all($userId = null)
    {
        if ($userId) {
            $stmt = $this->conn->prepare(
                "SELECT o.*, u.name as user_name, u.email as user_email
                 FROM orders o
                 LEFT JOIN users u ON o.user_id = u.id
                 WHERE o.user_id = :user_id
                 ORDER BY o.created_at DESC"
            );
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        } else {
            $stmt = $this->conn->prepare(
                "SELECT o.*, u.name as user_name, u.email as user_email
                 FROM orders o
                 LEFT JOIN users u ON o.user_id = u.id
                 ORDER BY o.created_at DESC"
            );
        }
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Добавляем items для каждого заказа
        foreach ($orders as &$order) {
            $itemsStmt = $this->conn->prepare("SELECT * FROM order_items WHERE order_id = :order_id");
            $itemsStmt->bindValue(':order_id', $order['id'], PDO::PARAM_INT);
            $itemsStmt->execute();
            $order['items'] = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        return $orders;
    }

    public function find($id)
    {
        $stmt = $this->conn->prepare(
            "SELECT o.*, u.name as user_name, u.email as user_email
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE o.id = :id"
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($order) {
            // Получаем элементы заказа
            $itemsStmt = $this->conn->prepare("SELECT * FROM order_items WHERE order_id = :order_id");
            $itemsStmt->bindValue(':order_id', $id, PDO::PARAM_INT);
            $itemsStmt->execute();
            $order['items'] = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        return $order;
    }

    public function create($data)
    {
        $this->conn->beginTransaction();
        
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, delivery_address, delivery_method, payment_method, total, status, notes) 
                 VALUES (:user_id, :customer_name, :customer_phone, :customer_email, :delivery_address, :delivery_method, :payment_method, :total, 'pending', :notes)"
            );
            $stmt->bindValue(':user_id', $data['user_id'] ?? 1, PDO::PARAM_INT);
            $stmt->bindValue(':customer_name', $data['customer_name'] ?? 'Гость');
            $stmt->bindValue(':customer_phone', $data['customer_phone'] ?? '');
            $stmt->bindValue(':customer_email', $data['customer_email'] ?? '');
            $stmt->bindValue(':delivery_address', $data['delivery_address'] ?? '');
            $stmt->bindValue(':delivery_method', $data['delivery_method'] ?? 'Самовывоз');
            $stmt->bindValue(':payment_method', $data['payment_method'] ?? 'Наличные');
            $stmt->bindValue(':total', $data['total'] ?? 0);
            $stmt->bindValue(':notes', $data['notes'] ?? '');
            $stmt->execute();
            
            $orderId = $this->conn->lastInsertId();
            
            // Добавляем элементы заказа
            if (!empty($data['items'])) {
                $itemStmt = $this->conn->prepare(
                    "INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) 
                     VALUES (:order_id, :product_id, :product_name, :quantity, :unit_price)"
                );
                
                foreach ($data['items'] as $item) {
                    $itemStmt->bindValue(':order_id', $orderId);
                    $itemStmt->bindValue(':product_id', $item['id'] ?? 0, PDO::PARAM_INT);
                    $itemStmt->bindValue(':product_name', $item['name']);
                    $itemStmt->bindValue(':quantity', $item['qty'] ?? 1, PDO::PARAM_INT);
                    $itemStmt->bindValue(':unit_price', $item['price']);
                    $itemStmt->execute();
                }
            }
            
            $this->conn->commit();
            return $orderId;
            
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function updateStatus($id, $status)
    {
        $stmt = $this->conn->prepare("UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id");
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }
        
    public function delete($id)
    {
        // Удаляем элементы заказа
        $stmt = $this->conn->prepare("DELETE FROM order_items WHERE order_id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        // Удаляем заказ
        $stmt = $this->conn->prepare("DELETE FROM orders WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }
}
