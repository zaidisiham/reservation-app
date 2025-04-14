<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Permettre les requêtes externes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Vérification et récupération de l'ID utilisateur
$utilisateur_id = isset($_GET['utilisateur_id']) ? intval($_GET['utilisateur_id']) : 0;

if ($utilisateur_id <= 0) {
    echo json_encode([]);
    exit;
}

// Paramètres de connexion
$host = "localhost";
$db = "reservation_app";
$user = "root";
$pass = "";
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur DB: " . $e->getMessage()]);
    exit;
}

try {
    $sql = "SELECT id, message, date FROM notifications WHERE utilisateur_id = :id ORDER BY date DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $utilisateur_id]);

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notifications);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur requête: " . $e->getMessage()]);
}
?>
