<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';

// Get user's bookings
$stmt = $conn->prepare("
    SELECT b.id, r.name, r.type, b.start_time, b.end_time 
    FROM bookings b
    JOIN resources r ON b.resource_id = r.id
    WHERE b.user_id = ? AND b.status = 'confirmed'
    ORDER BY b.start_time DESC
");
$stmt->execute([$user_id]);
$bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get available resources
$stmt = $conn->query("SELECT id, name, type FROM resources WHERE is_active = TRUE");
$resources = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "bookings" => $bookings,
    "resources" => $resources
]);
?>