<?php

require_once __DIR__ . '/../routes/api.php';

$uri = $_SERVER['REQUEST_URI'];

if ($uri === '/sharlandia/backend/public/' || $uri === '/sharlandia/backend/public/index.php') {
    echo "<h2>Backend интернет-магазина «Шарландия» запущен</h2>";
}
