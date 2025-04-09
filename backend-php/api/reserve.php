<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connexion à la base de données
$host = "localhost";
$db_name = "reservation_app";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]);
    exit;
}

// Lire les données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier les données
if (
    !empty($data["utilisateur_id"]) &&
    !empty($data["salle_id"]) &&
    !empty($data["date_debut"]) &&
    !empty($data["date_fin"])
) {
    $utilisateur_id = $data["utilisateur_id"];
    $salle_id = $data["salle_id"];
    $date_debut = $data["date_debut"];
    $date_fin = $data["date_fin"];

    // Vérifier s’il y a déjà une réservation qui chevauche ce créneau
    $sql_check = "SELECT * FROM reservations 
                  WHERE salle_id = :salle_id 
                  AND (
                    (date_debut <= :date_fin AND date_fin >= :date_debut)
                  )";

    $stmt_check = $pdo->prepare($sql_check);
    $stmt_check->execute([
        ":salle_id" => $salle_id,
        ":date_debut" => $date_debut,
        ":date_fin" => $date_fin
    ]);

    if ($stmt_check->rowCount() > 0) {
        http_response_code(409); // Conflit
        echo json_encode([
            "success" => false,
            "message" => "❌ La salle est déjà réservée à ce créneau."
        ]);
        exit;
    }

    // Enregistrer la réservation
    $sql = "INSERT INTO reservations (utilisateur_id, salle_id, date_debut, date_fin, statut)
            VALUES (:utilisateur_id, :salle_id, :date_debut, :date_fin, 'en attente')";

    $stmt = $pdo->prepare($sql);

    if ($stmt->execute([
        ":utilisateur_id" => $utilisateur_id,
        ":salle_id" => $salle_id,
        ":date_debut" => $date_debut,
        ":date_fin" => $date_fin
    ])) {
        echo json_encode(["success" => true, "message" => "Réservation enregistrée avec succès."]);
    } else {
        $error = $stmt->errorInfo();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur SQL : " . $error[2]]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données incomplètes."]);
}
?>
