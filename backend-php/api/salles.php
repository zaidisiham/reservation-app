<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$db_name = "reservation_db";
$username = "root";
$password = "";
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion"]);
    exit;
}

// Récupérer toutes les salles
$stmt = $pdo->query("SELECT * FROM salles");
$salles = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Vérifier si une réservation est active pour cette salle
    $now = date("Y-m-d H:i:s");
    $stmtRes = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE salle_id = ? AND date_debut <= ? AND date_fin >= ?");
    $stmtRes->execute([$row['id'], $now, $now]);
    $reservedNow = $stmtRes->fetchColumn() > 0;

    $salles[] = [
        'id' => $row['id'],
        'nom' => $row['nom'],
        'localisation' => $row['localisation'],
        'capacite' => $row['capacite'],
        'disponibilite' => $reservedNow ? 0 : 1, // ❗️ On calcule dynamiquement la dispo
        'equipements' => ['Projecteur', 'Tableau', 'Wi-Fi'], // à adapter plus tard
    ];
}

echo json_encode($salles);
?>
