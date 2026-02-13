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
}
