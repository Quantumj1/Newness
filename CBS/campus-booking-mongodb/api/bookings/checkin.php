<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../includes/db.php';

$booking_id = $_POST['booking_id'] ?? null;

// Mark booking as checked-in
$stmt = $conn->prepare("
    UPDATE bookings 
    SET status = 'checked_in' 
    WHERE id = ?
");
$stmt->execute([$booking_id]);

echo json_encode(["message" => "Checked in successfully"]);
?>