<?php
header('Content-Type: application/json');

// Connexion à la base de données
$host = "localhost";
$db_name = "reservation_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Connexion échouée : ' . $e->getMessage()]);
    exit;
}

// Récupération des données envoyées en JSON
$data = json_decode(file_get_contents("php://input"), true);

$equipement_id = $data['equipement_id'] ?? null;
$date_debut = $data['date_debut'] ?? null;
$date_fin = $data['date_fin'] ?? null;
$utilisateur_id = $data['utilisateur_id'] ?? null;

if (!$equipement_id || !$date_debut || !$date_fin || !$utilisateur_id) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

try {
    // Insertion de la réservation
    $stmt = $pdo->prepare("INSERT INTO reservations_equipements (utilisateur_id, equipement_id, date_debut, date_fin) VALUES (?, ?, ?, ?)");
    $stmt->execute([$utilisateur_id, $equipement_id, $date_debut, $date_fin]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
