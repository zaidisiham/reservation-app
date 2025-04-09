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

// Requête pour récupérer les salles
$sql = "SELECT * FROM salles";
$stmt = $pdo->query($sql);

$salles = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $salles[] = [
        'id' => $row['id'],
        'nom' => $row['nom'],
        'localisation' => $row['localisation'],
        'capacite' => $row['capacite'],
        'disponibilite' => $row['disponibilite'],
        'equipements' => ['Projecteur', 'Tableau', 'Wi-Fi'], // plus tard tu peux les récupérer depuis la base
        // On ne renvoie plus de lien "photo" car c’est géré côté React Native via require()
    ];
}

echo json_encode($salles);
?>