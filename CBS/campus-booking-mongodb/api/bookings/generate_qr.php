<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';

$booking_id = $_GET['id'] ?? null;

// Validate booking ownership
$stmt = $conn->prepare("
    SELECT b.id, r.name 
    FROM bookings b
    JOIN resources r ON b.resource_id = r.id
    WHERE b.id = ? AND b.user_id = ?
");
$stmt->execute([$booking_id, $user_id]);
$booking = $stmt->fetch();

if (!$booking) {
    http_response_code(404);
    exit;
}

// Generate QR
$qrContent = "Booking ID: {$booking['id']}\nResource: {$booking['name']}";
$qrCode = new Endroid\QrCode\QrCode($qrContent);

header('Content-Type: '.$qrCode->getContentType());
echo $qrCode->writeString();
?>