<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';

// Admin check
if ($user_role !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Admin access required"]);
    exit;
}

// Generate usage report
$stmt = $conn->query("
    SELECT 
        r.name,
        COUNT(b.id) AS total_bookings,
        MAX(b.start_time) AS last_used
    FROM resources r
    LEFT JOIN bookings b ON r.id = b.resource_id
    GROUP BY r.id
");
$report = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($report);
?>