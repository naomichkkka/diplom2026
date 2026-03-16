<?php

require_once __DIR__ . '/../Models/Product.php';

class ProductController {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function index()
    {
        $product = new Product($this->conn);
        $data = $product->all();
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function show($id)
    {
        $product = new Product($this->conn);
        $data = $product->find($id);
        if (!$data) {
            http_response_code(404);
            echo json_encode(["error" => "Product not found"], JSON_UNESCAPED_UNICODE);
            return;
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function store()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['name']) || empty($input['price'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Требуется название и цена'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $product = new Product($this->conn);
        $id = $product->create($input);
        
        echo json_encode(['ok' => true, 'id' => $id], JSON_UNESCAPED_UNICODE);
    }

    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Нет данных для обновления'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $product = new Product($this->conn);
        $product->update($id, $input);
        
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }

    public function delete($id)
    {
        $product = new Product($this->conn);
        $product->delete($id);
        
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    }
}
