<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Connexion à la BDD
$pdo = new PDO("mysql:host=localhost;dbname=reservation_db;charset=utf8", "root", "");

// Lire l'ID de l'utilisateur (POST ou GET)
$data = json_decode(file_get_contents("php://input"), true);
$userId = isset($data['userId']) ? intval($data['userId']) : 0;

if ($userId > 0) {
    $sql = "SELECT r.id, r.dateDebut, r.dateFin, r.statut, s.nom AS salle
            FROM reservations r
            JOIN salles s ON r.salleId = s.id
            WHERE r.utilisateurId = :userId
            ORDER BY r.dateDebut DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':userId' => $userId]);

    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reservations);
} else {
    http_response_code(400);
    echo json_encode(["error" => "ID utilisateur manquant ou invalide."]);
}
