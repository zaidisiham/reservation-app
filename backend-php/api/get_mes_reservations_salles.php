<?php
header('Content-Type: application/json');

$host = "localhost";
$db_name = "reservation_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur connexion : ' . $e->getMessage()]);
    exit;
}

$utilisateur_id = isset($_GET['utilisateur_id']) ? intval($_GET['utilisateur_id']) : 0;
if ($utilisateur_id <= 0) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT r.id, s.nom, r.date_debut, r.date_fin 
        FROM reservations r
        JOIN salles s ON r.salle_id = s.id
        WHERE r.utilisateur_id = ?
        ORDER BY r.date_debut DESC
    ");
    $stmt->execute([$utilisateur_id]);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($reservations);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur requête : ' . $e->getMessage()]);
}
