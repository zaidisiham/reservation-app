<?php
header('Content-Type: application/json');

// Connexion directe à la base de données
$host = "localhost";
$db_name = "reservation_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Connexion échouée : ' . $e->getMessage()]));
}

// Récupération de l'ID utilisateur
$utilisateur_id = isset($_GET['utilisateur_id']) ? intval($_GET['utilisateur_id']) : 0;

if ($utilisateur_id <= 0) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT r.id, r.equipement_id, r.date_debut, r.date_fin, e.nom 
        FROM reservations_equipements r 
        JOIN equipements e ON r.equipement_id = e.id 
        WHERE r.utilisateur_id = ? 
        ORDER BY r.date_debut DESC
    ");
    $stmt->execute([$utilisateur_id]);
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($reservations);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
