<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$db_name = "reservation_db";
$username = "root";
$password = "";

try {
    // Connexion à la base
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Exécution de la requête
    $stmt = $pdo->query("SELECT * FROM equipements WHERE reservable = 1");
    $equipements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($equipements);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}
?>
