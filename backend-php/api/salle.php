<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Connexion à la base de données
$host = "localhost";
$db_name = "reservation_app";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion"]);
    exit;
}

// Vérifier qu’un ID est présent dans l’URL
if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "ID de salle manquant."]);
    exit;
}

$id = $_GET['id'];

// Préparer la requête pour récupérer une seule salle
$stmt = $pdo->prepare("SELECT * FROM salles WHERE id = ?");
$stmt->execute([$id]);

$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row) {
    $salle = [
        'id' => $row['id'],
        'nom' => $row['nom'],
        'localisation' => $row['localisation'],
        'capacite' => $row['capacite'],
        'disponibilite' => $row['disponibilite'],
        'equipements' => ['Projecteur', 'Tableau', 'Wi-Fi'], // à adapter plus tard si tu stockes en DB
    ];
    echo json_encode($salle);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Salle non trouvée."]);
}
?>
