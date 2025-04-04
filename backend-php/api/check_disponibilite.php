<?php
header("Access-Control-Allow-Origin: *");
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
    die(json_encode(['error' => 'Connexion échouée : ' . $e->getMessage()]));
}

// Récupération des paramètres
$equipement_id = $_GET['equipement_id'] ?? null;
$date_debut = $_GET['date_debut'] ?? null;
$date_fin = $_GET['date_fin'] ?? null;

if (!$equipement_id || !$date_debut || !$date_fin) {
    echo json_encode(['error' => 'Paramètres manquants']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM reservations_equipements
        WHERE equipement_id = ? 
        AND (
            (? BETWEEN date_debut AND date_fin)
            OR (? BETWEEN date_debut AND date_fin)
            OR (? <= date_debut AND ? >= date_fin)
        )
    ");
    $stmt->execute([$equipement_id, $date_debut, $date_fin, $date_debut, $date_fin]);
    $res = $stmt->fetchAll();

    echo json_encode(['disponible' => count($res) === 0]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
